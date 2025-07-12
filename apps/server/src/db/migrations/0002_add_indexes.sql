-- Add database indexes for performance optimization

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Transactions table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON transactions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_transactions_recipient_sender ON transactions(recipient_sender);

-- Budgets table indexes
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_budgets_user_category ON budgets(user_id, category);

-- Pots table indexes
CREATE INDEX IF NOT EXISTS idx_pots_user_id ON pots(user_id);
CREATE INDEX IF NOT EXISTS idx_pots_name ON pots(name);

-- Recurring bills table indexes
CREATE INDEX IF NOT EXISTS idx_recurring_bills_user_id ON recurring_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_bills_due_day ON recurring_bills(due_day);
CREATE INDEX IF NOT EXISTS idx_recurring_bills_active ON recurring_bills(is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_bills_user_active ON recurring_bills(user_id, is_active);

-- Recurring bill payments table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_recurring_bill_payments_bill_id ON recurring_bill_payments(recurring_bill_id);
CREATE INDEX IF NOT EXISTS idx_recurring_bill_payments_due_date ON recurring_bill_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_recurring_bill_payments_status ON recurring_bill_payments(status);
CREATE INDEX IF NOT EXISTS idx_recurring_bill_payments_transaction_id ON recurring_bill_payments(transaction_id);