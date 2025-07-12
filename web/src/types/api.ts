export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface TableFilters {
  [key: string]: string[] | { id: string; name: string }[]
}

// Common query parameters for tables
export interface BaseTableQuery {
  page?: string
  limit?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}