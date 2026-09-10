import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user, logout } = useAuth()

  return (
    <div>
      <PageTitle
        title="Profile"
        description="View and manage your account."
      />

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              Name
            </h2>

            <p className="mt-1 text-lg font-medium text-gray-900">
              {user?.name || 'Not available'}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">
              Email
            </h2>

            <p className="mt-1 text-lg text-gray-900">
              {user?.email || 'Not available'}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">
              User ID
            </h2>

            <p className="mt-1 break-all text-sm text-gray-600">
              {user?.id || 'Not available'}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-sm font-medium text-gray-900">
              Account
            </h2>

            <p className="mt-1 text-sm text-gray-500">
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