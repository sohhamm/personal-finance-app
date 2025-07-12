// Use Bun's native SQL API with connection pooling
import { SQL } from 'bun';
import { Logger } from '@/utils/logger';

const createConnection = () => {
  try {
    return new SQL({
      url: process.env.DATABASE_URL!,
      // Connection pool configuration
      max: 20, // Maximum connections in pool
      min: 2,  // Minimum connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 2000, // 2s timeout for new connections
    });
  } catch (error) {
    Logger.error('Failed to create database connection', { error });
    throw error;
  }
};

export const sql = createConnection();

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    Logger.error('Database health check failed', { error });
    return false;
  }
};

// Graceful database shutdown
export const closeDatabase = async (): Promise<void> => {
  try {
    await sql.end();
    Logger.info('Database connections closed successfully');
  } catch (error) {
    Logger.error('Error closing database connections', { error });
  }
};

// Type definitions for our database tables
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;
  user_id: string;
  recipient_sender: string;
  category: string;
  transaction_date: Date;
  amount: string;
  transaction_type: 'income' | 'expense';
  recurring: boolean;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  maximum: string;
  theme: string;
  created_at: Date;
  updated_at: Date;
}

export interface Pot {
  id: string;
  user_id: string;
  name: string;
  target: string;
  total: string;
  theme: string;
  created_at: Date;
  updated_at: Date;
}

export interface RecurringBill {
  id: string;
  user_id: string;
  name: string;
  amount: string;
  due_day: number;
  category: string;
  avatar?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RecurringBillPayment {
  id: string;
  recurring_bill_id: string;
  transaction_id?: string;
  due_date: Date;
  paid_date?: Date;
  amount: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: Date;
  updated_at: Date;
}
