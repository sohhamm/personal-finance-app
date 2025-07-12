import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export class ResponseUtils {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message !== undefined && { message }),
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 400, errors?: string[]): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(errors !== undefined && { errors }),
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginatedResponse<T>['pagination'],
    message?: string,
    statusCode = 200
  ): Response {
    const response: ApiResponse<PaginatedResponse<T>> = {
      success: true,
      data: {
        data,
        pagination,
      },
      ...(message !== undefined && { message }),
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): Response {
    return ResponseUtils.success(res, data, message, 201);
  }

  static noContent(res: Response, message?: string): Response {
    const response: ApiResponse = {
      success: true,
      ...(message !== undefined && { message }),
    };
    return res.status(204).json(response);
  }

  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return ResponseUtils.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return ResponseUtils.error(res, message, 403);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return ResponseUtils.error(res, message, 404);
  }

  static serverError(res: Response, message = 'Internal server error'): Response {
    return ResponseUtils.error(res, message, 500);
  }
}
