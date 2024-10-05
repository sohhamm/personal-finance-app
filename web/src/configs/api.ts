import axios from 'axios'
import {env} from '@/configs/env'
import {logout, useAccessToken, setAccessToken} from '@/stores/auth'
import {StorageService} from '@/services/storage.service'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
})

apiClient.interceptors.request.use(
  config => {
    const accessToken = useAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => Promise.reject(error),
)

//  Handle token refresh on 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      try {
        await refreshAccessToken()
        const newAccessToken = useAccessToken()

        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient.request(error.config)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        logout()
      }
    }
    return Promise.reject(error)
  },
)

const refreshAccessToken = async (): Promise<void> => {
  try {
    const refreshToken = StorageService.getRefreshToken()

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axios.post(`${env.apiBaseUrl}/refresh-token`, {
      refreshToken,
    })

    const {accessToken} = response.data

    if (accessToken) {
      setAccessToken(accessToken)
    } else {
      throw new Error('No access token received')
    }
  } catch (error) {
    console.error('Unable to refresh access token:', error)
    logout()
  }
}
