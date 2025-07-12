import {sql} from '@/db'
import type {Pot} from '@/db'
import {AppError} from '@/middleware/error'
import {Logger} from '@/utils/logger'
import type {CreatePotRequest, UpdatePotRequest, PotTransactionRequest} from '@/types/api'

export class PotService {
  static async getPots(userId: string): Promise<Pot[]> {
    return sql`
      SELECT * FROM pots 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    ` as unknown as Pot[]
  }

  static async getPotById(userId: string, potId: string): Promise<Pot> {
    const result = await sql`
      SELECT * FROM pots 
      WHERE id = ${potId} AND user_id = ${userId}
      LIMIT 1
    ` as unknown as Pot[]

    if (!result.length) {
      throw new AppError('Pot not found', 404)
    }

    return result[0]
  }

  static async createPot(userId: string, data: CreatePotRequest): Promise<Pot> {
    const {name, target, theme} = data

    if (target <= 0) {
      throw new AppError('Target amount must be greater than 0', 400)
    }

    const result = await sql`
      INSERT INTO pots (user_id, name, target, theme, total)
      VALUES (${userId}, ${name}, ${target.toString()}, ${theme}, '0')
      RETURNING *
    ` as unknown as Pot[]

    Logger.info('Pot created', {userId, potId: result[0].id, name})

    return result[0]
  }

  static async updatePot(userId: string, potId: string, data: UpdatePotRequest): Promise<Pot> {
    await this.getPotById(userId, potId)

    // Execute separate updates for each field to avoid SQL injection
    if (data.name !== undefined) {
      await sql`
        UPDATE pots 
        SET name = ${data.name}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${potId}
      `
    }

    if (data.target !== undefined) {
      if (data.target <= 0) {
        throw new AppError('Target amount must be greater than 0', 400)
      }
      await sql`
        UPDATE pots 
        SET target = ${data.target.toString()}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${potId}
      `
    }

    if (data.theme !== undefined) {
      await sql`
        UPDATE pots 
        SET theme = ${data.theme}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${potId}
      `
    }

    // Get the updated pot
    const result = await sql`
      SELECT * FROM pots 
      WHERE id = ${potId}
    ` as unknown as Pot[]

    Logger.info('Pot updated', {userId, potId})

    return result[0]
  }

  static async deletePot(userId: string, potId: string): Promise<number> {
    const pot = await this.getPotById(userId, potId)

    await sql`
      DELETE FROM pots 
      WHERE id = ${potId}
    `

    Logger.info('Pot deleted', {userId, potId, returnedAmount: pot.total})

    return Number(pot.total)
  }

  static async addMoney(userId: string, potId: string, data: PotTransactionRequest): Promise<Pot> {
    const {amount} = data

    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400)
    }

    const pot = await this.getPotById(userId, potId)
    const currentTotal = Number(pot.total)
    const newTotal = currentTotal + amount

    const result = await sql`
      UPDATE pots 
      SET total = ${newTotal.toString()}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${potId}
      RETURNING *
    ` as unknown as Pot[]

    Logger.info('Money added to pot', {userId, potId, amount, newTotal})

    return result[0]
  }

  static async withdrawMoney(
    userId: string,
    potId: string,
    data: PotTransactionRequest,
  ): Promise<Pot> {
    const {amount} = data

    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400)
    }

    const pot = await this.getPotById(userId, potId)
    const currentTotal = Number(pot.total)

    if (amount > currentTotal) {
      throw new AppError('Insufficient funds in pot', 400)
    }

    const newTotal = currentTotal - amount

    const result = await sql`
      UPDATE pots 
      SET total = ${newTotal.toString()}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${potId}
      RETURNING *
    ` as unknown as Pot[]

    Logger.info('Money withdrawn from pot', {userId, potId, amount, newTotal})

    return result[0]
  }

  static async getPotProgress(
    userId: string,
    potId: string,
  ): Promise<{
    pot: Pot
    progress: number
    remaining: number
  }> {
    const pot = await this.getPotById(userId, potId)
    const total = Number(pot.total)
    const target = Number(pot.target)
    const progress = target > 0 ? (total / target) * 100 : 0
    const remaining = target - total

    return {
      pot,
      progress,
      remaining,
    }
  }
}
