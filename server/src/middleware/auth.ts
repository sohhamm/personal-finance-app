import { Request, Response, NextFunction } from 'express';
import { sql, User } from '@/db';
import { JwtUtils } from '@/utils/jwt';
import { ResponseUtils } from '@/utils/response';
import { Logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/types/api';

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
    const user = await sql<User[]>`
      SELECT * FROM users WHERE id = ${payload.userId} LIMIT 1
    `;

    if (!user.length) {
      ResponseUtils.unauthorized(res, 'User not found');
      return;
    }

    req.user = user[0];
    next();
  } catch (error) {
    Logger.error('Authentication error', { error: error.message });
    ResponseUtils.unauthorized(res, 'Invalid or expired token');
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = JwtUtils.getTokenFromHeader(req.headers.authorization);

    if (!token) {
      next();
      return;
    }

    const payload = JwtUtils.verifyToken(token);
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (user.length) {
      req.user = user[0];
    }

    next();
  } catch (error) {
    Logger.warn('Optional authentication failed', { error: error.message });
    next();
  }
};