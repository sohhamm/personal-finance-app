import {create} from 'zustand'
import {StorageService} from '@/services/storage.service'

interface AuthState {
  accessToken: string | undefined
  isAuthenticated: boolean
}

const useAuthStore = create<AuthState>(() => ({
  accessToken: StorageService.getAccessToken(),
  isAuthenticated: !!StorageService.getAccessToken(),
}))

// selectors
export const useAccessToken = () => useAuthStore(state => state.accessToken)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)

// actions
export const setAccessToken = (token: string | undefined) => {
  useAuthStore.setState(() => {
    if (token) {
      StorageService.setAccessToken(token)
      return {accessToken: token, isAuthenticated: true}
    } else {
      StorageService.removeAuthTokens()
      return {accessToken: undefined, isAuthenticated: false}
    }
  })
}

export const initializeAuth = () => {
  const token = StorageService.getAccessToken()
  useAuthStore.setState({accessToken: token, isAuthenticated: !!token})
}

export const logout = () => {
  StorageService.removeAuthTokens()
  useAuthStore.setState({accessToken: undefined, isAuthenticated: false})
}
