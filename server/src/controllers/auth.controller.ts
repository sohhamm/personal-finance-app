import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { ResponseUtils } from '@/utils/response';
import { Logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/types/api';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const authResponse = await AuthService.signup(req.body);
      ResponseUtils.created(res, authResponse, 'User created successfully');
    } catch (error) {
      Logger.error('Signup error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
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
      Logger.error('Login error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
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
      Logger.error('Get profile error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }
}