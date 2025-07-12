import type { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import type { AuthenticatedRequest } from '@/types/api';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const authResponse = await AuthService.signup(req.body);
      ResponseUtils.created(res, authResponse, 'User created successfully');
    } catch (error) {
      const err = error as any;
      Logger.error('Signup error', { error: err.message });
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const authResponse = await AuthService.login(req.body);
      ResponseUtils.success(res, authResponse, 'Login successful');
    } catch (error) {
      const err = error as any;
      Logger.error('Login error', { error: err.message });
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, 'User not authenticated');
        return;
      }

      const user = await AuthService.getUserById(req.user.id);
      ResponseUtils.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      const err = error as any;
      Logger.error('Get profile error', { error: err.message });
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }
}
