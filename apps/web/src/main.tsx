import './styles/_global.css'
import './styles/_variables.css'
import './styles/_typography.css'
import {ErrorComponent, RouterProvider, createRouter} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import {routeTree} from './routeTree.gen'
import {useIsAuthenticated, useIsInitialized, initializeAuth} from './stores/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    isAuthenticated: undefined!,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ({error}) => <ErrorComponent error={error} />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </StrictMode>,
  )
}

export function Router() {
  const isAuthenticated = useIsAuthenticated()
  const isInitialized = useIsInitialized()

  useEffect(() => {
    initializeAuth()
  }, [])

  // Show loading state while initializing authentication
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return <RouterProvider router={router} context={{isAuthenticated}} />
}
