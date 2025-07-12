import SignUp from '@/modules/auth/SignUp'
import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUp,
})
