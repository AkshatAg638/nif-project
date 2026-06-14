import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import { globalLimiter, strictLimiter } from './middleware/rateLimiter.js';
import {
  removeFingerprinting,
  requestSizeLimiter,
  xssSanitizer,
  hppGuard,
  suspiciousRequestDetector,
  securityLogger,
} from './middleware/security.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import programRoutes from './routes/programRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars FIRST before any other config
dotenv.config();

// Connect to database
connectDB();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ─── 1. Trust Proxy (required when behind nginx/cloudflare) ───────────────────
app.set('trust proxy', 1);

// ─── 2. Remove Server Fingerprinting ─────────────────────────────────────────
app.use(removeFingerprinting);

// ─── 3. Security Logger ───────────────────────────────────────────────────────
app.use(securityLogger);

// ─── 4. Global Rate Limiting ─────────────────────────────────────────────────
app.use(globalLimiter);

// ─── 5. CORS Configuration ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  ...(isProduction ? ['https://namokriti.org', 'https://www.namokriti.org'] : ['http://localhost:3000']),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // Cache preflight for 24 hours
  })
);

// ─── 6. Stripe Webhook (raw body BEFORE any json parsing) ────────────────────
app.use('/api/donations/webhook/stripe', express.raw({ type: 'application/json' }));

// ─── 7. Body Parsers with size limits ────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── 8. Cookie Parser ────────────────────────────────────────────────────────
app.use(cookieParser(process.env.COOKIE_SECRET || process.env.JWT_SECRET));

// Expose public folder statically
app.use('/public', express.static(path.join(__dirname, 'public')));

// ─── 9. Helmet — Full Production Security Headers ────────────────────────────
app.use(
  helmet({
    // Content-Security-Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://checkout.razorpay.com',
          'https://js.stripe.com',
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          // Allow inline scripts needed by Vite in development
          ...(isProduction ? [] : ["'unsafe-inline'", "'unsafe-eval'"]),
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Required for styled-components / Tailwind
          'https://fonts.googleapis.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'data:',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https:',         // Allow images from any HTTPS source (Cloudinary etc.)
          'https://res.cloudinary.com',
        ],
        connectSrc: [
          "'self'",
          'https://api.razorpay.com',
          'https://api.stripe.com',
          'https://lumberjack.razorpay.com',
          'https://www.google-analytics.com',
          ...(isProduction ? [] : ['ws://localhost:*', 'http://localhost:*']),
        ],
        frameSrc: [
          "'self'",
          'https://api.razorpay.com',
          'https://js.stripe.com',
          'https://hooks.stripe.com',
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"], // Clickjacking protection
        upgradeInsecureRequests: isProduction ? [] : null,
      },
      reportOnly: false,
    },

    // HTTP Strict Transport Security
    strictTransportSecurity: {
      maxAge: 31536000,           // 1 year
      includeSubDomains: true,
      preload: true,
    },

    // X-Frame-Options (prevents clickjacking)
    frameguard: { action: 'deny' },

    // X-Content-Type-Options (prevents MIME sniffing)
    noSniff: true,

    // X-XSS-Protection (legacy browsers)
    xssFilter: true,

    // Referrer-Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    // Permissions-Policy (disables dangerous browser APIs)
    permittedCrossDomainPolicies: false,

    // Hide X-Powered-By
    hidePoweredBy: true,

    // DNS Prefetch Control
    dnsPrefetchControl: { allow: false },

    // IE No Open
    ieNoOpen: true,

    // Don't expose download options in IE
    noOpenDownload: true,
  })
);

// ─── 10. Permissions-Policy header (not in helmet by default) ─────────────────
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=(self "https://checkout.razorpay.com" "https://js.stripe.com")',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'fullscreen=(self)',
    ].join(', ')
  );
  next();
});

// ─── 11. MongoDB Injection Sanitizer ─────────────────────────────────────────
app.use(mongoSanitize({
  replaceWith: '_',
  allowDots: false,
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] MongoDB injection attempt sanitized: key="${key}" from IP ${req.ip}`);
  },
}));

// ─── 12. XSS Body Sanitizer ──────────────────────────────────────────────────
app.use(xssSanitizer);

// ─── 13. HTTP Parameter Pollution Guard ──────────────────────────────────────
app.use(hppGuard);

// ─── 14. Request Size Limiter ─────────────────────────────────────────────────
app.use(requestSizeLimiter);

// ─── 15. Suspicious Request Detector ─────────────────────────────────────────
app.use(suspiciousRequestDetector);

// ─── 16. Mount API Routes ─────────────────────────────────────────────────────

// Auth routes — strict rate limiting is applied per-route inside authRoutes.js
// (login, register, verify-2fa). Session check (/me) must NOT be rate-limited.
app.use('/api/auth', authRoutes);

// Public API routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/settings', settingsRoutes);

// Sensitive action routes — use strict rate limiting
app.use('/api/volunteers', strictLimiter, volunteerRoutes);
app.use('/api/contact', strictLimiter, contactRoutes);
app.use('/api/newsletter', strictLimiter, newsletterRoutes);
app.use('/api/donations', donationRoutes);

// Internal/admin routes
app.use('/api/audit', auditRoutes);
app.use('/api/tasks', taskRoutes);

// ─── 17. Health Check Endpoint ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ─── 18. Root API Info ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Namokriti International Foundation API' });
});

// ─── 19. 404 Handler for unknown API routes ────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// ─── 20. Centralized Error Handler ────────────────────────────────────────────
app.use(errorHandler);

// ─── 21. Start Server ─────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '6002', 10);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// ─── 22. Graceful Shutdown ────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n[SERVER] ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('[SERVER] HTTP server closed.');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('[SERVER] Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[ERROR] UnhandledRejection: ${err.message}`);
  console.error(err.stack);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[ERROR] UncaughtException: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

export default app;
