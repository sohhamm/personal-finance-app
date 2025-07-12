import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@/stores/auth'
import { AuthService } from '@/services/auth.service'

function OverviewPage() {
  const user = useUser()

  const handleLogout = () => {
    AuthService.logout()
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🎉 Welcome to your Personal Finance Dashboard!</h1>
      
      {user && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Hello, {user.name}! 👋</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3>🚀 End-to-End Authentication Complete!</h3>
        <ul>
          <li>✅ User authenticated successfully</li>
          <li>✅ Token persisted across page refreshes</li>
          <li>✅ User profile loaded and displayed</li>
          <li>✅ Protected routes working</li>
          <li>✅ Backend integration successful</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Page Refresh
        </button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/overview/')({
  component: OverviewPage,
})
