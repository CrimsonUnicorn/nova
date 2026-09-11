import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle
        title="Profile"
        description="View and manage your account."
      />

      <Card>
        <div className="space-y-7">
          <div className="flex items-center gap-4 border-b border-gray-800/80 pb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xl font-semibold text-indigo-400">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-gray-100">
                {user?.name || 'Not available'}
              </h2>

              <p className="mt-1 truncate text-sm text-gray-400">
                {user?.email || 'Not available'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Name
              </h2>

              <p className="mt-2 text-sm font-medium text-gray-200">
                {user?.name || 'Not available'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Email
              </h2>

              <p className="mt-2 break-all text-sm font-medium text-gray-200">
                {user?.email || 'Not available'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
              User ID
            </h2>

            <p className="mt-2 break-all font-mono text-sm text-gray-400">
              {user?.id || 'Not available'}
            </p>
          </div>

          <div className="border-t border-gray-800/80 pt-6">
            <h2 className="text-sm font-semibold text-gray-100">
              Account
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Manage your NOVA account session.
            </p>

            <div className="mt-4">
              <Button
                type="button"
                variant="danger"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Profile