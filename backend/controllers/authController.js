import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateSecret, verifyTOTP } from '../utils/twoFactor.js';
import { sendEmail } from '../utils/email.js';

// Generate Token Helpers
const generateToken = (id, expiresIn = '1h') => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_123456', {
    expiresIn,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, '1h');
  const refreshToken = generateToken(user._id, '7d');

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  };

  res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Prevent registering with the predefined admin email
    if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not allowed for Admin credentials. Please log in directly.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // All registered users are normal users (admin/super-admin roles are seeded or manually assigned)
    const role = 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again in ${remainingTime} minutes.`,
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
        user.loginAttempts = 0; // Reset counter
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: `Invalid credentials. Attempts left: ${5 - user.loginAttempts}`,
      });
    }

    // Reset login attempts on successful credentials match
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Check if 2FA is required
    if (user.twoFactorEnabled) {
      // Issue a temporary short-lived token to perform 2FA login
      const tempToken = jwt.sign({ id: user._id, is2faPending: true }, process.env.JWT_SECRET || 'fallback_secret_123456', {
        expiresIn: '5m',
      });
      return res.status(200).json({
        success: true,
        twoFactorRequired: true,
        tempToken,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA Code and Login
// @route   POST /api/auth/verify-2fa
// @access  Public (Requires Temp Token)
export const verify2FALogin = async (req, res, next) => {
  try {
    const { token, code } = req.body;

    if (!token || !code) {
      return res.status(400).json({ success: false, message: 'Token and 2FA code are required' });
    }

    // Decode temp token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_123456');
    if (!decoded.is2faPending) {
      return res.status(401).json({ success: false, message: 'Invalid 2FA verification token' });
    }

    const user = await User.findById(decoded.id).select('+twoFactorSecret');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify TOTP code
    const isVerified = verifyTOTP(code, user.twoFactorSecret);
    if (!isVerified) {
      return res.status(401).json({ success: false, message: 'Invalid 2FA code' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Setup/Get 2FA configuration secret
// @route   POST /api/auth/setup-2fa
// @access  Private
export const setup2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is already enabled' });
    }

    const secret = generateSecret();
    user.twoFactorTempSecret = secret;
    await user.save();

    // Construct standard OTP auth URL for scanning (Google Authenticator)
    const otpAuthUrl = `otpauth://totp/Namokriti:${user.email}?secret=${secret}&issuer=Namokriti`;

    res.status(200).json({
      success: true,
      secret,
      otpAuthUrl,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm & Enable 2FA
// @route   POST /api/auth/confirm-2fa
// @access  Private
export const confirm2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id).select('+twoFactorTempSecret');

    if (!user.twoFactorTempSecret) {
      return res.status(400).json({ success: false, message: '2FA setup was not initiated' });
    }

    const isVerified = verifyTOTP(code, user.twoFactorTempSecret);
    if (!isVerified) {
      return res.status(400).json({ success: false, message: 'Invalid code. Verification failed.' });
    }

    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorTempSecret = undefined;
    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/disable-2fa
// @access  Private
export const disable2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id).select('+twoFactorSecret');

    const isVerified = verifyTOTP(code, user.twoFactorSecret);
    if (!isVerified) {
      return res.status(400).json({ success: false, message: 'Invalid 2FA code. Could not disable.' });
    }

    user.twoFactorSecret = undefined;
    user.twoFactorEnabled = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token and set resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
