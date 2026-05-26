import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getTestimonials);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('CREATE_TESTIMONIAL'), createTestimonial);
router.put('/:id', upload.single('image'), auditLogger('UPDATE_TESTIMONIAL'), updateTestimonial);
router.delete('/:id', auditLogger('DELETE_TESTIMONIAL'), deleteTestimonial);

export default router;
