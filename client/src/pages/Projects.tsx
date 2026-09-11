import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { apiRequest } from '../services/api'

interface Project {
  _id: string
  name: string
  description?: string
  owner: string
  createdAt: string
  updatedAt: string
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [createError, setCreateError] = useState('')

  async function loadProjects() {
    try {
      setError('')

      const data = await apiRequest<{ projects: Project[] }>(
        '/api/projects',
      )

      setProjects(data.projects)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load projects',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProjects()
  }, [])

  async function handleCreateProject(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Project name is required')
      return
    }

    if (trimmedName.length > 100) {
      setError('Project name must be 100 characters or less')
      return
    }

    try {
      setCreating(true)
      setCreateError('')

      const data = await apiRequest<{ project: Project }>(
        '/api/projects',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: trimmedName,
            description: description.trim(),
          }),
        },
      )

      setProjects((currentProjects) => [
        data.project,
        ...currentProjects,
      ])

      setName('')
      setDescription('')
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : 'Failed to create project',
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Projects"
        description="Manage your projects and track their progress."
      />

      <Card>
        <div>
          <h2 className="text-lg font-semibold text-gray-100">
            Create Project
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Start a new workspace for your team.
          </p>
        </div>

        <form
          onSubmit={handleCreateProject}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="project-name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What is this project about?"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {createError && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2.5">
              <p className="text-sm text-red-300">
                {createError}
              </p>
            </div>
          )}

          <Button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="mt-5 rounded-xl border border-red-900/50 bg-red-950/40 p-4">
          <p className="text-sm text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => {
              setLoading(true)
              void loadProjects()
            }}
            disabled={loading}
            className="mt-2 text-sm font-medium text-red-400 underline transition-colors hover:text-red-300 disabled:opacity-50"
          >
            {loading ? 'Retrying...' : 'Try again'}
          </button>
        </div>
      )}

      <div className="mt-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-100">
            Your Projects
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {projects.length} project
            {projects.length === 1 ? '' : 's'} in your workspace
          </p>
        </div>

        {loading && (
          <Card>
            <p className="text-sm text-gray-500">
              Loading projects...
            </p>
          </Card>
        )}

        {!loading && projects.length === 0 && (
          <Card>
            <div className="py-6 text-center">
              <p className="text-sm font-medium text-gray-300">
                No projects yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create your first project above to get started.
              </p>
            </div>
          </Card>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project._id}>
                <Link
                  to={`/projects/${project._id}`}
                  className="group block"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-gray-200 transition-colors group-hover:text-gray-100">
                        {project.name}
                      </h3>

                      <div className="mt-2 h-1 w-10 rounded-full bg-indigo-500 transition-all duration-200 group-hover:w-14" />
                    </div>

                    <span className="text-gray-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-indigo-400">
                      →
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                    {project.description ||
                      'No description provided.'}
                  </p>

                  <div className="mt-6 border-t border-gray-800/80 pt-4">
                    <p className="text-xs text-gray-500">
                      Created{' '}
                      {new Date(
                        project.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects