import { forwardRef } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  className?: string
  asChild?: boolean
  type?: 'button' | 'submit' | 'reset'
  isLoading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    asChild = false,
    type = 'button',
    isLoading = false,
    icon,
    fullWidth = false,
    disabled = false,
    onClick,
    ...props
  }, ref) => {
    const Component = asChild ? 'span' : 'button'

    return (
      <Component
        ref={ref as React.Ref<any>}
        type={type}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap
          ${variant === 'primary'
            ? 'bg-gradient-primary text-white hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0'
            : variant === 'secondary'
            ? 'bg-dark-card border border-dark-border text-dark-text hover:bg-dark-panel hover:border-primary-500/50 hover:text-primary-400'
            : 'text-dark-text hover:text-primary-400 hover:bg-white/5'}
          ${size === 'sm'
            ? 'px-3 py-1.5 text-sm'
            : size === 'lg'
            ? 'px-6 py-3 text-lg'
            : 'px-4 py-2.5 text-base'}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        onClick={!disabled && !isLoading ? onClick : undefined}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin w-4 h-4">
            {/* Simple spinner */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        ) : icon ? (
          <span className="w-4 h-4">{icon}</span>
        ) : null}
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'

export default Button