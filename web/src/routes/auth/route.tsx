import AuthLayout from '@/layout/auth/AuthLayout'
import {logout} from '@/stores/auth'
import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({context: {isAuthenticated}, location: {pathname}}) => {
    if (pathname === '/auth/logout') {
      logout()
      throw redirect({to: '/auth/login'})
    }
    if (isAuthenticated) {
      throw redirect({to: '/overview'})
    }
  },
  component: AuthLayout,
})
