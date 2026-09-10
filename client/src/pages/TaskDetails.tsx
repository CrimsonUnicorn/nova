import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { getTaskById, type Task } from '../services/taskService'

function TaskDetails() {
  const { id } = useParams()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('Task ID is missing')
      setLoading(false)
      return
    }

    const taskId = id

    async function loadTask() {
      try {
        const data = await getTaskById(taskId)
        setTask(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load task',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadTask()
  }, [id])

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading task...
      </p>
    )
  }

  if (error || !task) {
    return (
      <div>
        <PageTitle
          title="Task Details"
          description="View task information."
        />

        <Card>
          <p className="text-sm text-red-600">
            {error || 'Task not found'}
          </p>

          <Link
            to="/projects"
            className="mt-4 inline-block"
          >
            <Button type="button">
              Back to Projects
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageTitle
        title={task.title}
        description="View task details."
      />

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              Description
            </h2>

            <p className="mt-2 text-gray-900">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Status
              </h2>

              <p className="mt-1 capitalize text-gray-900">
                {task.status}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Priority
              </h2>

              <p className="mt-1 capitalize text-gray-900">
                {task.priority}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Due Date
              </h2>

              <p className="mt-1 text-gray-900">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : 'No due date'}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Assigned To
              </h2>

              <p className="mt-1 text-gray-900">
                {task.assignedTo || 'Not assigned'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to={`/projects/${task.project}`}>
              <Button type="button">
                Back to Project
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TaskDetails