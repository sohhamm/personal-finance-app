/**
 * Base API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Base query parameters for pagination
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

/**
 * Base query parameters for searching and sorting
 */
export interface BaseTableQuery extends PaginationQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Common error response type
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

/**
 * Table filters interface for frontend
 */
export interface TableFilters {
  [key: string]: string[] | { id: string; name: string }[];
}