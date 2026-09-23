'use client'

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  title?: string
  message: string
  onClose: () => void
  duration?: number
}

const typeStyles = {
  success: {
    bg: 'bg-success/10',
    border: 'border-success',
    text: 'text-success',
    icon: '✓',
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive',
    text: 'text-destructive',
    icon: '✕',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning',
    text: 'text-warning',
    icon: '⚠',
  },
  info: {
    bg: 'bg-info/10',
    border: 'border-info',
    text: 'text-info',
    icon: 'ⓘ',
  },
}

export function Toast({ type, title, message, onClose, duration = 5000 }: ToastProps) {
  const style = typeStyles[type]

  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="animate-fade-in-up">
      <div
        className={`${style.bg} ${style.border} border rounded-lg p-4 flex items-start gap-3 max-w-md shadow-lg`}
        role="alert"
      >
        <div className={`${style.text} flex-shrink-0 text-lg font-bold`}>{style.icon}</div>
        <div className="flex-1">
          {title && <h3 className={`${style.text} font-semibold text-sm`}>{title}</h3>}
          <p className="text-foreground text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`${style.text} flex-shrink-0 hover:opacity-75 transition-opacity`}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast
