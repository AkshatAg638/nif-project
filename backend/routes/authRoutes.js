import express from 'express';
import {
  register,
  login,
  verify2FALogin,
  getMe,
  setup2FA,
  confirm2FA,
  disable2FA,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', strictLimiter, validateRegister, register);
router.post('/login', strictLimiter, validateLogin, login);
router.post('/verify-2fa', strictLimiter, verify2FALogin);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/setup-2fa', protect, setup2FA);
router.post('/confirm-2fa', protect, confirm2FA);
router.post('/disable-2fa', protect, disable2FA);

export default router;
