import { apiClient } from '@/configs/api';
import type {
  RecurringBill,
  RecurringBillWithPayments,
  CreateRecurringBillRequest,
  UpdateRecurringBillRequest,
  RecurringBillQuery,
  MarkBillAsPaidRequest,
  PaginatedResponse,
  ApiResponse
} from '@personal-finance-app/shared-types';

const routeFactory = (path?: string) => {
  return `/api/recurring-bills${path ? '/' + path : ''}`;
};

export class RecurringBillService {
  static async getRecurringBills(query: RecurringBillQuery = {}): Promise<PaginatedResponse<RecurringBillWithPayments>> {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page);
    if (query.limit) params.append('limit', query.limit);
    if (query.search) params.append('search', query.search);
    if (query.sortBy) params.append('sortBy', query.sortBy);

    const response = await apiClient.get<ApiResponse<PaginatedResponse<RecurringBillWithPayments>>>(
      routeFactory() + (params.toString() ? `?${params.toString()}` : '')
    );
    return response.data.data!;
  }

  static async getRecurringBillById(id: string): Promise<RecurringBillWithPayments> {
    const response = await apiClient.get<ApiResponse<RecurringBillWithPayments>>(
      routeFactory(id)
    );
    return response.data.data!;
  }

  static async createRecurringBill(payload: CreateRecurringBillRequest): Promise<RecurringBill> {
    const response = await apiClient.post<ApiResponse<RecurringBill>>(
      routeFactory(), 
      payload
    );
    return response.data.data!;
  }

  static async updateRecurringBill(id: string, payload: UpdateRecurringBillRequest): Promise<RecurringBill> {
    const response = await apiClient.put<ApiResponse<RecurringBill>>(
      routeFactory(id), 
      payload
    );
    return response.data.data!;
  }

  static async deleteRecurringBill(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(routeFactory(id));
  }

  static async markBillAsPaid(paymentId: string, payload: MarkBillAsPaidRequest): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(
      routeFactory(`payments/${paymentId}/paid`),
      payload
    );
  }

  static async getBillsDueSoon(): Promise<RecurringBillWithPayments[]> {
    const response = await apiClient.get<ApiResponse<RecurringBillWithPayments[]>>(
      routeFactory('due-soon')
    );
    return response.data.data!;
  }
}

// Create instance for backward compatibility
export const recurringBillService = new RecurringBillService();