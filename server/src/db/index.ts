import postgres from 'postgres';

// Use postgres library that works well with Bun
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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