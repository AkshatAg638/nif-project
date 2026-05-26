import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';
import upload from '../middleware/uploadMiddleware.js';

// Define a middleware-friendly router that parses user context optionally for drafts access
import { protect as optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

const checkUserSessionQuiet = async (req, res, next) => {
  // Silent auth session parsing to handle public/draft views correctly
  try {
    await optionalProtect(req, res, () => {});
  } catch (err) {}
  next();
};

router.route('/').get(checkUserSessionQuiet, getBlogs);
router.route('/:identifier').get(checkUserSessionQuiet, getBlog);

// Protected routes (Admin / Editor)
router.use(protect);
router.use(authorize('super-admin', 'admin', 'editor'));

router.post('/', upload.single('image'), auditLogger('CREATE_BLOG'), createBlog);
router.put('/:id', upload.single('image'), auditLogger('UPDATE_BLOG'), updateBlog);
router.delete('/:id', auditLogger('DELETE_BLOG'), deleteBlog);

export default router;
