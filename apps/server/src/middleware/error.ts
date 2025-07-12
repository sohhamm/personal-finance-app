import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@/types/errors';
import { env } from '@/utils/env';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errorCode: string | undefined;

  // Handle different types of errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.errorCode;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    errorCode = 'VALIDATION_ERROR';
  } else if (err.message.includes('unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
    errorCode = 'CONFLICT';
  } else if (err.message.includes('foreign key constraint')) {
    statusCode = 400;
    message = 'Referenced resource does not exist';
    errorCode = 'INVALID_REFERENCE';
  }

  // Log error with context
  Logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    statusCode,
    errorCode,
  });

  // Send appropriate response
  const response: any = {
    success: false,
    message,
    ...(errorCode && { errorCode }),
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  ResponseUtils.notFound(res, `Route ${req.method} ${req.path} not found`);
};
