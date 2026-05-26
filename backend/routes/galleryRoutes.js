import express from 'express';
import { getGallery, createGallery, deleteGallery } from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getGallery);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('ADD_GALLERY_MEDIA'), createGallery);
router.delete('/:id', auditLogger('DELETE_GALLERY_MEDIA'), deleteGallery);

export default router;
