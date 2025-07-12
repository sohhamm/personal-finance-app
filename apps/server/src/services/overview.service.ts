import { sql } from '@/db/index';
import { Logger } from '@/utils/logger';

export class OverviewService {
  /**
   * Get comprehensive overview data for a user
   */
  static async getOverviewData(userId: string) {
    try {
      Logger.info(`Getting overview data for user: ${userId}`);

      // Get current balance (sum of all transactions)
      const balanceResult = await sql`
        SELECT 
          COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE -amount END), 0) as current_balance
        FROM transactions 
        WHERE user_id = ${userId}
      `;

      // Get current month income and expenses
      const currentMonthStats = await sql`
        SELECT 
          COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) as expenses
        FROM transactions 
        WHERE user_id = ${userId}
          AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
      `;

      // Get pots summary
      const potsData = await sql`
        SELECT 
          COALESCE(SUM(total), 0) as total_saved,
          COUNT(*) as pot_count,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', id,
              'name', name,
              'total', total,
              'target', target,
              'theme', theme
            )
          ) as pots
        FROM pots 
        WHERE user_id = ${userId}
      `;

      // Get budgets with spending
      const budgetsData = await sql`
        SELECT 
          b.*,
          COALESCE(spent.total_spent, 0) as spent
        FROM budgets b
        LEFT JOIN (
          SELECT 
            category,
            SUM(amount) as total_spent
          FROM transactions
          WHERE user_id = ${userId}
            AND transaction_type = 'expense'
            AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
          GROUP BY category
        ) spent ON b.category = spent.category
        WHERE b.user_id = ${userId}
        ORDER BY b.category
      `;

      // Get recent transactions (last 5)
      const recentTransactions = await sql`
        SELECT 
          id,
          recipient_sender,
          amount,
          transaction_type,
          transaction_date,
          category,
          avatar
        FROM transactions 
        WHERE user_id = ${userId}
        ORDER BY transaction_date DESC, created_at DESC
        LIMIT 5
      `;

      // Get recurring bills summary
      const recurringBillsData = await sql`
        SELECT 
          COUNT(*) as total_bills,
          COALESCE(SUM(CASE WHEN rbp.status = 'paid' THEN rbp.amount ELSE 0 END), 0) as paid_bills_amount,
          COALESCE(SUM(CASE WHEN rbp.status = 'pending' THEN rbp.amount ELSE 0 END), 0) as upcoming_bills_amount,
          COALESCE(SUM(CASE WHEN rbp.status = 'pending' AND rbp.due_date <= CURRENT_DATE + INTERVAL '5 days' THEN rbp.amount ELSE 0 END), 0) as due_soon_amount
        FROM recurring_bills rb
        LEFT JOIN recurring_bill_payments rbp ON rb.id = rbp.recurring_bill_id
          AND DATE_TRUNC('month', rbp.due_date) = DATE_TRUNC('month', CURRENT_DATE)
        WHERE rb.user_id = ${userId} AND rb.is_active = true
      `;

      // Get bills due soon
      const billsDueSoon = await OverviewService.getBillsDueSoon(userId);

      // Calculate budget totals
      const budgetTotals = OverviewService.calculateBudgetTotals(budgetsData);

      const overviewData = {
        currentBalance: parseFloat(balanceResult[0].current_balance),
        income: parseFloat(currentMonthStats[0].income),
        expenses: parseFloat(currentMonthStats[0].expenses),
        pots: {
          totalSaved: parseFloat(potsData[0].total_saved),
          count: parseInt(potsData[0].pot_count),
          details: potsData[0].pots?.[0] ? potsData[0].pots : [],
        },
        budgets: {
          totalBudget: budgetTotals.totalBudget,
          totalSpent: budgetTotals.totalSpent,
          remaining: budgetTotals.totalBudget - budgetTotals.totalSpent,
          categories: budgetsData,
        },
        recurringBills: {
          totalBills: parseInt(recurringBillsData[0].total_bills),
          paidAmount: parseFloat(recurringBillsData[0].paid_bills_amount),
          upcomingAmount: parseFloat(recurringBillsData[0].upcoming_bills_amount),
          dueSoonAmount: parseFloat(recurringBillsData[0].due_soon_amount),
          dueSoon: billsDueSoon,
        },
        recentTransactions,
      };

      Logger.info(`Overview data retrieved successfully for user: ${userId}`);
      return overviewData;
    } catch (error) {
      Logger.error('Error in OverviewService.getOverviewData:', error);
      throw error;
    }
  }

  /**
   * Get monthly trends for a user
   */
  static async getMonthlyTrends(userId: string, months: number = 6) {
    try {
      Logger.info(`Getting monthly trends for user: ${userId}, months: ${months}`);

      const monthlyTrends = await sql`
        SELECT 
          DATE_TRUNC('month', transaction_date) as month,
          COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) as expenses
        FROM transactions
        WHERE user_id = ${userId}
          AND transaction_date >= CURRENT_DATE - INTERVAL '${months} months'
        GROUP BY DATE_TRUNC('month', transaction_date)
        ORDER BY month DESC
      `;

      Logger.info(`Monthly trends retrieved successfully for user: ${userId}`);
      return monthlyTrends;
    } catch (error) {
      Logger.error('Error in OverviewService.getMonthlyTrends:', error);
      throw error;
    }
  }

  /**
   * Get bills due soon for a user
   */
  private static async getBillsDueSoon(userId: string) {
    try {
      // Get latest transaction date to calculate reference date
      const latestTransaction = await sql`
        SELECT transaction_date 
        FROM transactions 
        WHERE user_id = ${userId}
        ORDER BY transaction_date DESC 
        LIMIT 1
      `;

      const referenceDate = latestTransaction[0]?.transaction_date || new Date();
      const fiveDaysFromReference = new Date(referenceDate);
      fiveDaysFromReference.setDate(fiveDaysFromReference.getDate() + 5);

      const billsDueSoon = await sql`
        SELECT 
          rb.name,
          rb.amount,
          rb.avatar,
          rbp.due_date,
          rbp.status
        FROM recurring_bills rb
        JOIN recurring_bill_payments rbp ON rb.id = rbp.recurring_bill_id
        WHERE rb.user_id = ${userId} 
          AND rb.is_active = true
          AND rbp.status = 'pending'
          AND rbp.due_date <= ${fiveDaysFromReference}
          AND rbp.due_date >= CURRENT_DATE
        ORDER BY rbp.due_date ASC
        LIMIT 2
      `;

      return billsDueSoon;
    } catch (error) {
      Logger.error('Error in OverviewService.getBillsDueSoon:', error);
      throw error;
    }
  }

  /**
   * Calculate budget totals from budget data
   */
  private static calculateBudgetTotals(budgetsData: any[]) {
    return budgetsData.reduce(
      (acc: { totalBudget: number; totalSpent: number }, budget: any) => {
        acc.totalBudget += parseFloat(budget.maximum);
        acc.totalSpent += parseFloat(budget.spent);
        return acc;
      },
      { totalBudget: 0, totalSpent: 0 }
    );
  }
}
