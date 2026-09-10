import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import type { SyntheticEvent } from 'react'

import { apiRequest } from '../services/api'
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  type ProjectMember,
} from '../services/memberServices'
import {
  assignTask,
  createTask,
  getProjectTasks,
  updateTask,
  type Task,
} from '../services/taskService'
import {
  getProjectProgress,
  type ProjectProgress,
} from '../services/projectProgressService'

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
  const [membersLoading, setMembersLoading] = useState(true)

  const [tasks, setTasks] = useState<Task[]>([])
  const [taskError, setTaskError] = useState('')
  const [tasksLoading, setTasksLoading] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskPriority, setTaskPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [creatingTask, setCreatingTask] = useState(false)
  const [createTaskError, setCreateTaskError] = useState('')
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [updateTaskError, setUpdateTaskError] = useState<{
    taskId: string
    message: string
  } | null>(null)
  const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null)
  const [assignTaskError, setAssignTaskError] = useState<{
    taskId: string
    message: string
  } | null>(null)

  const [progress, setProgress] = useState<ProjectProgress | null>(null)
  const [progressLoading, setProgressLoading] = useState(true)
  const [progressError, setProgressError] = useState('')

  {/* loads the project */ }
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
  {/* loads team members */ }
  useEffect(() => {
    if (!id) return

    const projectId = id

    async function loadMembers() {
      try {
        setMembersLoading(true)
        setMemberError('')

        const data = await getProjectMembers(projectId)

        setMembers(data)
      } catch (err) {
        setMemberError(
          err instanceof Error
            ? err.message
            : 'Failed to load project members',
        )
      } finally {
        setMembersLoading(false)
      }
    }

    void loadMembers()
  }, [id])
  {/* loads tasks */ }
  useEffect(() => {
    if (!id) return

    void refreshTasks(id)
  }, [id])

  useEffect(() => {
    if (!id) {
      setProgressLoading(false)
      return
    }

    const projectId = id

    async function loadProgress() {
      try {
        setProgressLoading(true)
        setProgressError('')

        const data = await getProjectProgress(projectId)

        setProgress(data)
      } catch (err) {
        setProgressError(
          err instanceof Error
            ? err.message
            : 'Failed to load project progress',
        )
      } finally {
        setProgressLoading(false)
      }
    }

    void loadProgress()
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

  async function refreshTasks(projectId: string) {
    try {
      setTasksLoading(true)
      setTaskError('')

      const updatedTasks = await getProjectTasks(projectId)

      setTasks(updatedTasks)
    } catch (err) {
      setTaskError(
        err instanceof Error
          ? err.message
          : 'Failed to load project tasks',
      )
    } finally {
      setTasksLoading(false)
    }
  }

  async function handleCreateTask(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!id) return

    const trimmedTitle = taskTitle.trim()

    if (!trimmedTitle) {
      setCreateTaskError('Task title is required.')
      return
    }

    if (taskDueDate) {
      const selectedDate = new Date(taskDueDate)
      const today = new Date()

      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        setCreateTaskError('Due date cannot be in the past.')
        return
      }
    }

    try {
      setCreatingTask(true)
      setCreateTaskError('')

      await createTask({
        title: trimmedTitle,
        description: taskDescription || undefined,
        priority: taskPriority,
        project: id,
        dueDate: taskDueDate || undefined,
      })

      setTaskTitle('')
      setTaskDescription('')
      setTaskPriority('medium')
      setTaskDueDate('')

      await refreshTasks(id)
    } catch (err) {
      setCreateTaskError(
        err instanceof Error
          ? err.message
          : 'Failed to create task',
      )
    } finally {
      setCreatingTask(false)
    }
  }
  async function handleUpdateTask(
    taskId: string,
    data: {
      status?: 'todo' | 'in-progress' | 'completed'
      priority?: 'low' | 'medium' | 'high'
    },
  ) {
    try {
      setUpdatingTaskId(taskId)
      setUpdateTaskError(null)

      const updatedTask = await updateTask(taskId, data)

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task,
        ),
      )
    } catch (err) {
      setUpdateTaskError({
        taskId,
        message:
          err instanceof Error
            ? err.message
            : 'Failed to update task',
      })
    } finally {
      setUpdatingTaskId(null)
    }
  }

  async function handleAssignTask(
    taskId: string,
    memberId: string,
  ) {
    if (!memberId) return

    try {
      setAssigningTaskId(taskId)
      setAssignTaskError(null)

      const updatedTask = await assignTask(taskId, memberId)

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task,
        ),
      )
    } catch (err) {
      setAssignTaskError({
        taskId,
        message:
          err instanceof Error
            ? err.message
            : 'Failed to assign task',
      })
    } finally {
      setAssigningTaskId(null)
    }
  }

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed',
  ).length

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress',
  ).length

  const todoTasks = tasks.filter(
    (task) => task.status === 'todo',
  ).length

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
            variant='danger'
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </div>
      </Card>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Project Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track completed tasks for this project.
            </p>
          </div>

          {!progressLoading && progress && (
            <span className="text-2xl font-bold text-gray-900">
              {progress.progress}%
            </span>
          )}
        </div>
        {/* Progress bar and task count */}
        {progressLoading ? (
          <p className="mt-4 text-sm text-gray-500">
            Loading progress...
          </p>
        ) : progressError ? (
          <p className="mt-4 text-sm text-red-600">
            {progressError}
          </p>
        ) : progress ? (
          <div className="mt-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gray-900 transition-all"
                style={{ width: `${progress.progress}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              {progress.completedTasks} of {progress.totalTasks} tasks
              completed
            </p>
          </div>
        ) : null}
      </div>

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
          {membersLoading ? (
            <p className="text-sm text-gray-500">
              Loading team members...
            </p>
          ) : members.length === 0 ? (
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

      {/* Create task form */}
      <form
        onSubmit={handleCreateTask}
        className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <h3 className="mb-4 font-medium text-gray-900">
          Create Task
        </h3>

        {createTaskError && (
          <p className="mb-3 text-sm text-red-600">
            {createTaskError}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Enter task title"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
              placeholder="Enter task description"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                value={taskPriority}
                onChange={(event) =>
                  setTaskPriority(
                    event.target.value as 'low' | 'medium' | 'high',
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Due Date
              </label>

              <input
                type="date"
                value={taskDueDate}
                onChange={(event) => setTaskDueDate(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creatingTask}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingTask ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>

      {/* Task statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {totalTasks}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">To Do</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {todoTasks}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {inProgressTasks}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Tasks list */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Tasks
          </h2>

          <span className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {taskError && (
          <div className="mb-4 rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">
              {taskError}
            </p>

            <button
              type="button"
              onClick={() => {
                if (id) {
                  void refreshTasks(id)
                }
              }}
              disabled={tasksLoading}
              className="mt-2 text-sm font-medium text-red-700 underline disabled:opacity-50"
            >
              {tasksLoading ? 'Retrying...' : 'Try again'}
            </button>
          </div>
        )}

        {tasksLoading ? (
          <p className="text-sm text-gray-500">
            Loading tasks...
          </p>
        ) : tasks.length === 0 && !taskError ? (
          <p className="text-sm text-gray-500">
            No tasks yet.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/tasks/${task._id}`}>
                      <h3 className="font-medium text-gray-900 hover:underline">
                        {task.title}
                      </h3>
                    </Link>

                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <select
                    value={task.status}
                    disabled={updatingTaskId === task._id}
                    onChange={(event) =>
                      void handleUpdateTask(task._id, {
                        status: event.target.value as
                          | 'todo'
                          | 'in-progress'
                          | 'completed',
                      })
                    }
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <select
                    value={task.priority}
                    disabled={updatingTaskId === task._id}
                    onChange={(event) =>
                      void handleUpdateTask(task._id, {
                        priority: event.target.value as
                          | 'low'
                          | 'medium'
                          | 'high',
                      })
                    }
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}

                  <select
                    value={task.assignedTo || ''}
                    disabled={assigningTaskId === task._id}
                    onChange={(event) =>
                      void handleAssignTask(task._id, event.target.value)
                    }
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="">Assign to...</option>

                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                {updateTaskError?.taskId === task._id && (
                  <p className="mt-2 text-xs text-red-600">
                    {updateTaskError.message}
                  </p>
                )}

                {assignTaskError?.taskId === task._id && (
                  <p className="mt-2 text-xs text-red-600">
                    {assignTaskError.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  )
}

export default ProjectDetails