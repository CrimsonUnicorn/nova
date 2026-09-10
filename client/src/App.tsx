import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AppLayout from './layouts/AppLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import TaskDetails from './pages/TaskDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/tasks/:id"
              element={<TaskDetails />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App