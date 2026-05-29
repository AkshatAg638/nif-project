import express from 'express';
import {
  applyVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
  getMyVolunteerProfile,
} from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateVolunteer } from '../middleware/validationMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

router.post('/', validateVolunteer, applyVolunteer);

// Protected routes (All logged-in users)
router.get('/me', protect, getMyVolunteerProfile);

// Protected routes (Admin / Editor)
router.get('/', protect, authorize('super-admin', 'admin', 'editor'), getVolunteers);
router.put('/:id', protect, authorize('super-admin', 'admin', 'editor'), auditLogger('UPDATE_VOLUNTEER_STATUS'), updateVolunteerStatus);
router.delete('/:id', protect, authorize('super-admin', 'admin', 'editor'), auditLogger('DELETE_VOLUNTEER'), deleteVolunteer);

export default router;
