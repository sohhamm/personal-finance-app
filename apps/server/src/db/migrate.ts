import { sql } from './index';
import { Logger } from '../utils/logger';

const migrations = [
  {
    id: '001_create_users_table',
    sql: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS email_idx ON users(email);
    `,
  },
  {
    id: '002_create_transactions_table',
    sql: `
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('income', 'expense');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE category AS ENUM (
          'Entertainment',
          'Bills',
          'Groceries',
          'Dining Out',
          'Transportation',
          'Personal Care',
          'Education',
          'Lifestyle',
          'Shopping',
          'General'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_sender VARCHAR(255) NOT NULL,
        category category NOT NULL,
        transaction_date TIMESTAMP NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        transaction_type transaction_type NOT NULL,
        recurring BOOLEAN DEFAULT FALSE NOT NULL,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS user_id_idx ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS category_idx ON transactions(category);
      CREATE INDEX IF NOT EXISTS transaction_date_idx ON transactions(transaction_date);
      CREATE INDEX IF NOT EXISTS transaction_type_idx ON transactions(transaction_type);
      CREATE INDEX IF NOT EXISTS recurring_idx ON transactions(recurring);
    `,
  },
  {
    id: '003_create_budgets_table',
    sql: `
      CREATE TABLE IF NOT EXISTS budgets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category category NOT NULL,
        maximum DECIMAL(10, 2) NOT NULL,
        theme VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS budget_user_id_idx ON budgets(user_id);
      CREATE INDEX IF NOT EXISTS budget_category_idx ON budgets(category);
      CREATE UNIQUE INDEX IF NOT EXISTS unique_user_category_idx ON budgets(user_id, category);
    `,
  },
  {
    id: '004_create_pots_table',
    sql: `
      CREATE TABLE IF NOT EXISTS pots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        target DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) DEFAULT 0 NOT NULL,
        theme VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS pot_user_id_idx ON pots(user_id);
      CREATE INDEX IF NOT EXISTS pot_name_idx ON pots(name);
    `,
  },
  {
    id: '005_create_migrations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `,
  },
  {
    id: '006_create_recurring_bills',
    sql: `
      CREATE TABLE IF NOT EXISTS recurring_bills (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
        category category NOT NULL,
        avatar VARCHAR(500),
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recurring_bill_payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recurring_bill_id UUID NOT NULL REFERENCES recurring_bills(id) ON DELETE CASCADE,
        transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
        due_date DATE NOT NULL,
        paid_date TIMESTAMP,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS recurring_bills_user_id_idx ON recurring_bills(user_id);
      CREATE INDEX IF NOT EXISTS recurring_bills_name_idx ON recurring_bills(name);
      CREATE INDEX IF NOT EXISTS recurring_bills_due_day_idx ON recurring_bills(due_day);
      CREATE INDEX IF NOT EXISTS recurring_bill_payments_bill_id_idx ON recurring_bill_payments(recurring_bill_id);
      CREATE INDEX IF NOT EXISTS recurring_bill_payments_due_date_idx ON recurring_bill_payments(due_date);
      CREATE INDEX IF NOT EXISTS recurring_bill_payments_status_idx ON recurring_bill_payments(status);
      CREATE UNIQUE INDEX IF NOT EXISTS unique_bill_due_date_idx ON recurring_bill_payments(recurring_bill_id, due_date);
    `,
  },
];

async function runMigrations() {
  try {
    Logger.info('Starting database migrations...');

    // Create migrations table first
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Get executed migrations
    const executedMigrations = await sql`
      SELECT id FROM migrations;
    `;
    
    const executedIds = new Set(executedMigrations.map(m => m.id));

    // Run pending migrations
    for (const migration of migrations) {
      if (!executedIds.has(migration.id)) {
        Logger.info(`Running migration: ${migration.id}`);
        
        await sql.begin(async (sql) => {
          // Execute the migration SQL
          await sql.unsafe(migration.sql);
          
          // Record the migration as executed
          await sql`
            INSERT INTO migrations (id) VALUES (${migration.id});
          `;
        });
        
        Logger.info(`Completed migration: ${migration.id}`);
      } else {
        Logger.info(`Skipping already executed migration: ${migration.id}`);
      }
    }

    Logger.info('All migrations completed successfully');
  } catch (error) {
    Logger.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run migrations if called directly
if (import.meta.main) {
  runMigrations();
}

export { runMigrations };