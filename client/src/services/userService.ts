import { apiRequest } from './api'

export interface SearchUser {
  id: string
  name: string
  email: string
}

interface SearchUsersResponse {
  users: SearchUser[]
}

export async function searchUsers(
  search: string,
): Promise<SearchUser[]> {
  const data = await apiRequest<SearchUsersResponse>(
    `/api/users?search=${encodeURIComponent(search)}`,
  )

  return data.users
}