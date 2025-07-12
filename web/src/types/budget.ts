import { TransactionCategory } from './transaction'

export interface Budget {
  id: string
  user_id: string
  category: TransactionCategory
  maximum: string
  theme: string
  created_at: Date
  updated_at: Date
}

export interface CreateBudgetRequest {
  category: TransactionCategory
  maximum: number
  theme: string
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {}

export interface BudgetQuery {
  page?: string
  limit?: string
  search?: string
  category?: TransactionCategory
  sortBy?: 'category' | 'maximum' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}