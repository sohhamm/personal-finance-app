import type { Response } from 'express';
import { OverviewService } from '@/services/overview.service';
import type { AuthenticatedRequest } from '@/types/api';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';

export class OverviewController {
  static async getOverviewData(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const overviewData = await OverviewService.getOverviewData(req.user.id);
      return ResponseUtils.success(res, overviewData, 'Overview data retrieved successfully');
    } catch (error) {
      const err = error as any;
      Logger.error('Error getting overview data:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async getMonthlyTrends(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { months = 6 } = req.query;
      const monthlyTrends = await OverviewService.getMonthlyTrends(req.user.id, Number(months));

      return ResponseUtils.success(res, monthlyTrends, 'Monthly trends retrieved successfully');
    } catch (error) {
      const err = error as any;
      Logger.error('Error getting monthly trends:', err);
      return ResponseUtils.serverError(res);
    }
  }
}
