import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProject() {
      if (!id) {
        setError('Project ID is missing')
        setLoading(false)
        return
      }

      try {
        const data = await apiRequest<{ project: Project }>(
          `/api/projects/${id}`,
        )

        setProject(data.project)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load project',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadProject()
  }, [id])

  async function handleDelete() {
    if (!id) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this project?',
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError('')

      await apiRequest(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      navigate('/projects')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete project',
      )
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading project...
      </p>
    )
  }

  if (error || !project) {
    return (
      <div>
        <PageTitle
          title="Project Details"
          description="View project information."
        />

        <Card>
          <p className="text-sm text-red-600">
            {error || 'Project not found'}
          </p>

          <Link
            to="/projects"
            className="mt-4 inline-block text-sm font-medium underline"
          >
            Back to Projects
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageTitle
        title={project.name}
        description="View project details and manage this project."
      />

      <Card>
        <h2 className="text-lg font-semibold text-gray-900">
          Description
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {project.description || 'No description provided.'}
        </p>

        <div className="mt-6 space-y-2 text-sm text-gray-500">
          <p>
            Created:{' '}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>

          <p>
            Last updated:{' '}
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Link to="/projects">
            <Button type="button">
              Back to Projects
            </Button>
          </Link>

          <Button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ProjectDetails