'use client'

import { useState, ReactNode } from 'react'

interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  variant?: 'default' | 'underline' | 'pills'
  size?: 'sm' | 'md' | 'lg'
  onChange?: (tabId: string) => void
}

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
}

export function Tabs({
  items,
  defaultTab,
  variant = 'default',
  size = 'md',
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = items.find((item) => item.id === activeTab)

  return (
    <div className="w-full">
      {/* Tab list */}
      <div
        className={`flex gap-2 border-b border-border overflow-x-auto ${
          variant === 'pills' ? 'bg-muted p-2 rounded-lg border-0' : ''
        }`}
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            disabled={item.disabled}
            role="tab"
            aria-selected={activeTab === item.id}
            className={`${sizeClasses[size]} flex items-center gap-2 font-medium transition-all whitespace-nowrap ${
              item.disabled ? 'disabled-state' : ''
            } ${
              variant === 'pills'
                ? activeTab === item.id
                  ? 'bg-primary text-primary-foreground rounded-md'
                  : 'text-foreground hover:bg-muted-foreground/10 rounded-md'
                : variant === 'underline'
                  ? activeTab === item.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
                  : activeTab === item.id
                    ? 'bg-card text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
            }`}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeContent && (
        <div className="mt-6 animate-fade-in" role="tabpanel">
          {activeContent.content}
        </div>
      )}
    </div>
  )
}

export default Tabs
