# Namokriti MERN NGO Platform

A production-ready, secure, and enterprise-grade MERN Stack web application built for the **Namokriti International Foundation**.

---

## Key Features

1. **Enterprise Security**: Account Lockout (locks out for 15 mins after 5 wrong attempts), cryptographically secure native TOTP Two-Factor Authentication (2FA) for admins, Helmet headers, MongoDB injection protection, CORS whitelisting, and Joi/Zod alternative request validations.
2. **Payment Integrations & Webhooks**: Integrated Stripe and Razorpay gateways supporting one-time and recurring donations with cryptographic signature webhook validations.
3. **Automated Receipts & Emails**: Automatic PDF receipt creation (using PDFKit) and thank-you dispatch using Nodemailer SMTP.
4. **Dynamic CMS Configuration**: CMS configurations singleton model in database, allowing administrators to modify landing page headers, hero text, images, team directories, and corporate sponsors directly from the admin panel without touching code.
5. **Analytics & Management Panels**: Line and pie analytics charts (using Recharts), audit log trackers logging all administrative operations, and spreadsheet CSV exports.

---

## Folder Layout

```
nif-project/
├── backend/                # Express API & Mongoose models
│   ├── config/             # DB & Cloud configurations
│   ├── controllers/        # Route controllers (Auth, Payments, CRUDs)
│   ├── middleware/         # Security & Upload handlers
│   ├── models/             # Mongoose schemas (User, Donation, AuditLog, etc.)
│   ├── routes/             # REST API routes mapping
│   ├── utils/              # 2FA, PDF receipt, and email dispatch helpers
│   └── server.js
├── frontend/               # React + Vite client-side app
│   ├── public/             # Robots.txt, sitemaps, templates
│   └── src/
│       ├── components/     # Common layouts & SEO tags
│       ├── context/        # Session & Theme states
│       ├── pages/          # Landing pages, Legal docs, and Admin dashboard
│       └── App.jsx
└── vercel.json             # SPA rewrites configuration
```

---

## Local Setup Instructions

### Prerequisites
- Node.js (v20+)
- MongoDB (running locally or a remote Atlas connection string)
- Redis (optional, if caching is enabled)

### Step 1: Configure Environment Variables
Create a `.env` file in the `backend` directory mapping the structure shown in `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/namokriti
JWT_SECRET=your_secret_access_key
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_password
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_id
RAZORPAY_KEY_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
```

### Step 2: Spin Up Services
You can run the full stack locally using Docker Compose, or spin up packages individually.

#### Option A: Docker Compose (Recommended)
From the root workspace directory, run:
```bash
docker-compose up --build
```
This spawns:
- MongoDB instance at `mongodb://localhost:27017`
- Redis instance at `redis://localhost:6379`
- Express API server at `http://localhost:5000`

#### Option B: Standalone Run
1. **Initialize Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Initialize Frontend Client**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## First Boot & Admin Access
1. Start the backend.
2. Sign up on the registration page at `http://localhost:5173/register`.
3. The **first user registered** is automatically granted the `super-admin` role. All subsequent signups default to normal `user` status.
4. Access the administrative dashboard directly at `http://localhost:5173/admin`.
5. Secure your account by clicking **Configure 2FA** on the Profile page, scanning the credentials key in Google Authenticator, and confirming the TOTP passcode.

---

## Payment Webhooks Configurations

### Stripe Webhook Setup
To verify signatures in production, point your Stripe Webhook endpoint to:
`https://your-api.com/api/donations/webhook/stripe`
Listen to events:
- `checkout.session.completed`

### Razorpay Webhook Setup
Configure Razorpay Webhook in your merchant dashboard to:
`https://your-api.com/api/donations/webhook/razorpay`
Listen to events:
- `payment.captured`

Set the secrets in your backend `.env` as `STRIPE_WEBHOOK_SECRET` and `RAZORPAY_WEBHOOK_SECRET`.

---

## Production Deployment

### Frontend (Vercel)
The directory is preconfigured with `vercel.json` rewrites.
1. Connect your GitHub repository to Vercel.
2. Select the `frontend` subdirectory as the project root.
3. Configure the environment variable `VITE_API_URL` pointing to your deployed backend.

### Backend (Render / Heroku)
1. Deploy the backend directory as a web service.
2. Link the database using a MongoDB Atlas connection string.
3. Define the production environment variables inside Render settings dashboard.
