import { apiRequest } from './api'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  message: string
  token: string
  user: AuthUser
}

export interface RegisterResponse {
  message: string
  user: AuthUser
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}