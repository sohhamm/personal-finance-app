import * as React from 'react'
import Button from '@/components/ui/button/Button'
import classes from './auth.module.css'
import {Link, useNavigate} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {useMutation} from '@tanstack/react-query'
import {z} from 'zod'
import {InputField} from '@/components/ui/input-field/InputField'
import {loginSchema} from './schema'
import {login} from '@/services/auth.service'

export default function Login() {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      if (data) {
        navigate({to: '/overview'})
      }
    },
    onError: err => {
      console.error('Login failed', err)
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({value}) => {
      await loginMutation.mutateAsync(value)
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <div className={classes.authForm}>
      <div className={classes.formHeader}>
        <h1 className="fin-text-preset-1">Login</h1>
      </div>
      
      <form
        className={classes.form}
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
                  await new Promise(resolve => setTimeout(resolve, 500))
                  return !value.includes('error')
                },
                {
                  message: "Email cannot contain 'error'",
                },
              ),
            }}
          >
            {field => (
              <InputField 
                field={field} 
                label='Email' 
                placeholder='' 
                type='email' 
              />
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
                placeholder=''
                type='password'
                showPasswordToggle={true}
              />
            )}
          </form.Field>
        </div>

        <Button 
          type='submit' 
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
          fullWidth
        >
          Login
        </Button>

        {loginMutation.isError && (
          <p className={classes.errorMessage}>
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : 'An error occurred during login'}
          </p>
        )}
      </form>
      
      <div className={classes.footer}>
        <p className={classes.footerText}>
          Need to create an account?{' '}
          <Link to='/auth/sign-up' className={classes.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}