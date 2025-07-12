import axios from 'axios'
import {env} from '@/configs/env'
import {logout} from '@/stores/auth'
import {StorageService} from '@/services/storage.service'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
})

apiClient.interceptors.request.use(
  config => {
    const accessToken = StorageService.getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => Promise.reject(error),
)

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access. Logging out.')
      logout()
    }
    return Promise.reject(error)
  },
)
