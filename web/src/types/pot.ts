export interface Pot {
  id: string
  user_id: string
  name: string
  target: string
  total: string
  theme: string
  created_at: Date
  updated_at: Date
}

export interface CreatePotRequest {
  name: string
  target: number
  theme: string
}

export interface UpdatePotRequest extends Partial<CreatePotRequest> {
  total?: number
}

export interface PotTransactionRequest {
  amount: number
  type: 'add' | 'withdraw'
}

export interface PotQuery {
  page?: string
  limit?: string
  search?: string
  sortBy?: 'name' | 'target' | 'total' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}