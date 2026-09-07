const API_URL = import.meta.env.VITE_API_URL || ''

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || `API request failed: ${response.status}`)
  }

  return data as T
}

export interface HealthResponse {
  status: string
  message: string
}
export function getHealth() {
  return apiRequest<HealthResponse>('/api/health')
}