import express from 'express';
import {
  createTask,
  getAdminTasks,
  getMyTasks,
  completeTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Volunteer routes (any logged-in user)
router.get('/my', protect, getMyTasks);
router.put('/:id/complete', protect, completeTask);

// Admin routes
router.post('/', protect, authorize('super-admin', 'admin', 'editor'), createTask);
router.get('/', protect, authorize('super-admin', 'admin', 'editor'), getAdminTasks);
router.delete('/:id', protect, authorize('super-admin', 'admin', 'editor'), deleteTask);

export default router;
