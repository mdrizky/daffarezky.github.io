'use client'

import { useState, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Toast, ToastType } from './Toast'

interface ToastMessage {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: ToastMessage[]
  addToast: (type: ToastType, message: string, options?: { title?: string; duration?: number }) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

interface ToastContainerProps {
  children: ReactNode
}

export function ToastContainer({ children }: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string, options?: { title?: string; duration?: number }) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, type, message, title: options?.title, duration: options?.duration }])
    },
    []
  )

  const success = useCallback((message: string, title?: string) => {
    addToast('success', message, { title })
  }, [addToast])

  const error = useCallback((message: string, title?: string) => {
    addToast('error', message, { title })
  }, [addToast])

  const warning = useCallback((message: string, title?: string) => {
    addToast('warning', message, { title })
  }, [addToast])

  const info = useCallback((message: string, title?: string) => {
    addToast('info', message, { title })
  }, [addToast])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-notification space-y-2 pointer-events-none">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  type={toast.type}
                  title={toast.title}
                  message={toast.message}
                  onClose={() => removeToast(toast.id)}
                  duration={toast.duration}
                />
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastContainer')
  }
  return context
}

import React from 'react'

export default ToastContainer
