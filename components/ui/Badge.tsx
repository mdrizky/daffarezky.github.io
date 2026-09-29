import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-gray-200 bg-gray-50 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200",
    secondary: "border-gray-200 bg-gray-100 text-gray-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200",
    destructive: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    outline: "border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200",
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
