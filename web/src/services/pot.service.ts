import { apiClient } from '@/configs/api'
import { 
  Pot, 
  CreatePotRequest, 
  UpdatePotRequest, 
  PotTransactionRequest,
  PotQuery
} from '@/types/pot'
import { ApiResponse } from '@/types/api'

const routeFactory = (path?: string) => {
  return `/api/pots${path ? '/' + path : ''}`
}

export class PotService {
  async getPots(query: PotQuery = {}): Promise<Pot[]> {
    const params = new URLSearchParams()
    
    if (query.page) params.append('page', query.page)
    if (query.limit) params.append('limit', query.limit)
    if (query.search) params.append('search', query.search)
    if (query.sortBy) params.append('sortBy', query.sortBy)
    if (query.sortOrder) params.append('sortOrder', query.sortOrder)

    const response = await apiClient.get<ApiResponse<Pot[]>>(
      routeFactory() + (params.toString() ? `?${params.toString()}` : '')
    )
    return response.data.data!
  }

  async getPotById(id: string): Promise<Pot> {
    const response = await apiClient.get<ApiResponse<Pot>>(routeFactory(id))
    return response.data.data!
  }

  async createPot(payload: CreatePotRequest): Promise<Pot> {
    const response = await apiClient.post<ApiResponse<Pot>>(routeFactory(), payload)
    return response.data.data!
  }

  async updatePot(id: string, payload: UpdatePotRequest): Promise<Pot> {
    const response = await apiClient.put<ApiResponse<Pot>>(routeFactory(id), payload)
    return response.data.data!
  }

  async deletePot(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(routeFactory(id))
  }

  async addToPot(id: string, payload: PotTransactionRequest): Promise<Pot> {
    const response = await apiClient.post<ApiResponse<Pot>>(routeFactory(`${id}/add`), payload)
    return response.data.data!
  }

  async withdrawFromPot(id: string, payload: PotTransactionRequest): Promise<Pot> {
    const response = await apiClient.post<ApiResponse<Pot>>(routeFactory(`${id}/withdraw`), payload)
    return response.data.data!
  }
}