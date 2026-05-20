import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className={`${sizeClasses[size]} w-full mx-4 pointer-events-auto glass rounded-2xl overflow-hidden`}>
              {title || closeButton ? (
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  {title && <h2 className="text-2xl font-bold">{title}</h2>}
                  {closeButton && (
                    <button
                      onClick={onClose}
                      className="ml-auto text-dark-muted hover:text-dark-text transition-colors"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>
              ) : null}

              <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                {children}
              </div>

              {footer && (
                <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
