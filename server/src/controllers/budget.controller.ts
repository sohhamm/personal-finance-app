import { Response } from 'express';
import { BudgetService } from '@/services/budget.service';
import { ResponseUtils } from '@/utils/response';
import { Logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/types/api';

export class BudgetController {
  static async getBudgets(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const budgets = await BudgetService.getBudgets(req.user.id);
      ResponseUtils.success(res, budgets, 'Budgets retrieved successfully');
    } catch (error) {
      Logger.error('Get budgets error', { error: error.message });
      ResponseUtils.serverError(res);
    }
  }

  static async getBudgetById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const budget = await BudgetService.getBudgetById(req.user.id, req.params.id);
      ResponseUtils.success(res, budget, 'Budget retrieved successfully');
    } catch (error) {
      Logger.error('Get budget by ID error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async createBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const budget = await BudgetService.createBudget(req.user.id, req.body);
      ResponseUtils.created(res, budget, 'Budget created successfully');
    } catch (error) {
      Logger.error('Create budget error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async updateBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const budget = await BudgetService.updateBudget(req.user.id, req.params.id, req.body);
      ResponseUtils.success(res, budget, 'Budget updated successfully');
    } catch (error) {
      Logger.error('Update budget error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async deleteBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      await BudgetService.deleteBudget(req.user.id, req.params.id);
      ResponseUtils.success(res, null, 'Budget deleted successfully');
    } catch (error) {
      Logger.error('Delete budget error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }

  static async getBudgetWithSpending(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const budgetData = await BudgetService.getBudgetWithSpending(req.user.id, req.params.id);
      ResponseUtils.success(res, budgetData, 'Budget with spending retrieved successfully');
    } catch (error) {
      Logger.error('Get budget with spending error', { error: error.message });
      if (error.statusCode) {
        ResponseUtils.error(res, error.message, error.statusCode);
      } else {
        ResponseUtils.serverError(res);
      }
    }
  }
}