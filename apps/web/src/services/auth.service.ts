import { apiClient } from '@/configs/api';
import { setAuthData, logout as logoutStore } from '@/stores/auth';
import type { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse,
  ApiResponse 
} from '@personal-finance-app/shared-types';
import type { LoginFormValues, SignupFormValues } from '@/modules/auth/schema';

const routeFactory = (path?: string) => {
  return `/api/auth${path ? '/' + path : ''}`;
};

const commonAuthHelper = async ({
  payload,
  endpoint,
}: {
  payload: LoginRequest | SignupRequest;
  endpoint: string;
}): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(endpoint, payload);
    const authData = response.data.data!;
    
    // Store both token and user data
    setAuthData(authData.token, authData.user);
    
    return authData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export class AuthService {
  static async login(payload: LoginFormValues): Promise<AuthResponse> {
    return commonAuthHelper({
      payload: payload as LoginRequest,
      endpoint: routeFactory('login'),
    });
  }

  static async signup(payload: SignupFormValues): Promise<AuthResponse> {
    return commonAuthHelper({
      payload: payload as SignupRequest,
      endpoint: routeFactory('signup'),
    });
  }

  static async getProfile(): Promise<AuthResponse['user']> {
    const response = await apiClient.get<ApiResponse<AuthResponse['user']>>(
      routeFactory('profile')
    );
    return response.data.data!;
  }

  static async logout(): Promise<void> {
    // Clear local storage and state
    logoutStore();
  }
}

// Export legacy functions for backward compatibility
export const login = AuthService.login;
export const signUp = AuthService.signup;
