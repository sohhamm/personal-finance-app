/**
 * User database entity
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Public user profile (without sensitive data)
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}