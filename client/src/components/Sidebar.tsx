import { NavLink } from 'react-router-dom'

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Profile', path: '/profile' },
  ]

  return (
    <aside className="w-20 shrink-0 border-r border-gray-800 bg-gray-950 md:w-64">
      <div className="flex h-full min-h-screen flex-col p-4 md:p-5">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            NOVA
          </h1>
          <p className="mt-1 hidden text-xs text-gray-500 md:block">
            Project workspace
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:justify-start ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`
              }
            >
              <span className="md:hidden">
                {item.label.charAt(0)}
              </span>

              <span className="hidden md:inline">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-gray-800 pt-4 md:block">
          <p className="px-2 text-xs text-gray-600">
            NOVA Workspace
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar