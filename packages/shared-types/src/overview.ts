import type { Transaction } from './transaction';
import type { Budget } from './budget';
import type { Pot } from './pot';
import type { RecurringBill, RecurringBillPayment } from './recurring-bill';

/**
 * Overview data response
 */
export interface OverviewData {
  currentBalance: number;
  income: number;
  expenses: number;
  pots: {
    totalSaved: number;
    count: number;
    details: Pot[];
  };
  budgets: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    categories: (Budget & { spent: number })[];
  };
  recurringBills: {
    totalBills: number;
    paidAmount: number;
    upcomingAmount: number;
    dueSoonAmount: number;
    dueSoon: (RecurringBill & RecurringBillPayment)[];
  };
  recentTransactions: Transaction[];
}

/**
 * Monthly trends data point
 */
export interface MonthlyTrend {
  month: Date;
  income: number;
  expenses: number;
}

/**
 * Monthly trends query parameters
 */
export interface MonthlyTrendsQuery {
  months?: number; // Number of months to include (default: 6)
}