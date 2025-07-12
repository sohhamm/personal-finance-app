import { sql } from '@/db/index';
import { Logger } from '@/utils/logger';

interface RecurringBillQuery {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface CreateRecurringBillData {
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  avatar?: string;
}

interface UpdateRecurringBillData {
  name?: string;
  amount?: number;
  dueDay?: number;
  category?: string;
  avatar?: string;
  isActive?: boolean;
}

export class RecurringBillService {
  /**
   * Get paginated list of recurring bills for a user
   */
  static async getRecurringBills(userId: string, query: RecurringBillQuery) {
    try {
      Logger.info(`Getting recurring bills for user: ${userId}`);

      const { search, sortBy = 'latest', page = 1, limit = 10 } = query;

      let orderBy = 'due_day ASC';

      switch (sortBy) {
        case 'latest':
          orderBy = 'due_day ASC';
          break;
        case 'oldest':
          orderBy = 'due_day DESC';
          break;
        case 'a-z':
          orderBy = 'name ASC';
          break;
        case 'z-a':
          orderBy = 'name DESC';
          break;
        case 'highest':
          orderBy = 'amount DESC';
          break;
        case 'lowest':
          orderBy = 'amount ASC';
          break;
        default:
          orderBy = 'due_day ASC';
      }

      const offset = (Number(page) - 1) * Number(limit);

      let whereCondition = 'WHERE rb.user_id = $1 AND rb.is_active = true';
      const params: any[] = [userId];

      if (search) {
        whereCondition += ' AND LOWER(rb.name) LIKE $' + (params.length + 1);
        params.push(`%${String(search).toLowerCase()}%`);
      }

      // Get recurring bills with their payment status for current month
      const queryStr = /* sql */ `
        SELECT 
          rb.*,
          COALESCE(
            JSON_AGG(
              CASE WHEN rbp.id IS NOT NULL THEN
                JSON_BUILD_OBJECT(
                  'id', rbp.id,
                  'due_date', rbp.due_date,
                  'paid_date', rbp.paid_date,
                  'status', rbp.status,
                  'amount', rbp.amount
                )
              ELSE NULL END
            ) FILTER (WHERE rbp.id IS NOT NULL), 
            '[]'
          ) as payments
        FROM recurring_bills rb
        LEFT JOIN recurring_bill_payments rbp ON rb.id = rbp.recurring_bill_id 
          AND DATE_TRUNC('month', rbp.due_date) = DATE_TRUNC('month', CURRENT_DATE)
        ${whereCondition}
        GROUP BY rb.id
        ORDER BY ${orderBy}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;

      params.push(Number(limit), offset);

      const recurringBills = await sql.unsafe(queryStr, params);

      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT rb.id) as total
        FROM recurring_bills rb
        ${whereCondition}
      `;

      const countResult = await sql.unsafe(countQuery, params.slice(0, -2));
      const total = Number(countResult[0]?.total || 0);

      const paginationData = {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
      };

      Logger.info(`Retrieved ${recurringBills.length} recurring bills for user: ${userId}`);
      return { data: recurringBills, pagination: paginationData };
    } catch (error) {
      Logger.error('Error in RecurringBillService.getRecurringBills:', error);
      throw error;
    }
  }

  /**
   * Get a specific recurring bill by ID
   */
  static async getRecurringBillById(userId: string, billId: string) {
    try {
      Logger.info(`Getting recurring bill ${billId} for user: ${userId}`);

      const recurringBill = await sql`
        SELECT rb.*, 
               JSON_AGG(
                 CASE WHEN rbp.id IS NOT NULL THEN
                   JSON_BUILD_OBJECT(
                     'id', rbp.id,
                     'due_date', rbp.due_date,
                     'paid_date', rbp.paid_date,
                     'status', rbp.status,
                     'amount', rbp.amount
                   )
                 ELSE NULL END
               ) FILTER (WHERE rbp.id IS NOT NULL) as payments
        FROM recurring_bills rb
        LEFT JOIN recurring_bill_payments rbp ON rb.id = rbp.recurring_bill_id
        WHERE rb.id = ${billId} AND rb.user_id = ${userId}
        GROUP BY rb.id
      `;

      if (recurringBill.length === 0) {
        throw new Error('Recurring bill not found');
      }

      Logger.info(`Retrieved recurring bill ${billId} for user: ${userId}`);
      return recurringBill[0];
    } catch (error) {
      Logger.error('Error in RecurringBillService.getRecurringBillById:', error);
      throw error;
    }
  }

  /**
   * Create a new recurring bill
   */
  static async createRecurringBill(userId: string, data: CreateRecurringBillData) {
    try {
      Logger.info(`Creating recurring bill for user: ${userId}`);

      const { name, amount, dueDay, category, avatar } = data;

      const recurringBill = await sql`
        INSERT INTO recurring_bills (user_id, name, amount, due_day, category, avatar)
        VALUES (${userId}, ${name}, ${amount}, ${dueDay}, ${category}, ${avatar || null})
        RETURNING *
      `;

      // Generate initial payment records for current and next month
      await RecurringBillService.generatePaymentRecords(recurringBill[0].id, dueDay);

      Logger.info(`Created recurring bill ${recurringBill[0].id} for user: ${userId}`);
      return recurringBill[0];
    } catch (error) {
      Logger.error('Error in RecurringBillService.createRecurringBill:', error);
      throw error;
    }
  }

