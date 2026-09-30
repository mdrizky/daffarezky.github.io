import { cn } from '@/lib/utils'

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={cn('mb-12', align === 'center' ? 'text-center' : 'text-left')}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-3 text-base text-muted-foreground',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
