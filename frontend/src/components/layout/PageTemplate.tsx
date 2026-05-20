import React from 'react'
import { motion } from 'framer-motion'

export interface PageTemplateProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  header?: React.ReactNode
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  header,
}) => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      {header ? (
        header
      ) : (
        <motion.div
          className="flex items-start justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            {icon && <div className="text-4xl mt-1">{icon}</div>}
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">{title}</h1>
              {subtitle && <p className="text-dark-muted text-lg">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </motion.div>
      )}

      {/* Content */}
      {children}
    </motion.div>
  )
}

export default PageTemplate
