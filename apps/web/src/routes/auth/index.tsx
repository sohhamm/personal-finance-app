import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({beforeLoad: () => redirect({to: '/auth/login'})})
