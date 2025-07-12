// Re-export shared auth types
export * from '@personal-finance-app/shared-types';

// Frontend-specific auth types (if any)
export interface StoredAuth {
  token: string | null;
}
