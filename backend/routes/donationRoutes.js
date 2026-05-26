import express from 'express';
import {
  checkoutStripe,
  checkoutRazorpay,
  verifyRazorpayPayment,
  stripeWebhook,
  razorpayWebhook,
  getDonations,
  exportDonationsCSV,
  getStats,
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateDonation } from '../middleware/validationMiddleware.js';
import { globalLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public checkouts & verifications
router.post('/checkout/stripe', globalLimiter, validateDonation, checkoutStripe);
router.post('/checkout/razorpay', globalLimiter, validateDonation, checkoutRazorpay);
router.post('/verify/razorpay', globalLimiter, verifyRazorpayPayment);

// Webhook endpoints (CORS bypassed and parsed as raw body in server.js for Stripe verification)
router.post('/webhook/stripe', stripeWebhook);
router.post('/webhook/razorpay', razorpayWebhook);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.get('/', getDonations);
router.get('/export', exportDonationsCSV);
router.get('/stats', getStats);

export default router;
