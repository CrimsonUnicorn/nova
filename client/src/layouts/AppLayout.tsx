import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="min-h-screen">
      <header>
        <h1>NOVA</h1>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout