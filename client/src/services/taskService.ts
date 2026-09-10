import { apiRequest } from './api'

export interface Task {
  _id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  project: string
  assignedTo?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: 'todo' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  project: string
  assignedTo?: string
  dueDate?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: 'todo' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string | null
  dueDate?: string
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const response = await apiRequest<{ task: Task }>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.task
}

export async function getProjectTasks(
  projectId: string,
): Promise<Task[]> {
  const response = await apiRequest<{ tasks: Task[] }>(
    `/api/tasks/projects/${projectId}`,
  )

  return response.tasks
}

export async function getTaskById(taskId: string): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(
    `/api/tasks/${taskId}`,
  )

  return response.task
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskData,
): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(
    `/api/tasks/${taskId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  )

  return response.task
}

export async function deleteTask(taskId: string): Promise<void> {
  await apiRequest(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function assignTask(
  taskId: string,
  userId: string,
): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(
    `/api/tasks/${taskId}/assign`,
    {
      method: 'PUT',
      body: JSON.stringify({ userId }),
    },
  )

  return response.task
}