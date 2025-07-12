export const TRANSACTION_CATEGORIES = [
  'Entertainment',
  'Bills',
  'Groceries',
  'Dining Out',
  'Transportation',
  'Personal Care',
  'Education',
  'Lifestyle',
  'Shopping',
  'General',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export const TRANSACTION_TYPES = ['income', 'expense'] as const;

export type TransactionType = typeof TRANSACTION_TYPES[number];