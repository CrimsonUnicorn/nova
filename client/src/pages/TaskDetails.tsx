import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import Button from '../components/Button'
import { getTaskById, type Task } from '../services/taskService'
import {
  getTaskComments,
  createComment,
  deleteComment,
  type Comment,
} from '../services/commentService'
import { useAuth } from '../context/AuthContext'

function TaskDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [comments, setComments] = useState<Comment[]>([])
  const [commentError, setCommentError] = useState('')
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)

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

  useEffect(() => {
    if (!id) return

    const taskId = id

    async function loadComments() {
      try {
        setCommentsLoading(true)
        setCommentError('')

        const data = await getTaskComments(taskId)

        setComments(data)
      } catch (err) {
        setCommentError(
          err instanceof Error
            ? err.message
            : 'Failed to load comments',
        )
      } finally {
        setCommentsLoading(false)
      }
    }

    void loadComments()
  }, [id])

  async function handleAddComment(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!id || !commentContent.trim()) {
      return
    }

    try {
      setCommentSubmitting(true)
      setCommentError('')

      const newComment = await createComment(
        id,
        commentContent.trim(),
      )

      setComments((currentComments) => [
        ...currentComments,
        newComment,
      ])

      setCommentContent('')
    } catch (err) {
      setCommentError(
        err instanceof Error
          ? err.message
          : 'Failed to add comment',
      )
    } finally {
      setCommentSubmitting(false)
    }
  }
  async function handleDeleteComment(commentId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this comment?',
    )

    if (!confirmed) return

    try {
      setCommentError('')

      await deleteComment(commentId)

      setComments((currentComments) =>
        currentComments.filter(
          (comment) => comment._id !== commentId,
        ),
      )
    } catch (err) {
      setCommentError(
        err instanceof Error
          ? err.message
          : 'Failed to delete comment',
      )
    }
  }


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
      {/* Task Comments Section */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments
          </h2>

          <span className="text-sm text-gray-500">
            {comments.length}{' '}
            {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>
        {/* Add Comment Form */}
        <form
          onSubmit={handleAddComment}
          className="mb-6"
        >
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Add a comment
          </label>

          <textarea
            id="comment"
            value={commentContent}
            onChange={(event) =>
              setCommentContent(event.target.value)
            }
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={
                commentSubmitting || !commentContent.trim()
              }
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {commentSubmitting ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>

        {commentError && (
          <p className="mb-4 text-sm text-red-600">
            {commentError}
          </p>
        )}

        {commentsLoading ? (
          <p className="text-sm text-gray-500">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No comments yet.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-lg border border-gray-200 p-4"
              >

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(
                        comment.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>

                  {user?.id === comment.author._id && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteComment(comment._id)
                      }
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>


                <p className="mt-2 text-sm text-gray-700">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetails