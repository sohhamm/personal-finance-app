import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '@/controllers/auth.controller';
import { handleValidationErrors } from '@/middleware/validation';
import { authenticate } from '@/middleware/auth';
import { authRateLimit } from '@/middleware/rateLimit';

const router = Router();

// Signup validation
const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Routes
router.post('/signup', authRateLimit, signupValidation, handleValidationErrors, AuthController.signup);
router.post('/login', authRateLimit, loginValidation, handleValidationErrors, AuthController.login);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;