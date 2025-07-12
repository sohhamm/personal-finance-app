import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { RecurringBillController } from '@/controllers/recurringBill.controller';
import { authenticate } from '@/middleware/auth';
import { apiRateLimit } from '@/middleware/rateLimit';
import { handleValidationErrors } from '@/middleware/validation';

const router = Router();

// Common validations
const uuidValidation = param('id').isUUID().withMessage('Invalid recurring bill ID');
const paymentUuidValidation = param('paymentId').isUUID().withMessage('Invalid payment ID');

const createRecurringBillValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name is required and must be less than 255 characters'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('dueDay').isInt({ min: 1, max: 31 }).withMessage('Due day must be between 1 and 31'),
  body('category')
    .isIn([
      'Entertainment',
      'Bills',
      'Groceries',
      'Dining Out',
      'Transportation',
      'Personal Care',
      'Education',
      'Lifestyle',
      'Shopping',
      'General',
    ])
    .withMessage('Invalid category'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];

const updateRecurringBillValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be less than 255 characters'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('dueDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('Due day must be between 1 and 31'),
  body('category')
    .optional()
    .isIn([
      'Entertainment',
      'Bills',
      'Groceries',
      'Dining Out',
      'Transportation',
      'Personal Care',
      'Education',
      'Lifestyle',
      'Shopping',
      'General',
    ])
    .withMessage('Invalid category'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search term must be less than 255 characters'),
  query('sortBy')
    .optional()
    .isIn(['latest', 'oldest', 'a-z', 'z-a', 'highest', 'lowest'])
    .withMessage('Sort by must be latest, oldest, a-z, z-a, highest, or lowest'),
];

const markPaidValidation = [
  body('transactionId').optional().isUUID().withMessage('Transaction ID must be a valid UUID'),
];

// Apply authentication to all routes
router.use(authenticate);
router.use(apiRateLimit);

// Routes
router.get('/', queryValidation, handleValidationErrors, RecurringBillController.getRecurringBills);
router.get('/due-soon', RecurringBillController.getBillsDueSoon);
router.get(
  '/:id',
  uuidValidation,
  handleValidationErrors,
  RecurringBillController.getRecurringBillById
);
router.post(
  '/',
  createRecurringBillValidation,
  handleValidationErrors,
  RecurringBillController.createRecurringBill
);
router.put(
  '/:id',
  uuidValidation,
  updateRecurringBillValidation,
  handleValidationErrors,
  RecurringBillController.updateRecurringBill
);
router.delete(
  '/:id',
  uuidValidation,
  handleValidationErrors,
  RecurringBillController.deleteRecurringBill
);
router.patch(
  '/payments/:paymentId/mark-paid',
  paymentUuidValidation,
  markPaidValidation,
  handleValidationErrors,
  RecurringBillController.markBillAsPaid
);

export default router;
