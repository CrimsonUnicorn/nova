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
            try {
              const progress = await getProjectProgress(project._id)

              return {
                ...project,
                progress: progress.progress,
                totalTasks: progress.totalTasks,
                completedTasks: progress.completedTasks,
              }
            } catch {
              return {
                ...project,
                progress: 0,
                totalTasks: 0,
                completedTasks: 0,
              }
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
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Dashboard"
        description="Overview of your team's productivity and projects."
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/40 p-4">
          <p className="text-sm text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-400 underline transition-colors hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Projects
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {loading ? '...' : totalProjects}
              </p>
            </div>

            <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">
              Projects
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Tasks
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {loading ? '...' : totalTasks}
              </p>
            </div>

            <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">
              Tasks
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {loading ? '...' : completedTasks}
              </p>
            </div>

            <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">
              Done
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Project Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track how your projects are moving forward.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-gray-500">
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-gray-800 p-8 text-center">
              <p className="text-sm text-gray-400">
                No projects yet.
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Create your first project to start tracking progress.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-800">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-200">
                        {project.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        {project.completedTasks} of{' '}
                        {project.totalTasks} tasks completed
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-medium text-gray-400">
                      {project.progress}%
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>
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