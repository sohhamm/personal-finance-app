import { sql, Budget } from '@/db';
import { AppError } from '@/middleware/error';
import { Logger } from '@/utils/logger';
import { CreateBudgetRequest, UpdateBudgetRequest } from '@/types/api';

export class BudgetService {
  static async getBudgets(userId: string): Promise<Budget[]> {
    return sql<Budget[]>`
      SELECT * FROM budgets 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
  }

  static async getBudgetById(userId: string, budgetId: string): Promise<Budget> {
    const result = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, userId)))
      .limit(1);

    if (!result.length) {
      throw new AppError('Budget not found', 404);
    }

    return result[0];
  }

  static async createBudget(
    userId: string,
    data: CreateBudgetRequest
  ): Promise<Budget> {
    const { category, maximum, theme } = data;

    // Check if budget already exists for this category
    const existing = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.userId, userId), eq(budgets.category, category)))
      .limit(1);

    if (existing.length > 0) {
      throw new AppError('Budget already exists for this category', 409);
    }

    const newBudget: NewBudget = {
      userId,
      category,
      maximum: maximum.toString(),
      theme,
    };

    const result = await db.insert(budgets).values(newBudget).returning();

    Logger.info('Budget created', { userId, budgetId: result[0].id, category });

    return result[0];
  }

  static async updateBudget(
    userId: string,
    budgetId: string,
    data: UpdateBudgetRequest
  ): Promise<Budget> {
    await this.getBudgetById(userId, budgetId);

    const updateData: Partial<NewBudget> = {};

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.maximum !== undefined) {
      updateData.maximum = data.maximum.toString();
    }

    if (data.theme !== undefined) {
      updateData.theme = data.theme;
    }

    const result = await db
      .update(budgets)
      .set(updateData)
      .where(eq(budgets.id, budgetId))
      .returning();

    Logger.info('Budget updated', { userId, budgetId });

    return result[0];
  }

  static async deleteBudget(userId: string, budgetId: string): Promise<void> {
    await this.getBudgetById(userId, budgetId);

    await db.delete(budgets).where(eq(budgets.id, budgetId));

    Logger.info('Budget deleted', { userId, budgetId });
  }

  static async getBudgetWithSpending(userId: string, budgetId: string): Promise<{
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
    latestTransactions: any[];
  }> {
    const budget = await this.getBudgetById(userId, budgetId);

    // Get spending for current month
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const spentResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(amount::numeric), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.category, budget.category),
          eq(transactions.transactionType, 'expense'),
          sql`transaction_date >= ${startOfMonth}`,
          sql`transaction_date <= ${endOfMonth}`
        )
      );

    const spent = Number(spentResult[0].total || 0);
    const maximum = Number(budget.maximum);
    const remaining = maximum - spent;
    const percentage = maximum > 0 ? (spent / maximum) * 100 : 0;

    // Get latest 3 transactions for this category
    const latestTransactions = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.category, budget.category)
        )
      )
      .orderBy(desc(transactions.transactionDate))
      .limit(3);

    return {
      budget,
      spent,
      remaining,
      percentage,
      latestTransactions,
    };
  }
}