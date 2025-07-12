import { Router } from 'express';
import { body, param } from 'express-validator';
import { BudgetController } from '@/controllers/budget.controller';
import { authenticate } from '@/middleware/auth';
import { apiRateLimit } from '@/middleware/rateLimit';
import { handleValidationErrors } from '@/middleware/validation';

const router = Router();

const uuidValidation = param('id').isUUID().withMessage('Invalid budget ID');

const createBudgetValidation = [
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
  body('maximum').isFloat({ min: 0.01 }).withMessage('Maximum amount must be greater than 0'),
  body('theme')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Theme must be a valid hex color code'),
];

const updateBudgetValidation = [
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
  body('maximum')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Maximum amount must be greater than 0'),
  body('theme')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Theme must be a valid hex color code'),
];

router.use(authenticate);
router.use(apiRateLimit);

router.get('/', BudgetController.getBudgets);
router.get('/:id', uuidValidation, handleValidationErrors, BudgetController.getBudgetById);
router.get(
  '/:id/spending',
  uuidValidation,
  handleValidationErrors,
  BudgetController.getBudgetWithSpending
);
router.post('/', createBudgetValidation, handleValidationErrors, BudgetController.createBudget);
router.put(
  '/:id',
  uuidValidation,
  updateBudgetValidation,
  handleValidationErrors,
  BudgetController.updateBudget
);
router.delete('/:id', uuidValidation, handleValidationErrors, BudgetController.deleteBudget);

export default router;
