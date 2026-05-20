import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export interface SidebarLink {
  to: string
  label: string
  icon?: React.ReactNode
}

interface SidebarProps {
  links: SidebarLink[]
  title?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ links, title }) => {
  return (
    <motion.aside
      className="glass rounded-xl p-6 h-fit sticky top-24"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <h3 className="text-lg font-bold mb-6 text-gradient-primary">{title}</h3>
      )}

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-text hover:bg-white/5 hover:text-primary-400'
              }`
            }
          >
            {link.icon && <span className="text-lg">{link.icon}</span>}
            <span className="flex-1">{link.label}</span>
            <ChevronRight
              size={18}
              className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"
            />
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  )
}

export default Sidebar
