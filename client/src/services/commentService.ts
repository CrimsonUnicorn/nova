import { apiRequest } from './api'

export interface CommentAuthor {
    _id: string
    name: string
    email: string
}

export interface Comment {
    _id: string
    content: string
    task: string
    author: CommentAuthor
    createdAt: string
    updatedAt: string
}

export async function getTaskComments(
    taskId: string,
): Promise<Comment[]> {
    const response = await apiRequest<{ comments: Comment[] }>(
        `/api/tasks/${taskId}/comments`,
    )

    return response.comments
}

export async function createComment(
    taskId: string,
    content: string,
): Promise<Comment> {
    const response = await apiRequest<{ comment: Comment }>(
        `/api/tasks/${taskId}/comments`,
        {
            method: 'POST',
            body: JSON.stringify({
                content,
            }),
        },
    )

    return response.comment
}

export async function deleteComment(
    commentId: string,
): Promise<void> {
    await apiRequest(`/api/comments/${commentId}`, {
        method: 'DELETE',
    })
}