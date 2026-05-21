import { forwardRef } from 'react'

interface CardProps {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className = '',
    children,
    asChild = false,
    hover = false,
    ...props
  }, ref) => {
    const Component = asChild ? 'div' : 'div'

    return (
      <Component
        ref={ref as React.Ref<any>}
        className={`
          glass rounded-xl p-6 transition-all duration-300
          ${hover ? 'hover:shadow-glow-lg hover:border-primary-500/50 hover:scale-105' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export default Card