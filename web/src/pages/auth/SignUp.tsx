import * as React from 'react'
import Button from '@/components/ui/button/Button'
import classes from './auth.module.css'
import {Link} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {useMutation} from '@tanstack/react-query'
import {Eye, EyeSlash} from '@phosphor-icons/react'
import {InputField} from '@/components/ui/input-field/InputField'
import {signupSchema} from './schema'
import {setAccessToken} from '@/stores/auth'
import {signUp} from '@/services/auth.service'

export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false)

  const signupMutation = useMutation({
    mutationFn: signUp,
    onSuccess: data => {
      console.log('Signup successful', data)
      setAccessToken(data)
    },
    onError: error => {
      console.error('Signup failed', error)
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({value}) => {
      await signupMutation.mutateAsync(value)
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
