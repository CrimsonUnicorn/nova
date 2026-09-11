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
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  )

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

    if (!id) return

    const trimmedComment = commentContent.trim()

    if (!trimmedComment) {
      setCommentError('Comment cannot be empty.')
      return
    }

    try {
      setCommentSubmitting(true)
      setCommentError('')

      const newComment = await createComment(
        id,
        trimmedComment,
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
      setDeletingCommentId(commentId)
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
    } finally {
      setDeletingCommentId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-gray-500">
          Loading task...
        </p>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageTitle
          title="Task Details"
          description="View task information."
        />

        <Card>
          <p className="text-sm text-red-300">
            {error || 'Task not found'}
          </p>

          {error && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-400 underline transition-colors hover:text-red-300"
            >
              Try again
            </button>
          )}

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
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title={task.title}
        description="View task details."
      />

      <Card>
        <div className="space-y-7">
          <div>
            <h2 className="text-sm font-medium text-gray-400">
              Description
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-300">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </h2>

              <p className="mt-2 capitalize text-gray-200">
                {task.status}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Priority
              </h2>

              <p className="mt-2 capitalize text-gray-200">
                {task.priority}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Due Date
              </h2>

              <p className="mt-2 text-gray-200">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : 'No due date'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/80 bg-gray-950 p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Assigned To
              </h2>

              <p className="mt-2 text-gray-200">
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

      <Card className="mt-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">
              Comments
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Discuss this task with your team.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-400">
            {comments.length}{' '}
            {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <form
          onSubmit={handleAddComment}
          className="mb-6"
        >
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-gray-300"
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
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={
                commentSubmitting || !commentContent.trim()
              }
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-400 active:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {commentSubmitting ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>

        {commentError && (
          <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/40 p-3">
            <p className="text-sm text-red-300">
              {commentError}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-400 underline transition-colors hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}

        {commentsLoading ? (
          <p className="text-sm text-gray-500">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-800 p-8 text-center">
            <p className="text-sm font-medium text-gray-400">
              No comments yet.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Start the conversation about this task.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-xl border border-gray-800/80 bg-gray-950 p-4 transition-colors hover:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200">
                      {comment.author.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        comment.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>

                  {user?.id === comment.author._id && (
                    <button
                      type="button"
                      disabled={
                        deletingCommentId === comment._id
                      }
                      onClick={() =>
                        handleDeleteComment(comment._id)
                      }
                      className="shrink-0 text-xs font-medium text-red-400 transition-colors hover:text-red-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingCommentId === comment._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default TaskDetails