  /**
   * Update a recurring bill
   */
  static async updateRecurringBill(userId: string, billId: string, data: UpdateRecurringBillData) {
    try {
      Logger.info(`Updating recurring bill ${billId} for user: ${userId}`);

      const { name, amount, dueDay, category, avatar, isActive } = data;

      const updateData: any = { updated_at: new Date() };
      if (name !== undefined) updateData.name = name;
      if (amount !== undefined) updateData.amount = amount;
      if (dueDay !== undefined) updateData.due_day = dueDay;
      if (category !== undefined) updateData.category = category;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (isActive !== undefined) updateData.is_active = isActive;

      const recurringBill = await sql`
        UPDATE recurring_bills 
        SET ${sql(updateData)}
        WHERE id = ${billId} AND user_id = ${userId}
        RETURNING *
      `;

      if (recurringBill.length === 0) {
        throw new Error('Recurring bill not found');
      }

      Logger.info(`Updated recurring bill ${billId} for user: ${userId}`);
      return recurringBill[0];
    } catch (error) {
      Logger.error('Error in RecurringBillService.updateRecurringBill:', error);
      throw error;
    }
  }

  /**
   * Delete a recurring bill
   */
  static async deleteRecurringBill(userId: string, billId: string) {
    try {
      Logger.info(`Deleting recurring bill ${billId} for user: ${userId}`);

      const result = await sql`
        DELETE FROM recurring_bills 
        WHERE id = ${billId} AND user_id = ${userId}
        RETURNING id
      `;

      if (result.length === 0) {
        throw new Error('Recurring bill not found');
      }

      Logger.info(`Deleted recurring bill ${billId} for user: ${userId}`);
      return result[0];
    } catch (error) {
      Logger.error('Error in RecurringBillService.deleteRecurringBill:', error);
      throw error;
    }
  }

  /**
   * Mark a bill payment as paid
   */
  static async markBillAsPaid(userId: string, paymentId: string, transactionId?: string) {
    try {
      Logger.info(`Marking payment ${paymentId} as paid for user: ${userId}`);

      // Verify the payment belongs to user
      const payment = await sql`
        SELECT rbp.*, rb.user_id
        FROM recurring_bill_payments rbp
        JOIN recurring_bills rb ON rbp.recurring_bill_id = rb.id
        WHERE rbp.id = ${paymentId} AND rb.user_id = ${userId}
      `;

      if (payment.length === 0) {
        throw new Error('Payment record not found');
      }

      const updatedPayment = await sql`
        UPDATE recurring_bill_payments
        SET 
          status = 'paid',
          paid_date = NOW(),
          transaction_id = ${transactionId || null},
          updated_at = NOW()
        WHERE id = ${paymentId}
        RETURNING *
      `;

      Logger.info(`Marked payment ${paymentId} as paid for user: ${userId}`);
      return updatedPayment[0];
    } catch (error) {
      Logger.error('Error in RecurringBillService.markBillAsPaid:', error);
      throw error;
    }
  }

  /**
   * Get bills due soon for a user
   */
  static async getBillsDueSoon(userId: string) {
    try {
      Logger.info(`Getting bills due soon for user: ${userId}`);

      // Get latest transaction date to calculate "due soon" from
      const latestTransaction = await sql`
        SELECT transaction_date 
        FROM transactions 
        WHERE user_id = ${userId}
        ORDER BY transaction_date DESC 
        LIMIT 1
      `;

      const referenceDate = latestTransaction[0]?.transaction_date || new Date();
      const fiveDaysFromReference = new Date(referenceDate);
      fiveDaysFromReference.setDate(fiveDaysFromReference.getDate() + 5);

      const billsDueSoon = await sql`
        SELECT rb.*, rbp.*
        FROM recurring_bills rb
        JOIN recurring_bill_payments rbp ON rb.id = rbp.recurring_bill_id
        WHERE rb.user_id = ${userId} 
          AND rb.is_active = true
          AND rbp.status = 'pending'
          AND rbp.due_date <= ${fiveDaysFromReference}
          AND rbp.due_date >= CURRENT_DATE
        ORDER BY rbp.due_date ASC
      `;

      Logger.info(`Retrieved ${billsDueSoon.length} bills due soon for user: ${userId}`);
      return billsDueSoon;
    } catch (error) {
      Logger.error('Error in RecurringBillService.getBillsDueSoon:', error);
      throw error;
    }
  }

  /**
   * Generate payment records for a recurring bill
   */
  private static async generatePaymentRecords(recurringBillId: string, dueDay: number) {
    try {
      Logger.info(`Generating payment records for recurring bill: ${recurringBillId}`);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Generate for current month and next month
      for (let i = 0; i < 2; i++) {
        const targetMonth = currentMonth + i;
        const targetYear = currentYear + Math.floor(targetMonth / 12);
        const adjustedMonth = targetMonth % 12;

        const dueDate = new Date(targetYear, adjustedMonth, dueDay);

        // Skip if due date already passed in current month
        if (i === 0 && dueDate < currentDate) {
          continue;
        }

        const existingPayment = await sql`
          SELECT id FROM recurring_bill_payments
          WHERE recurring_bill_id = ${recurringBillId}
            AND due_date = ${dueDate}
        `;

        if (existingPayment.length === 0) {
          const bill = await sql`
            SELECT amount FROM recurring_bills WHERE id = ${recurringBillId}
          `;

          await sql`
            INSERT INTO recurring_bill_payments (recurring_bill_id, due_date, amount, status)
            VALUES (${recurringBillId}, ${dueDate}, ${bill[0].amount}, 'pending')
          `;

          Logger.info(`Generated payment record for bill ${recurringBillId} on ${dueDate}`);
        }
      }
    } catch (error) {
      Logger.error('Error in RecurringBillService.generatePaymentRecords:', error);
      throw error;
    }
  }
}
