import { apiRequest } from './api'

export interface ProjectMember {
  _id: string
  name: string
  email: string
}

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMember[]> {
  return apiRequest<ProjectMember[]>(
    `/api/projects/${projectId}/members`,
  )
}

export async function addProjectMember(
  projectId: string,
  userId: string,
): Promise<void> {
  await apiRequest(`/api/projects/${projectId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  })
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<void> {
  await apiRequest(
    `/api/projects/${projectId}/members/${userId}`,
    {
      method: 'DELETE',
    },
  )
}