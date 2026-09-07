const TOKEN_KEY = 'nova_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}