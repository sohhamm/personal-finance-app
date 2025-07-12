// Re-export shared types for frontend use
export * from '@personal-finance-app/shared-types';

// Frontend-specific types
export interface TableFilters {
  [key: string]: string[] | { id: string; name: string }[];
}