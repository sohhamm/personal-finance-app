import * as React from 'react'
import Button from '@/components/ui/button/Button'
import classes from './auth.module.css'
import {Link} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {useMutation} from '@tanstack/react-query'
import {z} from 'zod'
import {Eye, EyeSlash} from '@phosphor-icons/react'
import {InputField} from '@/components/ui/input-field/InputField'
import {LoginFormValues, loginSchema} from './schema'

const loginApi = async (credentials: LoginFormValues) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  if (credentials.email === 'error@example.com') {
    throw new Error('Invalid credentials')
  }
  return {success: true, user: {email: credentials.email}}
}

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false)

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      console.log('Login successful', data)
    },
    onError: error => {
      console.error('Login failed', error)
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({value}) => {
      await loginMutation.mutateAsync(value as LoginFormValues)
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <div className={classes.box}>
      <h1 className={'text-preset-1'}>Login</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <div className={classes.fields}>
          <form.Field
            name='email'
            validators={{
              onChange: loginSchema.shape.email,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: z.string().refine(
                async value => {
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  return !value.includes('error')
                },
                {
                  message: "Email cannot contain 'error'",
                },
              ),
            }}
          >
            {field => (
              <InputField field={field} label='Email' placeholder='Enter email' type='email' />
            )}
          </form.Field>
          <form.Field
            name='password'
            validators={{
              onChange: loginSchema.shape.password,
            }}
          >
            {field => (
              <InputField
                field={field}
                label='Password'
                placeholder='Enter password'
                type={showPassword ? 'text' : 'password'}
                icon={
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className={classes.eyeIcon}
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            )}
          </form.Field>
        </div>

        <Button type='submit' disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </Button>

        {loginMutation.isError && (
          <p className={classes.errorMessage}>
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : 'An error occurred during login'}
          </p>
        )}
      </form>
      <p className={classes.signupText}>
        Need to create an account? <Link to='/auth/sign-up'>Sign up</Link>
      </p>
    </div>
  )
}
