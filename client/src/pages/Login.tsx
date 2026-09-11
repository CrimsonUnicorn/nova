import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setError('')
    setLoading(true)

    try {
      const data = await loginUser(trimmedEmail, password)

      login(data.user, data.token)

      navigate('/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800/80 bg-gray-900/80 p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-indigo-400">
            NOVA
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-100">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Login to continue to your workspace.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Your password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-3">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-400 active:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login