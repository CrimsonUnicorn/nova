import { useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { apiRequest } from '../services/api'
import { getProjectProgress } from '../services/projectProgressService'

interface Project {
  _id: string
  name: string
  description?: string
}

interface DashboardProject extends Project {
  progress: number
  totalTasks: number
  completedTasks: number
}

function Dashboard() {
  const [projects, setProjects] = useState<DashboardProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const data = await apiRequest<{ projects: Project[] }>(
          '/api/projects',
        )

        const projectsWithProgress = await Promise.all(
          data.projects.map(async (project) => {
            const progress = await getProjectProgress(project._id)

            return {
              ...project,
              progress: progress.progress,
              totalTasks: progress.totalTasks,
              completedTasks: progress.completedTasks,
            }
          }),
        )

        setProjects(projectsWithProgress)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load dashboard',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const totalProjects = projects.length

  const totalTasks = projects.reduce(
    (total, project) => total + project.totalTasks,
    0,
  )

  const completedTasks = projects.reduce(
    (total, project) => total + project.completedTasks,
    0,
  )

  return (
    <div>
      <PageTitle
        title="Dashboard"
        description="Overview of your team's productivity and projects."
      />

      {error && (
        <p className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="mt-2 text-3xl font-bold">
            {loading ? '...' : totalProjects}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold">
            {loading ? '...' : totalTasks}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <p className="mt-2 text-3xl font-bold">
            {loading ? '...' : completedTasks}
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="text-lg font-semibold">
            Project Progress
          </h2>

          {loading ? (
            <p className="mt-4 text-sm text-gray-500">
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No projects yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <div key={project._id}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {project.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {project.progress}%
                    </p>
                  </div>

                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gray-900 transition-all"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {project.completedTasks} of {project.totalTasks}{' '}
                    tasks completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard