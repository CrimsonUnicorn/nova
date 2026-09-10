import { apiRequest } from './api'

export interface ProjectProgress {
  progress: number
  totalTasks: number
  completedTasks: number
}

export async function getProjectProgress(
  projectId: string,
): Promise<ProjectProgress> {
  const response = await apiRequest<ProjectProgress>(
    `/api/projects/${projectId}/progress`,
  )

  return response
}