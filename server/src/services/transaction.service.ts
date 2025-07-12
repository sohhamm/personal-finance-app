import { sql, Transaction } from '@/db';
import { AppError } from '@/middleware/error';
import { Logger } from '@/utils/logger';
import {
  TransactionQuery,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  PaginatedResponse,
} from '@/types/api';

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
      conditions = sql`${conditions} AND recipient_sender ILIKE ${`%${search}%`}`;
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

    // Build order by
    let orderByColumn = 'transaction_date';
    switch (sortBy) {
      case 'amount':
        orderByColumn = 'amount::numeric';
        break;
      case 'name':
        orderByColumn = 'recipient_sender';
        break;
      case 'date':
      default:
        orderByColumn = 'transaction_date';
        break;
    }

    const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';

    // Execute queries
    const [data, totalResult] = await Promise.all([
      sql<Transaction[]>`
        SELECT * FROM transactions 
        WHERE ${conditions}
        ORDER BY ${sql.unsafe(orderByColumn)} ${sql.unsafe(orderDirection)}
        LIMIT ${limitNum} OFFSET ${offset}
      `,
      sql<[{ count: number }]>`
        SELECT COUNT(*) as count FROM transactions 
        WHERE ${conditions}
      `,
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

  static async getTransactionById(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    const result = await sql<Transaction[]>`
      SELECT * FROM transactions 
      WHERE id = ${transactionId} AND user_id = ${userId}
      LIMIT 1
    `;

    if (!result.length) {
      throw new AppError('Transaction not found', 404);
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

    // Validate amount
    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    // Validate transaction date
    const txDate = new Date(transactionDate);
    if (txDate > new Date()) {
      throw new AppError('Transaction date cannot be in the future', 400);
    }

    const [transaction] = await sql<Transaction[]>`
      INSERT INTO transactions (
        user_id, recipient_sender, category, transaction_date, 
        amount, transaction_type, recurring, avatar
      )
      VALUES (
        ${userId}, ${recipientSender}, ${category}, ${txDate},
        ${amount.toString()}, ${transactionType}, ${recurring}, ${avatar}
      )
      RETURNING *
    `;

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
    const existing = await this.getTransactionById(userId, transactionId);

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.recipientSender !== undefined) {
      updates.push(`recipient_sender = $${paramIndex++}`);
      values.push(data.recipientSender);
    }

    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }

    if (data.transactionDate !== undefined) {
      const txDate = new Date(data.transactionDate);
      if (txDate > new Date()) {
        throw new AppError('Transaction date cannot be in the future', 400);
      }
      updates.push(`transaction_date = $${paramIndex++}`);
      values.push(txDate);
    }

    if (data.amount !== undefined) {
      if (data.amount <= 0) {
        throw new AppError('Amount must be greater than 0', 400);
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

    const [result] = await sql<Transaction[]>`
      UPDATE transactions 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE id = ${transactionId}
      RETURNING *
    `;

    Logger.info('Transaction updated', {
      userId,
      transactionId,
      updatedFields: updates.map(u => u.split(' = ')[0]),
    });

    return result;
  }

  static async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    // Check if transaction exists and belongs to user
    await this.getTransactionById(userId, transactionId);

    await sql`
      DELETE FROM transactions 
      WHERE id = ${transactionId}
    `;

    Logger.info('Transaction deleted', { userId, transactionId });
  }

  static async getCategories(): Promise<string[]> {
    return [
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
    ];
  }

  static async getTransactionStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  }> {
    const [result] = await sql<[{
      total_income: string | null;
      total_expenses: string | null;
      transaction_count: number;
    }]>`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount::numeric ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount::numeric ELSE 0 END) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions 
      WHERE user_id = ${userId}
    `;

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