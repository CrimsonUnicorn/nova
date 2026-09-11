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
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <header className="border-b border-gray-800/80 bg-gray-950">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <h1 className="text-lg font-bold tracking-tight text-gray-100">
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
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-100 active:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="min-w-0 flex-1 bg-slate-950 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout