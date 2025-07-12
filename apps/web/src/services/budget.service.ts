import { apiClient } from '@/configs/api';
import type {
  Budget, 
  CreateBudgetRequest, 
  UpdateBudgetRequest, 
  BudgetWithSpending,
  ApiResponse
} from '@personal-finance-app/shared-types';

const routeFactory = (path?: string) => {
  return `/api/budgets${path ? '/' + path : ''}`;
};

export class BudgetService {
  static async getBudgets(): Promise<Budget[]> {
    const response = await apiClient.get<ApiResponse<Budget[]>>(routeFactory());
    return response.data.data!;
  }

  static async getBudgetById(id: string): Promise<Budget> {
    const response = await apiClient.get<ApiResponse<Budget>>(routeFactory(id));
    return response.data.data!;
  }

  static async createBudget(payload: CreateBudgetRequest): Promise<Budget> {
    const response = await apiClient.post<ApiResponse<Budget>>(routeFactory(), payload);
    return response.data.data!;
  }

  static async updateBudget(id: string, payload: UpdateBudgetRequest): Promise<Budget> {
    const response = await apiClient.put<ApiResponse<Budget>>(routeFactory(id), payload);
    return response.data.data!;
  }

  static async deleteBudget(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(routeFactory(id));
  }

  static async getBudgetWithSpending(id: string): Promise<BudgetWithSpending> {
    const response = await apiClient.get<ApiResponse<BudgetWithSpending>>(
      routeFactory(`${id}/spending`)
    );
    return response.data.data!;
  }
}

// Create instance for backward compatibility
export const budgetService = new BudgetService();
