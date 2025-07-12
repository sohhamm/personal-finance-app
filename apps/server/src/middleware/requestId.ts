import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Check if request ID is already provided in headers (e.g., from load balancer)
  const requestId = req.get('X-Request-ID') || req.get('X-Correlation-ID') || randomUUID();
  
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  next();
};