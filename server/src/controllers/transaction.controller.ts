import type {Response} from 'express'
import {TransactionService} from '@/services/transaction.service'
import {ResponseUtils} from '@/utils/response'
import {Logger} from '@/utils/logger'
import type {AuthenticatedRequest} from '@/types/api'

export class TransactionController {
  static async getTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const result = await TransactionService.getTransactions(req.user.id, req.query)

      ResponseUtils.paginated(
        res,
        result.data,
        result.pagination,
        'Transactions retrieved successfully',
      )
    } catch (error) {
      const err = error as any
      Logger.error('Get transactions error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async getTransactionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const transaction = await TransactionService.getTransactionById(req.user.id, req.params.id)

      ResponseUtils.success(res, transaction, 'Transaction retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Get transaction by ID error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async createTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const transaction = await TransactionService.createTransaction(req.user.id, req.body)

      ResponseUtils.created(res, transaction, 'Transaction created successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Create transaction error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async updateTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const transaction = await TransactionService.updateTransaction(
        req.user.id,
        req.params.id,
        req.body,
      )

      ResponseUtils.success(res, transaction, 'Transaction updated successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Update transaction error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async deleteTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      await TransactionService.deleteTransaction(req.user.id, req.params.id)

      ResponseUtils.success(res, null, 'Transaction deleted successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Delete transaction error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async getCategories(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const categories = await TransactionService.getCategories()
      ResponseUtils.success(res, categories, 'Categories retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Get categories error', {error: err.message})
      ResponseUtils.serverError(res)
    }
  }

  static async getTransactionStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const stats = await TransactionService.getTransactionStats(req.user.id)
      ResponseUtils.success(res, stats, 'Transaction stats retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Get transaction stats error', {error: err.message})
      ResponseUtils.serverError(res)
    }
  }
}
