import { apiClient } from '@/configs/api';
import type { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  TransactionQuery,
  TransactionStats,
  PaginatedResponse,
  TransactionCategory,
  ApiResponse
} from '@personal-finance-app/shared-types';

const routeFactory = (path?: string) => {
  return `/api/transactions${path ? '/' + path : ''}`;
};

export class TransactionService {
  static async getTransactions(query: TransactionQuery = {}): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page);
    if (query.limit) params.append('limit', query.limit);
    if (query.search) params.append('search', query.search);
    if (query.category) params.append('category', query.category);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>(
      routeFactory() + (params.toString() ? `?${params.toString()}` : '')
    );
    return response.data.data!;
  }

  static async getTransactionById(id: string): Promise<Transaction> {
    const response = await apiClient.get<ApiResponse<Transaction>>(routeFactory(id));
    return response.data.data!;
  }

  static async createTransaction(payload: CreateTransactionRequest): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<Transaction>>(routeFactory(), payload);
    return response.data.data!;
  }

  static async updateTransaction(id: string, payload: UpdateTransactionRequest): Promise<Transaction> {
    const response = await apiClient.put<ApiResponse<Transaction>>(routeFactory(id), payload);
    return response.data.data!;
  }

  static async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(routeFactory(id));
  }

  static async getTransactionStats(): Promise<TransactionStats> {
    const response = await apiClient.get<ApiResponse<TransactionStats>>(routeFactory('stats'));
    return response.data.data!;
  }

  static async getCategories(): Promise<TransactionCategory[]> {
    const response = await apiClient.get<ApiResponse<TransactionCategory[]>>(routeFactory('categories'));
    return response.data.data!;
  }
}

// Create instance for backward compatibility
export const transactionService = new TransactionService();