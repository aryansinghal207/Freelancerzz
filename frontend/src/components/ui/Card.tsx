import React from 'react'
import { motion } from 'framer-motion'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glassmorphic?: boolean
  noBorder?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glassmorphic = true, noBorder = false, className = '', children, ...props }, ref) => {
    const baseClass = glassmorphic ? 'card' : 'bg-dark-card border border-dark-border rounded-xl p-6'
    const hoverClass = hover ? 'card-hover' : ''

    return (
      <motion.div
        ref={ref}
        className={`${baseClass} ${hoverClass} ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card
