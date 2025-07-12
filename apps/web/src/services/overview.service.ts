import { apiClient } from '@/configs/api';
import type {
  OverviewData,
  MonthlyTrend,
  MonthlyTrendsQuery,
  ApiResponse
} from '@personal-finance-app/shared-types';

const routeFactory = (path?: string) => {
  return `/api/overview${path ? '/' + path : ''}`;
};

export class OverviewService {
  static async getOverviewData(): Promise<OverviewData> {
    const response = await apiClient.get<ApiResponse<OverviewData>>(routeFactory());
    return response.data.data!;
  }

  static async getMonthlyTrends(query: MonthlyTrendsQuery = {}): Promise<MonthlyTrend[]> {
    const params = new URLSearchParams();
    
    if (query.months) params.append('months', query.months.toString());

    const response = await apiClient.get<ApiResponse<MonthlyTrend[]>>(
      routeFactory('monthly-trends') + (params.toString() ? `?${params.toString()}` : '')
    );
    return response.data.data!;
  }
}

// Create instance for backward compatibility
export const overviewService = new OverviewService();