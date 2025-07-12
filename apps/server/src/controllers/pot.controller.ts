import type {Response} from 'express'
import {PotService} from '@/services/pot.service'
import {ResponseUtils} from '@/utils/response'
import {Logger} from '@/utils/logger'
import type {AuthenticatedRequest} from '@/types/api'

export class PotController {
  static async getPots(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const pots = await PotService.getPots(req.user.id)
      ResponseUtils.success(res, pots, 'Pots retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Get pots error', {error: err.message})
      ResponseUtils.serverError(res)
    }
  }

  static async getPotById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const pot = await PotService.getPotById(req.user.id, req.params.id)
      ResponseUtils.success(res, pot, 'Pot retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Get pot by ID error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async createPot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const pot = await PotService.createPot(req.user.id, req.body)
      ResponseUtils.created(res, pot, 'Pot created successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Create pot error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async updatePot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const pot = await PotService.updatePot(req.user.id, req.params.id, req.body)
      ResponseUtils.success(res, pot, 'Pot updated successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Update pot error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async deletePot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const returnedAmount = await PotService.deletePot(req.user.id, req.params.id)
      ResponseUtils.success(res, {returnedAmount}, 'Pot deleted successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Delete pot error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async addMoney(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const pot = await PotService.addMoney(req.user.id, req.params.id, req.body)
      ResponseUtils.success(res, pot, 'Money added to pot successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Add money to pot error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async withdrawMoney(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const pot = await PotService.withdrawMoney(req.user.id, req.params.id, req.body)
      ResponseUtils.success(res, pot, 'Money withdrawn from pot successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Withdraw money from pot error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }

  static async getPotProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }

      const progress = await PotService.getPotProgress(req.user.id, req.params.id)
      ResponseUtils.success(res, progress, 'Pot progress retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Get pot progress error', {error: err.message})
      if (err.statusCode) {
        ResponseUtils.error(res, err.message, err.statusCode)
      } else {
        ResponseUtils.serverError(res)
      }
    }
  }
}
