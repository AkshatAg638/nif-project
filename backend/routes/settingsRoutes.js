import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

router.route('/').get(getSettings);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.put('/', auditLogger('UPDATE_WEBSITE_SETTINGS'), updateSettings);

export default router;
