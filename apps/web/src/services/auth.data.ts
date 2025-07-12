import {useQuery} from '@tanstack/react-query'
import {apiClient} from '@/configs/api'
import {queryKeys} from './query-key-factory'
import {useMutate} from './hooks/useMutate'
import {LoginFormValues, SignupFormValues} from '@/modules/auth/schema'
import {setAccessToken} from '@/stores/auth'
import {ApiResponse} from '@/types/api'

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
  }
  token: string
  expiresIn: string
}

interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

const routeFactory = (path?: string) => {
  return `/api/auth${path ? '/' + path : ''}`
}

class AuthService {
  async login(payload: LoginFormValues): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(routeFactory('login'), payload)
    return response.data.data!
  }

  async signup(payload: SignupFormValues): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      routeFactory('signup'),
      payload,
    )
    return response.data.data!
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(routeFactory('profile'))
    return response.data.data!
  }
}

const svc = new AuthService()

// Queries
export const useGetProfile = () => {
  const res = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => svc.getProfile(),
  })

  return {
    user: res.data,
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

// Mutations
export const useLogin = () => {
  return useMutate<AuthResponse, LoginFormValues>(
    async payload => {
      const authData = await svc.login(payload)
      setAccessToken(authData.token)
      return authData
    },
    [queryKeys.auth.profile()],
    {
      successMessage: 'Login successful',
      errorMessage: 'Login failed',
    },
  )
}

export const useSignup = () => {
  return useMutate<AuthResponse, SignupFormValues>(
    async payload => {
      const authData = await svc.signup(payload)
      setAccessToken(authData.token)
      return authData
    },
    [queryKeys.auth.profile()],
    {
      successMessage: 'Account created successfully',
      errorMessage: 'Failed to create account',
    },
  )
}
