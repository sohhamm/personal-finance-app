import Login from '@/modules/auth/Login'
import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: Login,
})
