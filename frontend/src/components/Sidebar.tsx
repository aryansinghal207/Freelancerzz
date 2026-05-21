import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { LayoutDashboard, Users, Timer, FileText, FilePlus, BarChart3, Calendar, MessageCircle, TrendingUp } from 'lucide-react'

const Sidebar = () => {
  const auth = useAuth()
  const _location = useLocation()
  const isFreelancer = auth?.isFreelancer()
  const isClient = auth?.isClient()

  const _getIcon = (route) => {
    switch (route) {
      case '/clients': return Users
      case '/projects': return FileText
      case '/tasks': return LayoutDashboard
      case '/timer': return Timer
      case '/invoices': return FilePlus
      case '/reports': return BarChart3
      case '/calendar': return Calendar
      case '/client/dashboard': return LayoutDashboard
      case '/client/projects': return FileText
      case '/client/invoices': return FilePlus
      case '/client/messages': return MessageCircle
      case '/client/time-report': return TrendingUp
      default: return LayoutDashboard
    }
  }

  const getItems = () => {
    if (isFreelancer) {
      return [
        { href: '/clients', label: 'Clients', icon: Users },
        { href: '/projects', label: 'Projects', icon: FileText },
        { href: '/tasks', label: 'Tasks', icon: LayoutDashboard },
        { href: '/timer', label: 'Timer', icon: Timer },
        { href: '/invoices', label: 'Invoices', icon: FilePlus },
        { href: '/reports', label: 'Reports', icon: BarChart3 },
        { href: '/calendar', label: 'Calendar', icon: Calendar },
      ]
    }
    if (isClient) {
      return [
        { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/client/projects', label: 'Projects', icon: FileText },
        { href: '/client/invoices', label: 'Invoices', icon: FilePlus },
        { href: '/client/messages', label: 'Messages', icon: MessageCircle },
        { href: '/client/time-report', label: 'Time Report', icon: TrendingUp },
      ]
    }
    return []
  }

  return (
    <aside className="w-64 bg-dark-card border-r dark:border-dark-border">
      <div className="flex h-16 items-center px-4 border-b dark:border-dark-border">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-400" />
            </div>
          <span className="font-semibold text-dark-text">Freelancerzz</span>
        </div>
      </div>
      <nav className="mt-4 space-y-1">
        {getItems().map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `
              flex w-full items-center px-4 py-3 text-sm font-medium text-dark-muted hover:bg-dark-card/50 hover:text-dark-text transition-colors duration-200
              ${isActive ? 'bg-dark-card/50 text-dark-text border-r-2 border-primary-500' : ''}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar