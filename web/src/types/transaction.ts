export interface Transaction {
  id: string
  user_id: string
  recipient_sender: string
  category: TransactionCategory
  transaction_date: Date
  amount: string
  transaction_type: TransactionType
  recurring: boolean
  avatar?: string
  created_at: Date
  updated_at: Date
}

export type TransactionType = 'income' | 'expense'

export type TransactionCategory = 
  | 'Entertainment'
  | 'Bills'
  | 'Groceries'
  | 'Dining Out'
  | 'Transportation'
  | 'Personal Care'
  | 'Education'
  | 'Lifestyle'
  | 'Shopping'
  | 'General'

export interface CreateTransactionRequest {
  recipientSender: string
  category: TransactionCategory
  transactionDate: string
  amount: number
  transactionType: TransactionType
  recurring?: boolean
  avatar?: string
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface TransactionQuery {
  page?: string
  limit?: string
  search?: string
  category?: TransactionCategory
  sortBy?: 'date' | 'amount' | 'name'
  sortOrder?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
}

export interface TransactionStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
}

export interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMetadata
}