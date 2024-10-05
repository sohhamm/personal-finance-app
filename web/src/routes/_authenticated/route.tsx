import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context: { isAuthenticated } }) => {
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }
  },
  component: () => <div>Hello /authenticated/!</div>,
})
