import { Menu, X } from 'lucide-react'
import { useAuth } from '../AuthContext'
import { NavLink, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'

const TopBar = ({ title, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const auth = useAuth()
  const location = useLocation()
  
  const handleLogout = () => {
  auth.logout()
      window.location.href = '/'
}

  const pageTitle =
    title ||
    location.pathname
      .split('/')
      .filter(Boolean)
      .map((segment) =>
        segment
          .replace(/^[a-z]/, (c) => c.toUpperCase())
          .replace(/[A-Z]/, (c) => ` ${c}`)
          .trim()
      )
      .join(' ') ||
    'Dashboard'

  return (
    <header className="bg-dark-card border-b dark:border-dark-border sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="lg:hidden p-2 rounded-md hover:bg-dark-card/50 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? (
            <Menu className="w-5 h-5 text-dark-text" />
          ) : (
            <X className="w-5 h-5 text-dark-text" />
          )}
        </button>

        {/* Page title */}
        <div className="hidden lg:block flex-1 text-center">
          <h1 className="text-lg font-semibold text-dark-text">
            {pageTitle}
          </h1>
        </div>

        {/* User section */}
        <div className="flex items-center gap-4">
          {auth?.user ? (
            <div className="flex items-center gap-3">

              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center text-dark-text font-semibold">
                  {(auth.user.name || auth.user.email)
                    .slice(0, 1)
                    .toUpperCase()}
                </div>

                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-card"></div>
              </div>

              {/* User info */}
              <div className="hidden md:flex flex-col">
                <span className="text-sm text-dark-text font-medium">
                  {auth.user.name || auth.user.email}
                </span>

                <span className="text-xs text-dark-muted capitalize">
                  {auth.user.role}
                </span>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="whitespace-nowrap"
              >
                Logout
              </Button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar