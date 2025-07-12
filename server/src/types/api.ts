import type {User} from '@/db'
import type {Request} from 'express'

export interface AuthenticatedRequest extends Request {
  user?: User
}

export interface PaginationQuery {
  page?: string
  limit?: string
}

export interface TransactionQuery extends PaginationQuery {
  search?: string
  category?: string
  sortBy?: 'date' | 'amount' | 'name'
  sortOrder?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>
  token: string
  expiresIn: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface CreateTransactionRequest {
  recipientSender: string
  category: string
  transactionDate: string
  amount: number
  transactionType: 'income' | 'expense'
  recurring?: boolean
  avatar?: string
}

export interface UpdateTransactionRequest {
  recipientSender?: string
  category?: string
  transactionDate?: string
  amount?: number
  transactionType?: 'income' | 'expense'
  recurring?: boolean
  avatar?: string
}

export interface CreateBudgetRequest {
  category: string
  maximum: number
  theme: string
}

export interface UpdateBudgetRequest {
  category?: string
  maximum?: number
  theme?: string
}

export interface CreatePotRequest {
  name: string
  target: number
  theme: string
}

export interface UpdatePotRequest {
  name?: string
  target?: number
  theme?: string
}

export interface PotTransactionRequest {
  amount: number
}
