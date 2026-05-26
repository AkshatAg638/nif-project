import express from 'express';
import {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getPrograms);
router.route('/:id').get(getProgram);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('CREATE_PROGRAM'), createProgram);
router.put('/:id', upload.single('image'), auditLogger('UPDATE_PROGRAM'), updateProgram);
router.delete('/:id', auditLogger('DELETE_PROGRAM'), deleteProgram);

export default router;
