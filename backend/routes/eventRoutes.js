import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getEvents);
router.route('/:identifier').get(getEvent);
router.post('/:id/rsvp', rsvpEvent);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('CREATE_EVENT'), createEvent);
router.put('/:id', upload.single('image'), auditLogger('UPDATE_EVENT'), updateEvent);
router.delete('/:id', auditLogger('DELETE_EVENT'), deleteEvent);

export default router;
