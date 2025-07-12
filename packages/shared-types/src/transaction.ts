import type { PaginationQuery } from './api';

/**
 * Transaction types
 */
export type TransactionType = 'income' | 'expense';

/**
 * Available transaction categories
 */
export type TransactionCategory = 
  | 'Entertainment'
  | 'Bills'
  | 'Groceries'
  | 'Dining Out'
  | 'Transportation'
  | 'Personal Care'
  | 'Education'
  | 'Lifestyle'
  | 'Shopping'
  | 'General';

/**
 * Transaction database entity
 */
export interface Transaction {
  id: string;
  user_id: string;
  recipient_sender: string;
  category: TransactionCategory;
  transaction_date: Date;
  amount: string; // Stored as string to maintain precision
  transaction_type: TransactionType;
  recurring: boolean;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create transaction request
 */
export interface CreateTransactionRequest {
  recipientSender: string;
  category: TransactionCategory;
  transactionDate: string; // ISO date string
  amount: number;
  transactionType: TransactionType;
  recurring?: boolean;
  avatar?: string;
}

/**
 * Update transaction request
 */
export interface UpdateTransactionRequest {
  recipientSender?: string;
  category?: TransactionCategory;
  transactionDate?: string; // ISO date string
  amount?: number;
  transactionType?: TransactionType;
  recurring?: boolean;
  avatar?: string;
}

/**
 * Transaction query parameters
 */
export interface TransactionQuery extends PaginationQuery {
  search?: string;
  category?: TransactionCategory;
  sortBy?: 'date' | 'amount' | 'name';
  sortOrder?: 'asc' | 'desc';
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

/**
 * Transaction statistics
 */
export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}