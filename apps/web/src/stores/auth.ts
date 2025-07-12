import {create} from 'zustand'
import {StorageService} from '@/services/storage.service'
import type { User } from '@personal-finance-app/shared-types'

interface AuthState {
  accessToken: string | undefined
  isAuthenticated: boolean
  user: User | undefined
  isInitialized: boolean
}

const useAuthStore = create<AuthState>(() => ({
  accessToken: StorageService.getAccessToken(),
  isAuthenticated: !!StorageService.getAccessToken(),
  user: undefined,
  isInitialized: false,
}))

// selectors
export const useAccessToken = () => useAuthStore(state => state.accessToken)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useUser = () => useAuthStore(state => state.user)
export const useIsInitialized = () => useAuthStore(state => state.isInitialized)

// actions
export const setAccessToken = (token: string | undefined) => {
  useAuthStore.setState(() => {
    if (token) {
      StorageService.setAccessToken(token)
      return {accessToken: token, isAuthenticated: true}
    }
    StorageService.removeAuthTokens()
    return {accessToken: undefined, isAuthenticated: false, user: undefined}
  })
}

export const setUser = (user: User | undefined) => {
  useAuthStore.setState({ user })
}

export const setAuthData = (token: string, user: User) => {
  StorageService.setAccessToken(token)
  useAuthStore.setState({
    accessToken: token,
    isAuthenticated: true,
    user
  })
}

export const initializeAuth = async () => {
  const token = StorageService.getAccessToken()
  
  if (token) {
    useAuthStore.setState({accessToken: token, isAuthenticated: true})
    // Try to load user profile
    try {
      const { AuthService } = await import('@/services/auth.service')
      const user = await AuthService.getProfile()
      useAuthStore.setState({ user })
    } catch (error) {
      // Token might be expired, clear it
      console.warn('Failed to load user profile, clearing token:', error)
      StorageService.removeAuthTokens()
      useAuthStore.setState({accessToken: undefined, isAuthenticated: false, user: undefined})
    }
  }
  
  useAuthStore.setState({ isInitialized: true })
}

export const logout = () => {
  StorageService.removeAuthTokens()
  useAuthStore.setState({
    accessToken: undefined, 
    isAuthenticated: false, 
    user: undefined
  })
}
