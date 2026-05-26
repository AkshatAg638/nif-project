import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectUpdate,
  addProjectGalleryImage,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getProjects);
router.route('/:identifier').get(getProject);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('CREATE_PROJECT'), createProject);
router.put('/:id', upload.single('image'), auditLogger('UPDATE_PROJECT'), updateProject);
router.delete('/:id', auditLogger('DELETE_PROJECT'), deleteProject);

router.post('/:id/updates', auditLogger('ADD_PROJECT_UPDATE'), addProjectUpdate);
router.post('/:id/gallery', upload.single('image'), auditLogger('ADD_PROJECT_GALLERY_IMAGE'), addProjectGalleryImage);

export default router;
