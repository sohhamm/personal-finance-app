/**
 * Budget database entity
 */
export interface Budget {
  id: string;
  user_id: string;
  category: string;
  maximum: string; // Stored as string to maintain precision
  theme: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create budget request
 */
export interface CreateBudgetRequest {
  category: string;
  maximum: number;
  theme: string;
}

/**
 * Update budget request
 */
export interface UpdateBudgetRequest {
  category?: string;
  maximum?: number;
  theme?: string;
}

/**
 * Budget with spending information
 */
export interface BudgetWithSpending {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  latestTransactions: any[]; // TODO: Type this properly
}