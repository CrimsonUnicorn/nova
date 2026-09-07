import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AppLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }
  return (
    <div className="min-h-screen">
      <header>
        <h1>NOVA</h1>
      </header>

      <main>
        <Outlet />
      </main>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            {user.name}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Logout
        </button>
      </div>
    </div>

  )
}

export default AppLayout