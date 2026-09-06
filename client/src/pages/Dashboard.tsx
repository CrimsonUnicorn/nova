import { useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import { getHealth } from '../services/api'

function Dashboard() {
  const [message, setMessage] = useState('Checking API...')
  const [error, setError] = useState('')

  useEffect(() => {
    getHealth()
      .then((data) => {
        setMessage(data.message)
      })
      .catch(() => {
        setError('Unable to connect to NOVA API.')
      })
  }, [])

  return (
    <div className="space-y-4">
      <PageTitle
        title="Dashboard"
        description="Welcome to NOVA."
      />

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-600">{message}</p>
      )}
    </div>
  )
}

export default Dashboard