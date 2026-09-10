import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90',
  secondary:
    'border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10',
  ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  href?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  ...props
}: Props) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
