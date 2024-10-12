import * as React from 'react'
import Button from '@/components/ui/button/Button'
import classes from './auth.module.css'
import {Link} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {useMutation} from '@tanstack/react-query'
import {Eye, EyeSlash} from '@phosphor-icons/react'
import {InputField} from '@/components/ui/input-field/InputField'
import {SignupFormValues, signupSchema} from './schema'

const signupApi = async (userData: SignupFormValues) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  if (userData.email === 'taken@example.com') {
    throw new Error('Email is already taken')
  }
  return {success: true, user: {name: userData.name, email: userData.email}}
}

export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false)

  const signupMutation = useMutation({
    mutationFn: signupApi,
    onSuccess: data => {
      console.log('Signup successful', data)
      // Handle successful signup (e.g., redirect, set auth state)
    },
    onError: error => {
      console.error('Signup failed', error)
      // Handle signup error (e.g., show error message)
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({value}) => {
      await signupMutation.mutateAsync(value as SignupFormValues)
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <div className={classes.box}>
      <h1 className={'text-preset-1'}>Sign Up</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <div className={classes.fields}>
          <form.Field name='name' validators={{onChange: signupSchema.shape.name}}>
            {field => <InputField field={field} label='Name' placeholder='Enter your name' />}
          </form.Field>
          <form.Field name='email' validators={{onChange: signupSchema.shape.email}}>
            {field => (
              <InputField field={field} label='Email' placeholder='Enter your email' type='email' />
            )}
          </form.Field>
          <form.Field name='password' validators={{onChange: signupSchema.shape.password}}>
            {field => (
              <InputField
                field={field}
                label='Create Password'
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
                helperText='Passwords must be at least 8 characters'
              />
            )}
          </form.Field>
        </div>

        <Button type='submit' disabled={signupMutation.isPending}>
          {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>

        {signupMutation.isError && (
          <p className={classes.errorMessage}>
            {signupMutation.error instanceof Error
              ? signupMutation.error.message
              : 'An error occurred during signup'}
          </p>
        )}
      </form>
      <p className={classes.loginText}>
        Already have an account? <Link to='/auth/login'>Login</Link>
      </p>
    </div>
  )
}
