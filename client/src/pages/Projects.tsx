import { useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { apiRequest } from '../services/api'
import { Link } from 'react-router-dom'

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

    if (!name.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setCreating(true)
      setError('')

      const data = await apiRequest<{ project: Project }>(
        '/api/projects',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
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
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create project',
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <PageTitle
        title="Projects"
        description="Manage your projects and track their progress."
      />

      <Card>
        <h2 className="text-lg font-semibold text-gray-900">
          Create Project
        </h2>

        <form
          onSubmit={handleCreateProject}
          className="mt-4 space-y-4"
        >
          <div>
            <label
              htmlFor="project-name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Project name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Project description"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <Button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </Card>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6">
        {loading && (
          <p className="text-sm text-gray-500">
            Loading projects...
          </p>
        )}

        {!loading && projects.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500">
              No projects yet.
            </p>
          </Card>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project._id}>
                <Link
                  to={`/projects/${project._id}`}
                  className="text-lg font-semibold text-gray-900 hover:underline"
                >
                  {project.name}
                </Link>

                <p className="mt-2 text-sm text-gray-600">
                  {project.description || 'No description provided.'}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  Created{' '}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects