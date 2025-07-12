import { Router } from 'express';
import { query } from 'express-validator';
import { OverviewController } from '@/controllers/overview.controller';
import { authenticate } from '@/middleware/auth';
import { apiRateLimit } from '@/middleware/rateLimit';
import { handleValidationErrors } from '@/middleware/validation';

const router = Router();

const trendsValidation = [
  query('months')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Months must be between 1 and 24'),
];

// Apply authentication to all routes
router.use(authenticate);
router.use(apiRateLimit);

// Routes
router.get('/', OverviewController.getOverviewData);
router.get(
  '/trends',
  trendsValidation,
  handleValidationErrors,
  OverviewController.getMonthlyTrends
);

export default router;
