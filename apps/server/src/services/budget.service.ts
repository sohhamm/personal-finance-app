import type { Budget } from '@/db';
import { sql } from '@/db';
import { AppError } from '@/middleware/error';
import type { CreateBudgetRequest, UpdateBudgetRequest } from '@/types/api';
import { Logger } from '@/utils/logger';

export class BudgetService {
  static async getBudgets(userId: string): Promise<Budget[]> {
    return sql`
      SELECT * FROM budgets 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    ` as unknown as Budget[];
  }

  static async getBudgetById(userId: string, budgetId: string): Promise<Budget> {
    const result = (await sql`
      SELECT * FROM budgets 
      WHERE id = ${budgetId} AND user_id = ${userId}
      LIMIT 1
    `) as unknown as Budget[];

    if (!result.length) {
      throw new AppError('Budget not found', 404);
    }

    return result[0];
  }

  static async createBudget(userId: string, data: CreateBudgetRequest): Promise<Budget> {
    const { category, maximum, theme } = data;

    // Check if budget already exists for this category
    const existing = (await sql`
      SELECT * FROM budgets 
      WHERE user_id = ${userId} AND category = ${category}
      LIMIT 1
    `) as unknown as Budget[];

    if (existing.length > 0) {
      throw new AppError('Budget already exists for this category', 409);
    }

    const [result] = (await sql`
      INSERT INTO budgets (user_id, category, maximum, theme)
      VALUES (${userId}, ${category}, ${maximum.toString()}, ${theme})
      RETURNING *
    `) as unknown as Budget[];

    Logger.info('Budget created', { userId, budgetId: result.id, category });

    return result;
  }

  static async updateBudget(
    userId: string,
    budgetId: string,
    data: UpdateBudgetRequest
  ): Promise<Budget> {
    await BudgetService.getBudgetById(userId, budgetId);

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }

    if (data.maximum !== undefined) {
      updates.push(`maximum = $${paramIndex++}`);
      values.push(data.maximum.toString());
    }

    if (data.theme !== undefined) {
      updates.push(`theme = $${paramIndex++}`);
      values.push(data.theme);
    }

    if (updates.length === 0) {
      return await BudgetService.getBudgetById(userId, budgetId);
    }

    updates.push(`updated_at = NOW()`);
    values.push(budgetId);

    const [result] = (await sql`
      UPDATE budgets 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE id = ${budgetId}
      RETURNING *
    `) as unknown as Budget[];

    Logger.info('Budget updated', { userId, budgetId });

    return result;
  }

  static async deleteBudget(userId: string, budgetId: string): Promise<void> {
    await BudgetService.getBudgetById(userId, budgetId);

    await sql`
      DELETE FROM budgets 
      WHERE id = ${budgetId}
    `;

    Logger.info('Budget deleted', { userId, budgetId });
  }

  static async getBudgetWithSpending(
    userId: string,
    budgetId: string
  ): Promise<{
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
    latestTransactions: any[];
  }> {
    const budget = await BudgetService.getBudgetById(userId, budgetId);

    // Get spending for current month
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const spentResult = (await sql`
      SELECT COALESCE(SUM(amount::numeric), 0) as total
      FROM transactions
      WHERE user_id = ${userId}
        AND category = ${budget.category}
        AND transaction_type = 'expense'
        AND transaction_date >= ${startOfMonth}
        AND transaction_date <= ${endOfMonth}
    `) as unknown as [{ total: string }];

    const spent = Number(spentResult[0].total || 0);
    const maximum = Number(budget.maximum);
    const remaining = maximum - spent;
    const percentage = maximum > 0 ? (spent / maximum) * 100 : 0;

    // Get latest 3 transactions for this category
    const latestTransactions = (await sql`
      SELECT * 
      FROM transactions
      WHERE user_id = ${userId} AND category = ${budget.category}
      ORDER BY transaction_date DESC
      LIMIT 3
    `) as unknown as any[];

    return {
      budget,
      spent,
      remaining,
      percentage,
      latestTransactions,
    };
  }
}
