import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import type { SyntheticEvent } from 'react'

import {
  searchUsers,
  type SearchUser,
} from '../services/userService'

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
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState<SearchUser[]>([])
  const [searchingUsers, setSearchingUsers] = useState(false)

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

  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(
    null,
  )

  const [updateTaskError, setUpdateTaskError] = useState<{
    taskId: string
    message: string
  } | null>(null)

  const [assigningTaskId, setAssigningTaskId] = useState<string | null>(
    null,
  )

  const [assignTaskError, setAssignTaskError] = useState<{
    taskId: string
    message: string
  } | null>(null)

  const [progress, setProgress] = useState<ProjectProgress | null>(
    null,
  )
  const [progressLoading, setProgressLoading] = useState(true)
  const [progressError, setProgressError] = useState('')

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

  async function handleUserSearch(value: string) {
    setUserSearch(value)
    setUserId('')

    if (!value.trim()) {
      setUserResults([])
      return
    }

    try {
      setSearchingUsers(true)
      setMemberError('')

      const results = await searchUsers(value.trim())

      const filteredResults = results.filter(
        (user) =>
          user.id !== project?.owner &&
          !members.some((member) => member._id === user.id),
      )

      setUserResults(filteredResults)
    } catch (error) {
      setMemberError(
        error instanceof Error
          ? error.message
          : 'Failed to search users',
      )
      setUserResults([])
    } finally {
      setSearchingUsers(false)
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
      setUserSearch('')
      setUserResults([])
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

  async function handleCreateTask(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
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

      if (id) {
        const progressData = await getProjectProgress(id)
        setProgress(progressData)
      }
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
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-gray-500">
          Loading project...
        </p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageTitle
          title="Project Details"
          description="View project information."
        />

        <Card>
          <p className="text-sm text-red-400">
            {error || 'Project not found'}
          </p>

          <Link
            to="/projects"
            className="mt-4 inline-block text-sm font-medium text-gray-300 underline hover:text-white"
          >
            Back to Projects
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title={project.name}
        description="View project details and manage this project."
      />

      {/* Project information */}
      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white">
              Description
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              {project.description || 'No description provided.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
              <span>
                Created{' '}
                {new Date(project.createdAt).toLocaleDateString()}
              </span>

              <span>
                Updated{' '}
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link to="/projects">
              <Button type="button">
                Back to Projects
              </Button>
            </Link>

            <Button
              type="button"
              variant="danger"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </Card>

      {/* Project progress */}
      <div className="mt-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Project Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track completed tasks for this project.
            </p>
          </div>

          {!progressLoading && progress && (
            <span className="text-2xl font-semibold text-white">
              {progress.progress}%
            </span>
          )}
        </div>

        {progressLoading ? (
          <p className="mt-4 text-sm text-gray-500">
            Loading progress...
          </p>
        ) : progressError ? (
          <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
            {progressError}
          </p>
        ) : progress ? (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${progress.progress}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {progress.completedTasks} of {progress.totalTasks} tasks
              completed
            </p>
          </div>
        ) : null}
      </div>

      {/* Team members */}
      <Card className="mt-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Team Members
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add users to collaborate on this project.
          </p>
        </div>

        <form
          onSubmit={handleAddMember}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <input
              type="text"
              value={userSearch}
              onChange={(event) =>
                void handleUserSearch(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none placeholder:text-gray-600 transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

            {userSearch.trim() && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-xl">
                {searchingUsers ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    Searching...
                  </p>
                ) : userResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No users found.
                  </p>
                ) : (
                  userResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setUserId(user.id)
                        setUserSearch(user.name)
                        setUserResults([])
                      }}
                      className="block w-full border-b border-gray-800 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-800"
                    >
                      <p className="text-sm font-medium text-gray-200">
                        {user.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {user.email}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={memberLoading || !userId}
            className="sm:min-w-[120px]"
          >
            {memberLoading ? 'Adding...' : 'Add Member'}
          </Button>
        </form>

        {memberError && (
          <p className="mt-3 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
            {memberError}
          </p>
        )}

        <div className="mt-5 space-y-3">
          {membersLoading ? (
            <p className="text-sm text-gray-500">
              Loading team members...
            </p>
          ) : members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-800 p-6 text-center">
              <p className="text-sm text-gray-400">
                No team members yet.
              </p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200">
                    {member.name}
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
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

      {/* Create task */}
      <Card className="mt-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Create Task
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a new task to this project.
          </p>
        </div>

        <form
          onSubmit={handleCreateTask}
          className="space-y-5"
        >
          {createTaskError && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
              {createTaskError}
            </p>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Title
            </label>

            <input
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Enter task title"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none placeholder:text-gray-600 transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>

            <textarea
              value={taskDescription}
              onChange={(event) =>
                setTaskDescription(event.target.value)
              }
              placeholder="Enter task description"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none placeholder:text-gray-600 transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Priority
              </label>

              <select
                value={taskPriority}
                onChange={(event) =>
                  setTaskPriority(
                    event.target.value as
                      | 'low'
                      | 'medium'
                      | 'high',
                  )
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Due Date
              </label>

              <input
                type="date"
                value={taskDueDate}
                onChange={(event) => setTaskDueDate(event.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none placeholder:text-gray-600 transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>

          <Button type="submit" disabled={creatingTask}>
            {creatingTask ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </Card>

      {/* Task statistics */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Total Tasks</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {totalTasks}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">To Do</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {todoTasks}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">In Progress</p>

          <p className="mt-2 text-2xl font-semibold text-indigo-400">
            {inProgressTasks}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">Completed</p>

          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {completedTasks}
          </p>
        </Card>
      </div>

      {/* Tasks list */}
      <Card className="mt-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Tasks
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage tasks and track their progress.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-400">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {taskError && (
          <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/40 p-3">
            <p className="text-sm text-red-300">
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
              className="mt-2 text-sm font-medium text-red-400 underline transition-colors hover:text-red-300 disabled:opacity-50"
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
          <div className="rounded-lg border border-dashed border-gray-800 p-8 text-center">
            <p className="text-sm font-medium text-gray-400">
              No tasks yet.
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Create a task above to start working on this project.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-xl border border-gray-800 bg-gray-950 p-4 transition-colors hover:border-gray-700"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <Link to={`/tasks/${task._id}`}>
                      <h3 className="font-medium text-gray-200 transition-colors hover:text-white">
                        {task.title}
                      </h3>
                    </Link>

                    {task.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-500">
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
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-300 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
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
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-300 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  {task.dueDate && (
                    <span className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-500">
                      Due:{' '}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}

                  <select
                    value={task.assignedTo || ''}
                    disabled={assigningTaskId === task._id}
                    onChange={(event) =>
                      void handleAssignTask(
                        task._id,
                        event.target.value,
                      )
                    }
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-300 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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
                  <p className="mt-3 rounded-lg border border-red-900/50 bg-red-950/40 p-2 text-xs text-red-300">
                    {updateTaskError.message}
                  </p>
                )}

                {assignTaskError?.taskId === task._id && (
                  <p className="mt-3 rounded-lg border border-red-900/50 bg-red-950/40 p-2 text-xs text-red-300">
                    {assignTaskError.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ProjectDetails