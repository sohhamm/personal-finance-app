import type { Request } from 'express';
import type { User } from '@/db';

// Re-export shared types for backend use
export * from '@personal-finance-app/shared-types';

// Backend-specific types
export interface AuthenticatedRequest extends Request {
  user?: User;
}
