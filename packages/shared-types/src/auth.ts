import type { User } from './user';

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Signup request payload
 */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  expiresIn: string;
}

/**
 * Frontend auth state (stored in localStorage/zustand)
 */
export interface AuthState {
  token: string | null;
  user: Omit<User, 'password_hash'> | null;
  isAuthenticated: boolean;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}