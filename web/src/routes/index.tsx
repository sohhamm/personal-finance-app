import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad({context}) {
    if (context.isAuthenticated) {
      throw redirect({to: '/overview'})
    }
    throw redirect({to: '/auth/login'})
  },
})
