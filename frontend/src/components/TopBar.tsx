import { Menu, X } from 'lucide-react'
import { useAuth } from '../AuthContext'
import { NavLink, useLocation } from 'react-router-dom'

const TopBar = ({ title, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const auth = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    auth.logout()
  }

  // Get page title from location or use provided title
  const pageTitle = title || location.pathname
    .split('/')
    .filter(Boolean)
    .map(segment => 
      segment
        .replace(/^[a-z]/, c => c.toUpperCase())
        .replace(/[A-Z]/, c => ` ${c}`)
        .trim()
    )
    .join(' ') || 'Dashboard'

  return (
    <header className="bg-dark-card border-b dark:border-dark-border sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="lg:hidden p-2 rounded-md hover:bg-dark-card/50 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? <Menu className="w-5 h-5 text-dark-text" /> : <X className="w-5 h-5 text-dark-text" />}
        </button>

        {/* Page title */}
        <div className="hidden lg:block flex-1 text-center">
          <h1 className="text-lg font-semibold text-dark-text">{pageTitle}</h1>
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-4">
          {auth?.user ? (
            <>
              <div className="relative">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  {(auth.user.name || auth.user.email).slice(0,1).toUpperCase()}
                </div>
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-500 rounded-full ring-2 ring-dark-bg"></div>
              </div>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm text-dark-text">{auth.user.name || auth.user.email}</span>
                <span className="text-xs text-dark-muted">{auth.user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="lg:hidden p-2 rounded-md hover:bg-dark-card/50 transition-colors"
                aria-label="Logout"
              >
                <svg className="w-5 h-5 text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">Login</NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar