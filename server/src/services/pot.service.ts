import { sql, Pot } from '@/db';
import { AppError } from '@/middleware/error';
import { Logger } from '@/utils/logger';
import { CreatePotRequest, UpdatePotRequest, PotTransactionRequest } from '@/types/api';

export class PotService {
  static async getPots(userId: string): Promise<Pot[]> {
    return sql<Pot[]>`
      SELECT * FROM pots 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
  }

  static async getPotById(userId: string, potId: string): Promise<Pot> {
    const result = await db
      .select()
      .from(pots)
      .where(and(eq(pots.id, potId), eq(pots.userId, userId)))
      .limit(1);

    if (!result.length) {
      throw new AppError('Pot not found', 404);
    }

    return result[0];
  }

  static async createPot(userId: string, data: CreatePotRequest): Promise<Pot> {
    const { name, target, theme } = data;

    if (target <= 0) {
      throw new AppError('Target amount must be greater than 0', 400);
    }

    const newPot: NewPot = {
      userId,
      name,
      target: target.toString(),
      theme,
    };

    const result = await db.insert(pots).values(newPot).returning();

    Logger.info('Pot created', { userId, potId: result[0].id, name });

    return result[0];
  }

  static async updatePot(
    userId: string,
    potId: string,
    data: UpdatePotRequest
  ): Promise<Pot> {
    await this.getPotById(userId, potId);

    const updateData: Partial<NewPot> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.target !== undefined) {
      if (data.target <= 0) {
        throw new AppError('Target amount must be greater than 0', 400);
      }
      updateData.target = data.target.toString();
    }

    if (data.theme !== undefined) {
      updateData.theme = data.theme;
    }

    const result = await db
      .update(pots)
      .set(updateData)
      .where(eq(pots.id, potId))
      .returning();

    Logger.info('Pot updated', { userId, potId });

    return result[0];
  }

  static async deletePot(userId: string, potId: string): Promise<number> {
    const pot = await this.getPotById(userId, potId);

    await db.delete(pots).where(eq(pots.id, potId));

    Logger.info('Pot deleted', { userId, potId, returnedAmount: pot.total });

    return Number(pot.total);
  }

  static async addMoney(
    userId: string,
    potId: string,
    data: PotTransactionRequest
  ): Promise<Pot> {
    const { amount } = data;

    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    const pot = await this.getPotById(userId, potId);
    const currentTotal = Number(pot.total);
    const newTotal = currentTotal + amount;

    const result = await db
      .update(pots)
      .set({ total: newTotal.toString() })
      .where(eq(pots.id, potId))
      .returning();

    Logger.info('Money added to pot', { userId, potId, amount, newTotal });

    return result[0];
  }

  static async withdrawMoney(
    userId: string,
    potId: string,
    data: PotTransactionRequest
  ): Promise<Pot> {
    const { amount } = data;

    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    const pot = await this.getPotById(userId, potId);
    const currentTotal = Number(pot.total);

    if (amount > currentTotal) {
      throw new AppError('Insufficient funds in pot', 400);
    }

    const newTotal = currentTotal - amount;

    const result = await db
      .update(pots)
      .set({ total: newTotal.toString() })
      .where(eq(pots.id, potId))
      .returning();

    Logger.info('Money withdrawn from pot', { userId, potId, amount, newTotal });

    return result[0];
  }

  static async getPotProgress(userId: string, potId: string): Promise<{
    pot: Pot;
    progress: number;
    remaining: number;
  }> {
    const pot = await this.getPotById(userId, potId);
    const total = Number(pot.total);
    const target = Number(pot.target);
    const progress = target > 0 ? (total / target) * 100 : 0;
    const remaining = target - total;

    return {
      pot,
      progress,
      remaining,
    };
  }
}