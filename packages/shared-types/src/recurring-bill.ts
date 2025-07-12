import type { PaginationQuery } from './api';

/**
 * Recurring bill payment status
 */
export type RecurringBillStatus = 'pending' | 'paid' | 'overdue';

/**
 * Recurring bill database entity
 */
export interface RecurringBill {
  id: string;
  user_id: string;
  name: string;
  amount: string; // Stored as string to maintain precision
  due_day: number; // Day of month (1-31)
  category: string;
  avatar?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Recurring bill payment database entity
 */
export interface RecurringBillPayment {
  id: string;
  recurring_bill_id: string;
  transaction_id?: string;
  due_date: Date;
  paid_date?: Date;
  amount: string; // Stored as string to maintain precision
  status: RecurringBillStatus;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create recurring bill request
 */
export interface CreateRecurringBillRequest {
  name: string;
  amount: number;
  dueDay: number; // Day of month (1-31)
  category: string;
  avatar?: string;
}

/**
 * Update recurring bill request
 */
export interface UpdateRecurringBillRequest {
  name?: string;
  amount?: number;
  dueDay?: number;
  category?: string;
  avatar?: string;
  isActive?: boolean;
}

/**
 * Recurring bill query parameters
 */
export interface RecurringBillQuery extends PaginationQuery {
  search?: string;
  sortBy?: 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';
}

/**
 * Mark bill as paid request
 */
export interface MarkBillAsPaidRequest {
  transactionId?: string;
}

/**
 * Recurring bill with payment information
 */
export interface RecurringBillWithPayments extends RecurringBill {
  payments: RecurringBillPayment[];
}