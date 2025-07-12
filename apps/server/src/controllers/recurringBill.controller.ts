import type { Response } from 'express';
import { RecurringBillService } from '@/services/recurring-bill.service';
import type { AuthenticatedRequest } from '@/types/api';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';

export class RecurringBillController {
  static async getRecurringBills(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { search, sortBy = 'latest', page = 1, limit = 10 } = req.query;

      const result = await RecurringBillService.getRecurringBills(req.user.id, {
        search: search as string,
        sortBy: sortBy as string,
        page: Number(page),
        limit: Number(limit),
      });

      return ResponseUtils.paginated(
        res,
        result.data,
        result.pagination,
        'Recurring bills retrieved successfully'
      );
    } catch (error) {
      const err = error as any;
      Logger.error('Error getting recurring bills:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async getRecurringBillById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const recurringBill = await RecurringBillService.getRecurringBillById(req.user.id, id);

      return ResponseUtils.success(res, recurringBill, 'Recurring bill retrieved successfully');
    } catch (error) {
      const err = error as any;
      if (err.message === 'Recurring bill not found') {
        return ResponseUtils.notFound(res, 'Recurring bill not found');
      }
      Logger.error('Error getting recurring bill by ID:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async createRecurringBill(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { name, amount, dueDay, category, avatar } = req.body;
      const recurringBill = await RecurringBillService.createRecurringBill(req.user.id, {
        name,
        amount,
        dueDay,
        category,
        avatar,
      });

      return ResponseUtils.created(res, recurringBill, 'Recurring bill created successfully');
    } catch (error) {
      const err = error as any;
      Logger.error('Error creating recurring bill:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async updateRecurringBill(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const { name, amount, dueDay, category, avatar, isActive } = req.body;

      const recurringBill = await RecurringBillService.updateRecurringBill(req.user.id, id, {
        name,
        amount,
        dueDay,
        category,
        avatar,
        isActive,
      });

      return ResponseUtils.success(res, recurringBill, 'Recurring bill updated successfully');
    } catch (error) {
      const err = error as any;
      if (err.message === 'Recurring bill not found') {
        return ResponseUtils.notFound(res, 'Recurring bill not found');
      }
      Logger.error('Error updating recurring bill:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async deleteRecurringBill(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { id } = req.params;
      await RecurringBillService.deleteRecurringBill(req.user.id, id);

      return ResponseUtils.success(res, null, 'Recurring bill deleted successfully');
    } catch (error) {
      const err = error as any;
      if (err.message === 'Recurring bill not found') {
        return ResponseUtils.notFound(res, 'Recurring bill not found');
      }
      Logger.error('Error deleting recurring bill:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async markBillAsPaid(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { paymentId } = req.params;
      const { transactionId } = req.body;

      const updatedPayment = await RecurringBillService.markBillAsPaid(
        req.user.id,
        paymentId,
        transactionId
      );

      return ResponseUtils.success(res, updatedPayment, 'Bill marked as paid successfully');
    } catch (error) {
      const err = error as any;
      if (err.message === 'Payment record not found') {
        return ResponseUtils.notFound(res, 'Payment record not found');
      }
      Logger.error('Error marking bill as paid:', err);
      return ResponseUtils.serverError(res);
    }
  }

  static async getBillsDueSoon(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const billsDueSoon = await RecurringBillService.getBillsDueSoon(req.user.id);
      return ResponseUtils.success(res, billsDueSoon, 'Bills due soon retrieved successfully');
    } catch (error) {
      const err = error as any;
      Logger.error('Error getting bills due soon:', err);
      return ResponseUtils.serverError(res);
    }
  }
}
