import type { Request, Response, NextFunction } from 'express';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';
import { env } from '@/utils/env';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  Logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  if (env.NODE_ENV === 'development') {
    ResponseUtils.error(res, message, statusCode, [err.stack || '']);
  } else {
    ResponseUtils.error(res, message, statusCode);
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  ResponseUtils.notFound(res, `Route ${req.method} ${req.path} not found`);
};