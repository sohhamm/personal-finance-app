import {apiClient} from '@/configs/api'
import type {Budget, CreateBudgetRequest, UpdateBudgetRequest, BudgetQuery} from '@/types/budget'
import type {ApiResponse} from '@/types/api'

const routeFactory = (path?: string) => {
  return `/api/budgets${path ? '/' + path : ''}`
}

export class BudgetService {
  async getBudgets(query: BudgetQuery = {}): Promise<Budget[]> {
    const params = new URLSearchParams()

    if (query.page) params.append('page', query.page)
    if (query.limit) params.append('limit', query.limit)
    if (query.search) params.append('search', query.search)
    if (query.category) params.append('category', query.category)
    if (query.sortBy) params.append('sortBy', query.sortBy)
    if (query.sortOrder) params.append('sortOrder', query.sortOrder)

    const response = await apiClient.get<ApiResponse<Budget[]>>(
      routeFactory() + (params.toString() ? `?${params.toString()}` : ''),
    )
    return response.data.data!
  }

  async getBudgetById(id: string): Promise<Budget> {
    const response = await apiClient.get<ApiResponse<Budget>>(routeFactory(id))
    return response.data.data!
  }

  async createBudget(payload: CreateBudgetRequest): Promise<Budget> {
    const response = await apiClient.post<ApiResponse<Budget>>(routeFactory(), payload)
    return response.data.data!
  }

  async updateBudget(id: string, payload: UpdateBudgetRequest): Promise<Budget> {
    const response = await apiClient.put<ApiResponse<Budget>>(routeFactory(id), payload)
    return response.data.data!
  }

  async deleteBudget(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(routeFactory(id))
  }
}
