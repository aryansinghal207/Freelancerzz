import React from 'react'
import { motion } from 'framer-motion'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
  floating?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, floating = false, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && !floating && (
          <label className="label block mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted">{icon}</div>}
          <motion.input
            ref={ref}
            className={`input ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/20' : ''} ${className}`}
            placeholder={floating ? label : props.placeholder}
            {...props}
          />
          {floating && label && (
            <label className="label-floating">{label}</label>
          )}
        </div>
        {error && (
          <motion.p className="text-red-400 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-dark-muted text-sm mt-2">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
