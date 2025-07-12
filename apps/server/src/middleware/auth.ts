import type { NextFunction, Response } from 'express';
import type { User } from '@/db';
import { sql } from '@/db';
import type { AuthenticatedRequest } from '@/types/api';
import { UserCache } from '@/utils/cache';
import { JwtUtils } from '@/utils/jwt';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = JwtUtils.getTokenFromHeader(req.headers.authorization);

    if (!token) {
      ResponseUtils.unauthorized(res, 'No token provided');
      return;
    }

    const payload = JwtUtils.verifyToken(token);
    
    // Try to get user from cache first
    let user = UserCache.get(payload.userId);
    
    if (!user) {
      // If not in cache, fetch from database
      const userResult = (await sql`
        SELECT id, name, email, created_at, updated_at FROM users WHERE id = ${payload.userId} LIMIT 1
      `) as Omit<User, 'password_hash'>[];

      if (!userResult.length) {
        ResponseUtils.unauthorized(res, 'User not found');
        return;
      }

      user = userResult[0];
      // Cache the user for future requests
      UserCache.set(payload.userId, user);
    }

    req.user = user as User;
    next();
  } catch (error) {
    const err = error as any;
    Logger.error('Authentication error', { error: err.message });
    ResponseUtils.unauthorized(res, 'Invalid or expired token');
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = JwtUtils.getTokenFromHeader(req.headers.authorization);

    if (!token) {
      next();
      return;
    }

    const payload = JwtUtils.verifyToken(token);
    
    // Try to get user from cache first
    let user = UserCache.get(payload.userId);
    
    if (!user) {
      // If not in cache, fetch from database
      const userResult = (await sql`
        SELECT id, name, email, created_at, updated_at FROM users WHERE id = ${payload.userId} LIMIT 1
      `) as Omit<User, 'password_hash'>[];

      if (userResult.length) {
        user = userResult[0];
        // Cache the user for future requests
        UserCache.set(payload.userId, user);
      }
    }

    if (user) {
      req.user = user as User;
    }

    next();
  } catch (error) {
    const err = error as any;
    Logger.warn('Optional authentication failed', { error: err.message });
    next();
  }
};
