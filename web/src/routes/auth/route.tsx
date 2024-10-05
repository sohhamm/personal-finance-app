import AuthLayout from '@/layout/auth/AuthLayout'
import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({context: {isAuthenticated}}) => {
    console.log({isAuthenticated})
    if (isAuthenticated) {
      throw redirect({to: '/overview'})
    }
  },
  component: AuthLayout,
})
