import Button from '@/components/ui/button/Button'
import classes from './auth.module.css'
import {Link, useNavigate} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {useMutation} from '@tanstack/react-query'
import {InputField} from '@/components/ui/input-field/InputField'
import {signupSchema} from './schema'
import {signUp} from '@/services/auth.service'

export default function Signup() {
  const navigate = useNavigate()

  const signupMutation = useMutation({
    mutationFn: signUp,
    onSuccess: data => {
      if (data) {
        navigate({to: '/overview'})
      }
    },
    onError: err => {
      console.error('Signup failed', err)
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
    validators: {
      onChange: signupSchema,
    },
  })

  return (
    <div className={classes.authForm}>
      <div className={classes.formHeader}>
        <h1 className='fin-text-preset-1'>Sign Up</h1>
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
          <form.Field name='name'>
            {field => <InputField field={field} label='Name' placeholder='' />}
          </form.Field>

          <form.Field name='email'>
            {field => <InputField field={field} label='Email' placeholder='' type='email' />}
          </form.Field>

          <form.Field name='password'>
            {field => (
              <InputField
                field={field}
                label='Create Password'
                placeholder=''
                type='password'
                showPasswordToggle={true}
                helperText='Passwords must be at least 8 characters'
              />
            )}
          </form.Field>
        </div>

        <Button
          type='submit'
          disabled={signupMutation.isPending}
          loading={signupMutation.isPending}
          fullWidth
        >
          Create Account
        </Button>

        {signupMutation.isError && (
          <p className={classes.errorMessage}>
            {signupMutation.error instanceof Error
              ? signupMutation.error.message
              : 'An error occurred during signup'}
          </p>
        )}
      </form>

      <div className={classes.footer}>
        <p className={classes.footerText}>
          Already have an account?{' '}
          <Link to='/auth/login' className={classes.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
