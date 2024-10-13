import {apiClient} from '@/configs/api'
import {LoginFormValues, SignupFormValues} from '@/pages/auth/schema'
import {setAccessToken} from '@/stores/auth'

const commonAuthHelper = async ({
  payload,
  endpoint,
}: {
  payload: LoginFormValues | SignupFormValues
  endpoint: string
}) => {
  try {
    const response = await apiClient.post(endpoint, payload)
    const accessToken = response.data
    setAccessToken(accessToken)
    return accessToken
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const login = async (payload: LoginFormValues) => {
  return commonAuthHelper({payload, endpoint: '/auth/login'})
}

export const signUp = async (payload: SignupFormValues) => {
  return commonAuthHelper({payload, endpoint: '/auth/signup'})
}
