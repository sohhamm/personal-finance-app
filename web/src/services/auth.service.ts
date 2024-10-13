import {apiClient} from '@/configs/api'
import {LoginFormValues, SignupFormValues} from '@/pages/auth/schema'
import {setAccessToken} from '@/stores/auth'
import {StorageService} from './storage.service'

export const login = async ({email, password}: LoginFormValues) => {
  try {
    const response = await apiClient.post('/login', {email, password})
    const accessToken = response.data
    setAccessToken(accessToken)
    StorageService.setAccessToken(accessToken)
    return accessToken
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const signUp = async ({name, email, password}: SignupFormValues) => {
  try {
    const response = await apiClient.post('/signup', {name, email, password})
    const accessToken = response.data
    StorageService.setAccessToken(accessToken)
    return accessToken
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}
