import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateContactMessage } from '../middleware/validationMiddleware.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

router.post('/', strictLimiter, validateContactMessage, submitContactMessage);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.get('/', getContactMessages);
router.put('/:id', auditLogger('UPDATE_CONTACT_MESSAGE_STATUS'), updateContactMessageStatus);
router.delete('/:id', auditLogger('DELETE_CONTACT_MESSAGE'), deleteContactMessage);

export default router;
