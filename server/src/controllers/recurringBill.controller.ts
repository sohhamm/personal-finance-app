import type {Response} from 'express'
import type {AuthenticatedRequest} from '@/types/api'
import {sql} from '@/db/index'
import {ResponseUtils} from '@/utils/response'
import {Logger} from '@/utils/logger'

export class RecurringBillController {
  static async getRecurringBills(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id
      const {search, sortBy = 'latest', page = 1, limit = 10} = req.query

      let orderBy = 'due_day ASC'

      switch (sortBy) {
        case 'latest':
          orderBy = 'due_day ASC'
          break
        case 'oldest':
          orderBy = 'due_day DESC'
          break
        case 'a-z':
          orderBy = 'name ASC'
          break
        case 'z-a':
          orderBy = 'name DESC'
          break
        case 'highest':
          orderBy = 'amount DESC'
          break
        case 'lowest':
          orderBy = 'amount ASC'
          break
        default:
          orderBy = 'due_day ASC'
      }

      const offset = (Number(page) - 1) * Number(limit)

      let whereCondition = 'WHERE rb.user_id = $1 AND rb.is_active = true'
      const params: any[] = [userId]

      if (search) {
        whereCondition += ' AND LOWER(rb.name) LIKE $' + (params.length + 1)
        params.push(`%${String(search).toLowerCase()}%`)
      }

      // Get recurring bills with their payment status for current month
      const query = `
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
      `

      params.push(Number(limit), offset)

      const recurringBills = await sql.unsafe(query, params)

      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT rb.id) as total
        FROM recurring_bills rb
        ${whereCondition}
      `

      const countResult = await sql.unsafe(countQuery, params.slice(0, -2))
      const total = Number(countResult[0]?.total || 0)

      return ResponseUtils.paginated(
        res,
        recurringBills,
        {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasNext: Number(page) < Math.ceil(total / Number(limit)),
          hasPrev: Number(page) > 1,
        },
        'Recurring bills retrieved successfully',
      )
    } catch (error) {
      const err = error as any
      Logger.error('Error getting recurring bills:', err)
      return ResponseUtils.serverError(res)
    }
  }

  static async getRecurringBillById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id
      const {id} = req.params

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
        WHERE rb.id = ${id} AND rb.user_id = ${userId}
        GROUP BY rb.id
      `

      if (recurringBill.length === 0) {
        return ResponseUtils.notFound(res, 'Recurring bill not found')
      }

      return ResponseUtils.success(res, recurringBill[0], 'Recurring bill retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Error getting recurring bill by ID:', err)
      return ResponseUtils.serverError(res)
    }
  }

  static async createRecurringBill(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id
      const {name, amount, dueDay, category, avatar} = req.body

      const recurringBill = await sql`
        INSERT INTO recurring_bills (user_id, name, amount, due_day, category, avatar)
        VALUES (${userId}, ${name}, ${amount}, ${dueDay}, ${category}, ${avatar || null})
        RETURNING *
      `

      // Generate initial payment records for current and next month
      await RecurringBillController.generatePaymentRecords(recurringBill[0].id, dueDay)

      return ResponseUtils.created(res, recurringBill[0], 'Recurring bill created successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Error creating recurring bill:', err)
      return ResponseUtils.serverError(res)
    }
  }

  static async updateRecurringBill(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id
      const {id} = req.params
      const {name, amount, dueDay, category, avatar, isActive} = req.body

      const updateData: any = {updated_at: new Date()}
      if (name !== undefined) updateData.name = name
      if (amount !== undefined) updateData.amount = amount
      if (dueDay !== undefined) updateData.due_day = dueDay
      if (category !== undefined) updateData.category = category
      if (avatar !== undefined) updateData.avatar = avatar
      if (isActive !== undefined) updateData.is_active = isActive

      const recurringBill = await sql`
        UPDATE recurring_bills 
        SET ${sql(updateData)}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `

      if (recurringBill.length === 0) {
        return ResponseUtils.notFound(res, 'Recurring bill not found')
      }

      return ResponseUtils.success(res, recurringBill[0], 'Recurring bill updated successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Error updating recurring bill:', err)
      return ResponseUtils.serverError(res)
    }
  }

  static async deleteRecurringBill(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id
      const {id} = req.params

      const result = await sql`
        DELETE FROM recurring_bills 
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id
      `

      if (result.length === 0) {
        return ResponseUtils.notFound(res, 'Recurring bill not found')
      }

      return ResponseUtils.success(res, null, 'Recurring bill deleted successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Error deleting recurring bill:', err)
      return ResponseUtils.serverError(res)
    }
  }

  static async markBillAsPaid(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id
      const {paymentId} = req.params
      const {transactionId} = req.body

      // Verify the payment belongs to user
      const payment = await sql`
        SELECT rbp.*, rb.user_id
        FROM recurring_bill_payments rbp
        JOIN recurring_bills rb ON rbp.recurring_bill_id = rb.id
        WHERE rbp.id = ${paymentId} AND rb.user_id = ${userId}
      `

      if (payment.length === 0) {
        return ResponseUtils.notFound(res, 'Payment record not found')
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
      `

      return ResponseUtils.success(res, updatedPayment[0], 'Bill marked as paid successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Error marking bill as paid:', err)
      return ResponseUtils.serverError(res)
    }
  }

  static async getBillsDueSoon(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res)
        return
      }
      const userId = req.user.id

      // Get latest transaction date to calculate "due soon" from
      const latestTransaction = await sql`
        SELECT transaction_date 
        FROM transactions 
        WHERE user_id = ${userId}
        ORDER BY transaction_date DESC 
        LIMIT 1
      `

      const referenceDate = latestTransaction[0]?.transaction_date || new Date()
      const fiveDaysFromReference = new Date(referenceDate)
      fiveDaysFromReference.setDate(fiveDaysFromReference.getDate() + 5)

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
      `

      return ResponseUtils.success(res, billsDueSoon, 'Bills due soon retrieved successfully')
    } catch (error) {
      const err = error as any
      Logger.error('Error getting bills due soon:', err)
      return ResponseUtils.serverError(res)
    }
  }

  // Helper method to generate payment records
  private static async generatePaymentRecords(recurringBillId: string, dueDay: number) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Generate for current month and next month
    for (let i = 0; i < 2; i++) {
      const targetMonth = currentMonth + i
      const targetYear = currentYear + Math.floor(targetMonth / 12)
      const adjustedMonth = targetMonth % 12

      const dueDate = new Date(targetYear, adjustedMonth, dueDay)

      // Skip if due date already passed in current month
      if (i === 0 && dueDate < currentDate) {
        continue
      }

      const existingPayment = await sql`
        SELECT id FROM recurring_bill_payments
        WHERE recurring_bill_id = ${recurringBillId}
          AND due_date = ${dueDate}
      `

      if (existingPayment.length === 0) {
        const bill = await sql`
          SELECT amount FROM recurring_bills WHERE id = ${recurringBillId}
        `

        await sql`
          INSERT INTO recurring_bill_payments (recurring_bill_id, due_date, amount, status)
          VALUES (${recurringBillId}, ${dueDate}, ${bill[0].amount}, 'pending')
        `
      }
    }
  }
}
