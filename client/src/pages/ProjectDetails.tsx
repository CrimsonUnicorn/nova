import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { apiRequest } from '../services/api'
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  type ProjectMember,
} from '../services/memberServices'

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

  const [members, setMembers] = useState<ProjectMember[]>([])
const [userId, setUserId] = useState('')
const [memberError, setMemberError] = useState('')
const [memberLoading, setMemberLoading] = useState(false)

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

useEffect(() => {
  if (!id) return

  const projectId = id

  async function loadMembers() {
    try {
      const data = await getProjectMembers(projectId)
      setMembers(data)
    } catch (err) {
      setMemberError(
        err instanceof Error
          ? err.message
          : 'Failed to load project members',
      )
    }
  }

  void loadMembers()
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

  async function handleAddMember(
  event: React.SyntheticEvent<HTMLFormElement>,
) {
  event.preventDefault()

  if (!id || !userId.trim()) return

  try {
    setMemberLoading(true)
    setMemberError('')

    await addProjectMember(id, userId.trim())

    const updatedMembers = await getProjectMembers(id)
    setMembers(updatedMembers)

    setUserId('')
  } catch (error) {
    setMemberError(
      error instanceof Error
        ? error.message
        : 'Failed to add project member',
    )
  } finally {
    setMemberLoading(false)
  }
}
  async function handleRemoveMember(userId: string) {
    if (!id) return

    const confirmed = window.confirm(
      'Are you sure you want to remove this member?',
    )

    if (!confirmed) return

    try {
      setMemberError('')

      await removeProjectMember(id, userId)

      const updatedMembers = await getProjectMembers(id)
      setMembers(updatedMembers)
    } catch (err) {
      setMemberError(
        err instanceof Error
          ? err.message
          : 'Failed to remove project member',
      )
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

      {/* Project information */}
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

       {/* Team members */}
      <Card className="mt-6">
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-gray-900">
      Team Members
    </h2>

    <p className="text-sm text-gray-500">
      Add users to collaborate on this project.
    </p>
  </div>

  <form
    onSubmit={handleAddMember}
    className="flex flex-col gap-3 sm:flex-row"
  >
    <input
      type="text"
      value={userId}
      onChange={(event) => setUserId(event.target.value)}
      placeholder="Enter user ID"
      className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
    />

    <Button type="submit" disabled={memberLoading}>
      {memberLoading ? 'Adding...' : 'Add Member'}
    </Button>
  </form>

  {memberError && (
    <p className="mt-3 text-sm text-red-600">
      {memberError}
    </p>
  )}

  <div className="mt-6 space-y-3">
    {members.length === 0 ? (
      <p className="text-sm text-gray-500">
        No team members yet.
      </p>
    ) : (
      members.map((member) => (
  <div
    key={member._id}
    className="flex items-center justify-between rounded-md border p-3"
  >
    <div>
      <p className="text-sm font-medium text-gray-900">
        {member.name}
      </p>

      <p className="text-sm text-gray-500">
        {member.email}
      </p>
    </div>

    <Button
      type="button"
      variant="danger"
      onClick={() => handleRemoveMember(member._id)}
    >
      Remove
    </Button>
  </div>
))
    )}
  </div>
</Card>
    </div>
  )
}

export default ProjectDetails