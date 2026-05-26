import express from 'express';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getTeamMembers);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('CREATE_TEAM_MEMBER'), createTeamMember);
router.put('/:id', upload.single('image'), auditLogger('UPDATE_TEAM_MEMBER'), updateTeamMember);
router.delete('/:id', auditLogger('DELETE_TEAM_MEMBER'), deleteTeamMember);

export default router;
