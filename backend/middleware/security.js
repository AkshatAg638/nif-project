import crypto from 'crypto';

// ─── Secure Cookie Options ────────────────────────────────────────────────────
export const secureCookieOptions = {
  httpOnly: true,                                    // Prevents JS access (XSS mitigation)
  secure: process.env.NODE_ENV === 'production',     // HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // CSRF mitigation
  maxAge: 7 * 24 * 60 * 60 * 1000,                  // 7 days
  path: '/',
};

// ─── Clear Auth Cookie Options (for logout) ───────────────────────────────────
export const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/',
};

// ─── Remove Server Fingerprinting Headers ─────────────────────────────────────
export const removeFingerprinting = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
};

// ─── Request Size Enforcer (extra layer on top of body-parser limits) ─────────
export const requestSizeLimiter = (req, res, next) => {
  const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > MAX_CONTENT_LENGTH) {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Maximum allowed size is 10MB.',
    });
  }
  next();
};

// ─── XSS Pattern Sanitizer (catches obvious XSS in JSON body fields) ──────────
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /<iframe/gi,
  /eval\(/gi,
  /document\.cookie/gi,
  /window\.location/gi,
];

const sanitizeValue = (value) => {
  if (typeof value !== 'string') return value;
  let sanitized = value;
  XSS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });
  return sanitized.trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Preserve arrays — sanitize each element but keep the array structure
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === 'string') return sanitizeValue(item);
      if (typeof item === 'object' && item !== null) return sanitizeObject(item);
      return item;
    });
  }

  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      result[key] = sanitizeValue(val);
    } else if (typeof val === 'object' && val !== null) {
      result[key] = sanitizeObject(val);
    } else {
      result[key] = val;
    }
  }
  return result;
};

export const xssSanitizer = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

// ─── HTTP Parameter Pollution Guard ───────────────────────────────────────────
// Picks the last value when a query param appears multiple times (prevents bypass tricks)
export const hppGuard = (req, res, next) => {
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    }
  }
  next();
};

// ─── Suspicious Request Logger ────────────────────────────────────────────────
const SUSPICIOUS_PATTERNS = [
  /(\.\.\/)/, // Path traversal
  /(union.*select|select.*from|insert.*into|drop.*table)/i, // SQL injection
  /(<script|javascript:|vbscript:)/i, // XSS attempt
  /(\beval\b|\bexec\b)/i, // Code execution
  /(\/etc\/passwd|\/etc\/shadow|\/proc\/)/i, // LFI attempts
  /(\bOR\b.*=.*|'.*OR.*')/i, // SQL injection
];

export const suspiciousRequestDetector = (req, res, next) => {
  const requestData = JSON.stringify({
    url: req.url,
    query: req.query,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      referer: req.headers['referer'],
    },
  });

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(requestData)) {
      console.warn(`[SECURITY] Suspicious request detected from ${req.ip} | URL: ${req.originalUrl} | Pattern: ${pattern}`);
      return res.status(400).json({
        success: false,
        message: 'Request rejected due to security policy violation.',
      });
    }
  }
  next();
};

// ─── Security Audit Logger ────────────────────────────────────────────────────
export const securityLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']?.substring(0, 100),
      duration: `${duration}ms`,
    };

    // Log security-relevant responses (auth failures, 4xx, 5xx)
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.warn(`[SECURITY] Auth failure: ${JSON.stringify(logEntry)}`);
    } else if (res.statusCode >= 500) {
      console.error(`[ERROR] Server error: ${JSON.stringify(logEntry)}`);
    } else if (process.env.NODE_ENV !== 'production' && res.statusCode >= 400) {
      console.warn(`[WARN] ${JSON.stringify(logEntry)}`);
    }
  });

  next();
};

// ─── CSRF Token Generator & Validator ────────────────────────────────────────
export const generateCsrfToken = () => crypto.randomBytes(32).toString('hex');

export const setCsrfToken = (req, res, next) => {
  // Only set a CSRF token if this is a GET request and token doesn't exist
  if (req.method === 'GET' && !req.cookies?.csrfToken) {
    const token = generateCsrfToken();
    res.cookie('csrfToken', token, {
      httpOnly: false, // Must be readable by JS to include in headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  next();
};

// ─── IP Whitelist for Admin Routes ───────────────────────────────────────────
// Uncomment and configure in production if admin should be IP-restricted
// export const adminIpWhitelist = (req, res, next) => {
//   const ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS || '').split(',').map(ip => ip.trim());
//   const clientIp = req.ip || req.connection.remoteAddress;
//   if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
//     console.warn(`[SECURITY] Blocked admin access from unauthorized IP: ${clientIp}`);
//     return res.status(403).json({ success: false, message: 'Access denied from this IP.' });
//   }
//   next();
// };
