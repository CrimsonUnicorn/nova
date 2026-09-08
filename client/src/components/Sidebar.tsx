import { NavLink } from 'react-router-dom'

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Profile', path: '/profile' },
  ]

  return (
    <aside className="w-20 border-r bg-white md:w-64">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-md px-2 py-2 text-center text-sm font-medium md:px-4 md:text-left ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
      </div>
    </aside>
  )
}

export default Sidebar