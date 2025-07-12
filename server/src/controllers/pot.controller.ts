import { Response } from 'express';
import { PotService } from '@/services/pot.service';
import { ResponseUtils } from '@/utils/response';
import { Logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/types/api';

export class PotController {
  static async getPots(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pots = await PotService.getPots(req.user.id);
      ResponseUtils.success(res, pots, 'Pots retrieved successfully');
    } catch (error) {
      Logger.error('Get pots error', { error: error.message });
      ResponseUtils.serverError(res);
    }
  }

  static async getPotById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pot = await PotService.getPotById(req.user.id, req.params.id);
      ResponseUtils.success(res, pot, 'Pot retrieved successfully');
    } catch (error) {
      Logger.error('Get pot by ID error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async createPot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pot = await PotService.createPot(req.user.id, req.body);
      ResponseUtils.created(res, pot, 'Pot created successfully');
    } catch (error) {
      Logger.error('Create pot error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async updatePot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pot = await PotService.updatePot(req.user.id, req.params.id, req.body);
      ResponseUtils.success(res, pot, 'Pot updated successfully');
    } catch (error) {
      Logger.error('Update pot error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async deletePot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const returnedAmount = await PotService.deletePot(req.user.id, req.params.id);
      ResponseUtils.success(res, { returnedAmount }, 'Pot deleted successfully');
    } catch (error) {
      Logger.error('Delete pot error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async addMoney(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pot = await PotService.addMoney(req.user.id, req.params.id, req.body);
      ResponseUtils.success(res, pot, 'Money added to pot successfully');
    } catch (error) {
      Logger.error('Add money to pot error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async withdrawMoney(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pot = await PotService.withdrawMoney(req.user.id, req.params.id, req.body);
      ResponseUtils.success(res, pot, 'Money withdrawn from pot successfully');
    } catch (error) {
      Logger.error('Withdraw money from pot error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async getPotProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const progress = await PotService.getPotProgress(req.user.id, req.params.id);
      ResponseUtils.success(res, progress, 'Pot progress retrieved successfully');
    } catch (error) {
      Logger.error('Get pot progress error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }
}