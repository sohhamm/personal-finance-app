import { Router } from 'express';
import { body, param } from 'express-validator';
import { PotController } from '@/controllers/pot.controller';
import { handleValidationErrors } from '@/middleware/validation';
import { authenticate } from '@/middleware/auth';
import { apiRateLimit } from '@/middleware/rateLimit';

const router = Router();

const uuidValidation = param('id').isUUID().withMessage('Invalid pot ID');

const createPotValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name is required and must be less than 255 characters'),
  body('target')
    .isFloat({ min: 0.01 })
    .withMessage('Target amount must be greater than 0'),
  body('theme')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Theme must be a valid hex color code'),
];

const updatePotValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be less than 255 characters'),
  body('target')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Target amount must be greater than 0'),
  body('theme')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Theme must be a valid hex color code'),
];

const moneyTransactionValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
];

router.use(authenticate);
router.use(apiRateLimit);

router.get('/', PotController.getPots);
router.get('/:id', uuidValidation, handleValidationErrors, PotController.getPotById);
router.get('/:id/progress', uuidValidation, handleValidationErrors, PotController.getPotProgress);
router.post('/', createPotValidation, handleValidationErrors, PotController.createPot);
router.put('/:id', uuidValidation, updatePotValidation, handleValidationErrors, PotController.updatePot);
router.delete('/:id', uuidValidation, handleValidationErrors, PotController.deletePot);
router.post('/:id/add', uuidValidation, moneyTransactionValidation, handleValidationErrors, PotController.addMoney);
router.post('/:id/withdraw', uuidValidation, moneyTransactionValidation, handleValidationErrors, PotController.withdrawMoney);

export default router;