import { apiClient } from '@/configs/api';
import type {
  Pot, 
  CreatePotRequest, 
  UpdatePotRequest, 
  PotTransactionRequest,
  PotProgress,
  ApiResponse
} from '@personal-finance-app/shared-types';

const routeFactory = (path?: string) => {
  return `/api/pots${path ? '/' + path : ''}`;
};

export class PotService {
  static async getPots(): Promise<Pot[]> {
    const response = await apiClient.get<ApiResponse<Pot[]>>(routeFactory());
    return response.data.data!;
  }

  static async getPotById(id: string): Promise<Pot> {
    const response = await apiClient.get<ApiResponse<Pot>>(routeFactory(id));
    return response.data.data!;
  }

  static async createPot(payload: CreatePotRequest): Promise<Pot> {
    const response = await apiClient.post<ApiResponse<Pot>>(routeFactory(), payload);
    return response.data.data!;
  }

  static async updatePot(id: string, payload: UpdatePotRequest): Promise<Pot> {
    const response = await apiClient.put<ApiResponse<Pot>>(routeFactory(id), payload);
    return response.data.data!;
  }

  static async deletePot(id: string): Promise<{ returnedAmount: number }> {
    const response = await apiClient.delete<ApiResponse<{ returnedAmount: number }>>(
      routeFactory(id)
    );
    return response.data.data!;
  }

  static async addMoney(id: string, payload: PotTransactionRequest): Promise<Pot> {
    const response = await apiClient.post<ApiResponse<Pot>>(
      routeFactory(`${id}/add`), 
      payload
    );
    return response.data.data!;
  }

  static async withdrawMoney(id: string, payload: PotTransactionRequest): Promise<Pot> {
    const response = await apiClient.post<ApiResponse<Pot>>(
      routeFactory(`${id}/withdraw`), 
      payload
    );
    return response.data.data!;
  }

  static async getPotProgress(id: string): Promise<PotProgress> {
    const response = await apiClient.get<ApiResponse<PotProgress>>(
      routeFactory(`${id}/progress`)
    );
    return response.data.data!;
  }
}

// Create instance for backward compatibility
export const potService = new PotService();