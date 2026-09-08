import PageTitle from '../components/PageTitle'
import Card from '../components/Card'

function Dashboard() {
  return (
    <div>
      <PageTitle
        title="Dashboard"
        description="Overview of your team's productivity and projects."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Team Members</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your recent projects will appear here.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Recent Tasks</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your recent tasks will appear here.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard