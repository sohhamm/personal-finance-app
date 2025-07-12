import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ResponseUtils } from '@/utils/response';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    ResponseUtils.error(res, 'Validation failed', 400, errorMessages);
    return;
  }

  next();
};