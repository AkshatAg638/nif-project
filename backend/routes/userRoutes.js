import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

// Strictly restrict user management to admin and super-admin roles
router.use(protect);
router.use(authorize('super-admin', 'admin'));

router
  .route('/')
  .get(getUsers)
  .post(auditLogger('CREATE_USER'), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(auditLogger('UPDATE_USER'), updateUser)
  .delete(auditLogger('DELETE_USER'), deleteUser);

export default router;
