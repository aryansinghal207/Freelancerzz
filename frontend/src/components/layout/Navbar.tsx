import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../../AuthContext'
import Button from '../ui/Button'

interface NavbarProps {
  freelancerLinks?: Array<{ to: string; label: string }>
  clientLinks?: Array<{ to: string; label: string }>
}

export const Navbar: React.FC<NavbarProps> = ({
  freelancerLinks = [
    { to: '/clients', label: 'Clients' },
    { to: '/tasks', label: 'Tasks' },
    { to: '/timer', label: 'Timer' },
    { to: '/invoices', label: 'Invoices' },
    { to: '/reports', label: 'Reports' },
    { to: '/calendar', label: 'Calendar' },
  ],
  clientLinks = [
    { to: '/client/dashboard', label: 'Dashboard' },
    { to: '/client/projects', label: 'Projects' },
    { to: '/client/messages', label: 'Messages' },
    { to: '/client/invoices', label: 'Invoices' },
    { to: '/client/time-report', label: 'Time Report' },
  ],
}) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const _isFreelancer = auth?.isFreelancer()
  const isClient = auth?.isClient()
  const links = isClient ? clientLinks : freelancerLinks

  const handleLogout = () => {
    auth.logout()
    window.location.href = '/'
  }

  const getInitials = () => {
    const name = auth?.user?.name || auth?.user?.email || ''
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 glass border-b border-white/10 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center font-bold text-white text-lg">
            F
          </div>
          <NavLink to={auth?.user ? (isClient ? '/client/dashboard' : '/clients') : '/'} className="text-xl font-bold text-gradient-primary hover:text-primary-400 transition-colors">
            Freelancerzz
          </NavLink>
        </motion.div>

        {/* Desktop Navigation */}
        {auth?.user && (
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                      : 'text-dark-text hover:text-primary-400 hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {auth?.user ? (
            <>
              {/* User Profile */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg glass-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-xs text-white">
                  {getInitials()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{auth.user.name || auth.user.email}</span>
                  <span className="text-xs text-dark-muted capitalize">
                    {auth.user.role}
                  </span>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden btn-ghost p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                className="hidden md:flex btn-secondary gap-2 px-4 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </motion.button>
            </>
          ) : (
            <NavLink to="/login">
              <Button size="sm">Login</Button>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {auth?.user && mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container-custom py-4 flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                        : 'text-dark-text hover:text-primary-400 hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-lg flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
