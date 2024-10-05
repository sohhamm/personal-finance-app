import {z} from 'zod'

const envSchema = z.object({
  apiBaseUrl: z.string().url(),
})

const envVars = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
}

const parsedEnv = envSchema.safeParse(envVars)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format())
  throw new Error('Invalid environment variables')
}

export const env = parsedEnv.data
