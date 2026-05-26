import express from 'express';
import {
  applyVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
} from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateVolunteer } from '../middleware/validationMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

router.post('/', validateVolunteer, applyVolunteer);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.get('/', getVolunteers);
router.put('/:id', auditLogger('UPDATE_VOLUNTEER_STATUS'), updateVolunteerStatus);
router.delete('/:id', auditLogger('DELETE_VOLUNTEER'), deleteVolunteer);

export default router;
