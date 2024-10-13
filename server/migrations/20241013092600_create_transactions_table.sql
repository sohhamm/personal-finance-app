-- Add migration script here

CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');

CREATE TABLE IF transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    recipient_sender TEXT NOT NULL,
    category TEXT NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type transaction_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);

-- Down migration
-- This script removes the transactions table and related types
DROP TABLE IF EXISTS transactions;
DROP TYPE IF EXISTS transaction_type;