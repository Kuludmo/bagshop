import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordUpdateValidation,
} from '../middleware/validate';

const router = Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileUpdateValidation, updateProfile);
router.put('/password', protect, passwordUpdateValidation, updatePassword);

export default router;
