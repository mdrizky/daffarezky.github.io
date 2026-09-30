'use client'

import { ReactNode } from 'react'

interface TimelineItem {
  id: string
  title: string
  description?: string
  content?: ReactNode
  date?: string
  icon?: ReactNode
  status?: 'completed' | 'current' | 'upcoming'
}

interface TimelineProps {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
  variant?: 'default' | 'compact'
}

export function Timeline({
  items,
  orientation = 'vertical',
  variant = 'default',
}: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-min">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center min-w-max">
              {/* Connector line */}
              {index < items.length - 1 && (
                <div className="absolute left-1/2 top-16 w-12 h-px bg-border transform translate-x-32" />
              )}

              {/* Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-4 ${
                  item.status === 'completed'
                    ? 'bg-success/10 border-success'
                    : item.status === 'current'
                      ? 'bg-primary/10 border-primary animate-pulse-glow'
                      : 'bg-muted border-border'
                }`}
              >
                {item.icon ? item.icon : <div className="w-2 h-2 bg-current rounded-full" />}
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                {item.date && <p className="text-xs text-muted-foreground mt-1">{item.date}</p>}
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            {/* Circle */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-4 flex-shrink-0 ${
                item.status === 'completed'
                  ? 'bg-success/10 border-success'
                  : item.status === 'current'
                    ? 'bg-primary/10 border-primary animate-pulse-glow'
                    : 'bg-muted border-border'
              }`}
            >
              {item.icon ? item.icon : <div className="w-2 h-2 bg-current rounded-full" />}
            </div>

            {/* Connecting line */}
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-gradient-to-b from-border to-transparent" />
            )}
          </div>

          {/* Content */}
          <div className={`pb-8 pt-1 ${index === items.length - 1 ? 'pb-0' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                {item.date && <p className="text-sm text-muted-foreground mt-1">{item.date}</p>}
              </div>
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            )}

            {item.content && <div className="mt-4">{item.content}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
