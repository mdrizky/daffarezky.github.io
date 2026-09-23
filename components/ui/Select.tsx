'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface SelectOption {
  value: string | number
  label: string
  icon?: ReactNode
}

interface SelectProps {
  options: SelectOption[]
  value?: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  required?: boolean
  clearable?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error,
  required = false,
  clearable = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2 text-left rounded-lg border transition-all flex items-center justify-between ${
            disabled
              ? 'disabled-state'
              : 'border-input bg-background hover:border-border focus:outline-none focus:ring-2 focus:ring-primary'
          } ${error ? 'border-destructive' : ''}`}
        >
          <div className="flex items-center gap-2">
            {selectedOption?.icon && <span>{selectedOption.icon}</span>}
            <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
              {selectedOption?.label || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {clearable && selectedOption && !disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                  setIsOpen(false)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-dropdown bg-card border border-border rounded-lg shadow-lg animate-scale-in">
            <div className="max-h-48 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-colors ${
                    value === option.value
                      ? 'bg-primary/10 text-foreground font-medium'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {option.icon && <span>{option.icon}</span>}
                  {option.label}
                  {value === option.value && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}

export default Select
