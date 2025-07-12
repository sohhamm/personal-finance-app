import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { TRANSACTION_CATEGORIES } from '@/constants/categories';
import { TransactionController } from '@/controllers/transaction.controller';
import { authenticate } from '@/middleware/auth';
import { apiRateLimit } from '@/middleware/rateLimit';
import { handleValidationErrors } from '@/middleware/validation';

const router = Router();

// Common validations
const uuidValidation = param('id').isUUID().withMessage('Invalid transaction ID');

const createTransactionValidation = [
  body('recipientSender')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Recipient/Sender name is required and must be less than 255 characters'),
  body('category')
    .isIn(TRANSACTION_CATEGORIES)
    .withMessage('Invalid category'),
  body('transactionDate').isISO8601().withMessage('Valid transaction date is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('transactionType')
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be either income or expense'),
  body('recurring').optional().isBoolean().withMessage('Recurring must be a boolean'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];

const updateTransactionValidation = [
  body('recipientSender')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Recipient/Sender name must be less than 255 characters'),
  body('category')
    .optional()
    .isIn(TRANSACTION_CATEGORIES)
    .withMessage('Invalid category'),
  body('transactionDate').optional().isISO8601().withMessage('Valid transaction date is required'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('transactionType')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be either income or expense'),
  body('recurring').optional().isBoolean().withMessage('Recurring must be a boolean'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
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
  query('category')
    .optional()
    .isIn(TRANSACTION_CATEGORIES)
    .withMessage('Invalid category'),
  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'name'])
    .withMessage('Sort by must be date, amount, or name'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO 8601 date'),
];

// Apply authentication to all routes
router.use(authenticate);
router.use(apiRateLimit);

// Routes
router.get('/', queryValidation, handleValidationErrors, TransactionController.getTransactions);
router.get('/categories', TransactionController.getCategories);
router.get('/stats', TransactionController.getTransactionStats);
router.get(
  '/:id',
  uuidValidation,
  handleValidationErrors,
  TransactionController.getTransactionById
);
router.post(
  '/',
  createTransactionValidation,
  handleValidationErrors,
  TransactionController.createTransaction
);
router.put(
  '/:id',
  uuidValidation,
  updateTransactionValidation,
  handleValidationErrors,
  TransactionController.updateTransaction
);
router.delete(
  '/:id',
  uuidValidation,
  handleValidationErrors,
  TransactionController.deleteTransaction
);

export default router;
