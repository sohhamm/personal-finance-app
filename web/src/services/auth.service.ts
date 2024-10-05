import {apiClient} from '@/configs/api'
import {setAccessToken, logout} from '@/stores/auth'

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/login', {email, password})
    const {accessToken} = response.data

    setAccessToken(accessToken)
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const refreshAccessToken = async () => {
  try {
    const response = await apiClient.post('/refresh')
    const {accessToken} = response.data

    setAccessToken(accessToken)
  } catch (error) {
    console.error('Unable to refresh access token:', error)
    logout()
  }
}
