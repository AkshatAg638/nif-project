import express from 'express';
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeNewsletter,
} from '../controllers/newsletterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/subscribe', strictLimiter, subscribeNewsletter);
router.post('/unsubscribe', strictLimiter, unsubscribeNewsletter);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.get('/', getSubscribers);

export default router;
