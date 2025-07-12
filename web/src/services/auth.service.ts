import {apiClient} from '@/configs/api'
import {setAccessToken} from '@/stores/auth'
import type {LoginFormValues, SignupFormValues} from '@/modules/auth/schema'

const commonAuthHelper = async ({
  payload,
  endpoint,
}: {
  payload: LoginFormValues | SignupFormValues
  endpoint: string
}) => {
  try {
    const response = await apiClient.post(endpoint, payload)
    const authData = response.data.data // Extract the actual auth data from the wrapped response
    const accessToken = authData.token
    setAccessToken(accessToken)
    return authData
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const login = async (payload: LoginFormValues) => {
  return commonAuthHelper({payload, endpoint: '/api/auth/login'})
}

export const signUp = async (payload: SignupFormValues) => {
  return commonAuthHelper({payload, endpoint: '/api/auth/signup'})
}
