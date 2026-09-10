import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

function AppLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <h1 className="text-lg font-bold tracking-tight text-white">
              NOVA
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-gray-200">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  Team Member
                </p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="min-w-0 flex-1 bg-gray-950 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout