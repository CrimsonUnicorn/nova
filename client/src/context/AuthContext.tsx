import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  type AuthUser,
} from '../services/authService'

import { logout as clearAuth } from '../services/auth'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('nova_token')

    if (!token) {
      setLoading(false)
      return
    }

    getCurrentUser()
      .then((data) => {
        setUser(data.user)
      })
      .catch(() => {
        clearAuth()
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  function login(user: AuthUser, token: string) {
    localStorage.setItem('nova_token', token)
    setUser(user)
  }

  function logout() {
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider',
    )
  }

  return context
}