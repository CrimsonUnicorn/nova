const API_URL = import.meta.env.VITE_API_URL || ''

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem('nova_token')

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {}),
        ...options?.headers,
      },
    })

    let data: { message?: string }

    try {
      data = await response.json()
    } catch {
      throw new Error(
        response.ok
          ? 'Invalid response from server'
          : `Server error: ${response.status}`,
      )
    }

    if (!response.ok) {
      throw new Error(
        data.message || `API request failed: ${response.status}`,
      )
    }

    return data as T
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        'Unable to connect to the server. Please try again.',
      )
    }

    throw err
  }
}
export interface HealthResponse {
  status: string
  message: string
}
export function getHealth() {
  return apiRequest<HealthResponse>('/api/health')
}