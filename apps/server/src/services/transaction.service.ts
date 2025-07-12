import type { Transaction } from '@/db';
import { sql } from '@/db';
import { NotFoundError, ValidationError } from '@/types/errors';
import type {
  CreateTransactionRequest,
  PaginatedResponse,
  TransactionQuery,
  UpdateTransactionRequest,
} from '@/types/api';
import { TRANSACTION_CATEGORIES } from '@/constants/categories';
import { Logger } from '@/utils/logger';
import { Sanitizer } from '@/utils/sanitizer';

export class TransactionService {
  static async getTransactions(
    userId: string,
    query: TransactionQuery
  ): Promise<PaginatedResponse<Transaction>> {
    const {
      page = '1',
      limit = '10',
      search,
      category,
      sortBy = 'date',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build base query conditions
    let conditions = sql`user_id = ${userId}`;

    if (search) {
      const sanitizedSearch = Sanitizer.sanitizeUserInput(search);
      conditions = sql`${conditions} AND recipient_sender ILIKE ${`%${sanitizedSearch}%`}`;
    }

    if (category) {
      conditions = sql`${conditions} AND category = ${category}`;
    }

    if (startDate) {
      conditions = sql`${conditions} AND transaction_date >= ${new Date(startDate)}`;
    }

    if (endDate) {
      conditions = sql`${conditions} AND transaction_date <= ${new Date(endDate)}`;
    }

    // Build order by with safe column mapping
    const validColumns = {
      date: 'transaction_date',
      amount: 'amount::numeric',
      name: 'recipient_sender',
    } as const;

    const orderByColumn = validColumns[sortBy as keyof typeof validColumns] || validColumns.date;
    const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';

    // Execute queries
    const [data, totalResult] = await Promise.all([
      sql`
        SELECT * FROM transactions 
        WHERE ${conditions}
        ORDER BY ${sql.unsafe(orderByColumn)} ${sql.unsafe(orderDirection)}
        LIMIT ${limitNum} OFFSET ${offset}
      ` as unknown as Transaction[],
      sql`
        SELECT COUNT(*) as count FROM transactions 
        WHERE ${conditions}
      ` as unknown as [{ count: number }],
    ]);

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limitNum);

    return {
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    };
  }

  static async getTransactionById(userId: string, transactionId: string): Promise<Transaction> {
    const result = (await sql`
      SELECT * FROM transactions 
      WHERE id = ${transactionId} AND user_id = ${userId}
      LIMIT 1
    `) as unknown as Transaction[];

    if (!result.length) {
      throw new NotFoundError('Transaction');
    }

    return result[0];
  }

  static async createTransaction(
    userId: string,
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const {
      recipientSender,
      category,
      transactionDate,
      amount,
      transactionType,
      recurring = false,
      avatar,
    } = data;

    // Sanitize user inputs
    const sanitizedRecipientSender = Sanitizer.sanitizeUserInput(recipientSender);

    // Validate amount
    if (amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    // Validate transaction date
    const txDate = new Date(transactionDate);
    if (txDate > new Date()) {
      throw new ValidationError('Transaction date cannot be in the future');
    }

    const [transaction] = (await sql`
      INSERT INTO transactions (
        user_id, recipient_sender, category, transaction_date, 
        amount, transaction_type, recurring, avatar
      )
      VALUES (
        ${userId}, ${sanitizedRecipientSender}, ${category}, ${txDate},
        ${amount.toString()}, ${transactionType}, ${recurring}, ${avatar}
      )
      RETURNING *
    `) as unknown as Transaction[];

    Logger.info('Transaction created', {
      userId,
      transactionId: transaction.id,
      amount,
      type: transactionType,
    });

    return transaction;
  }

  static async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionRequest
  ): Promise<Transaction> {
    // Check if transaction exists and belongs to user
    const existing = await TransactionService.getTransactionById(userId, transactionId);

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.recipientSender !== undefined) {
      const sanitizedRecipientSender = Sanitizer.sanitizeUserInput(data.recipientSender);
      updates.push(`recipient_sender = $${paramIndex++}`);
      values.push(sanitizedRecipientSender);
    }

    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }

    if (data.transactionDate !== undefined) {
      const txDate = new Date(data.transactionDate);
      if (txDate > new Date()) {
        throw new ValidationError('Transaction date cannot be in the future');
      }
      updates.push(`transaction_date = $${paramIndex++}`);
      values.push(txDate);
    }

    if (data.amount !== undefined) {
      if (data.amount <= 0) {
        throw new ValidationError('Amount must be greater than 0');
      }
      updates.push(`amount = $${paramIndex++}`);
      values.push(data.amount.toString());
    }

    if (data.transactionType !== undefined) {
      updates.push(`transaction_type = $${paramIndex++}`);
      values.push(data.transactionType);
    }

    if (data.recurring !== undefined) {
      updates.push(`recurring = $${paramIndex++}`);
      values.push(data.recurring);
    }

    if (data.avatar !== undefined) {
      updates.push(`avatar = $${paramIndex++}`);
      values.push(data.avatar);
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push(`updated_at = NOW()`);
    values.push(transactionId);

    // Build the update query safely
    const updateQuery = updates.join(', ');
    const [result] = (await sql`
      UPDATE transactions 
      SET ${sql.unsafe(updateQuery)}
      WHERE id = ${transactionId}
      RETURNING *
    `) as unknown as Transaction[];

    Logger.info('Transaction updated', {
      userId,
      transactionId,
      updatedFields: updates.map((u) => u.split(' = ')[0]),
    });

    return result;
  }

  static async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    // Check if transaction exists and belongs to user
    await TransactionService.getTransactionById(userId, transactionId);

    await sql`
      DELETE FROM transactions 
      WHERE id = ${transactionId}
    `;

    Logger.info('Transaction deleted', { userId, transactionId });
  }

  static async getCategories(): Promise<readonly string[]> {
    return TRANSACTION_CATEGORIES;
  }

  static async getTransactionStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  }> {
    const [result] = (await sql`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount::numeric ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount::numeric ELSE 0 END) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions 
      WHERE user_id = ${userId}
    `) as unknown as [
      {
        total_income: string | null;
        total_expenses: string | null;
        transaction_count: number;
      },
    ];

    const totalIncome = Number(result.total_income || 0);
    const totalExpenses = Number(result.total_expenses || 0);
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: result.transaction_count,
    };
  }
}
