/**
 * Pot database entity
 */
export interface Pot {
  id: string;
  user_id: string;
  name: string;
  target: string; // Stored as string to maintain precision
  total: string; // Stored as string to maintain precision
  theme: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create pot request
 */
export interface CreatePotRequest {
  name: string;
  target: number;
  theme: string;
}

/**
 * Update pot request
 */
export interface UpdatePotRequest {
  name?: string;
  target?: number;
  theme?: string;
}

/**
 * Pot transaction request (add/withdraw money)
 */
export interface PotTransactionRequest {
  amount: number;
}

/**
 * Pot progress information
 */
export interface PotProgress {
  pot: Pot;
  progress: number; // Percentage (0-100)
  remaining: number; // Amount remaining to reach target
}