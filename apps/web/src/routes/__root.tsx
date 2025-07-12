import {lazy, Suspense} from 'react'
import {createRootRouteWithContext, Outlet} from '@tanstack/react-router'
import type {QueryClient} from '@tanstack/react-query'

const RouterDevtools =
  import.meta.env.ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then(res => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      )

const QueryDevtools =
  import.meta.env.ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/react-query-devtools').then(res => ({
          default: res.ReactQueryDevtools,
        })),
      )

export const Route = createRootRouteWithContext<{
  isAuthenticated: boolean
  queryClient: QueryClient
}>()({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <RouterDevtools />
      </Suspense>
      <Suspense>
        <QueryDevtools />
      </Suspense>
    </>
  ),
})
