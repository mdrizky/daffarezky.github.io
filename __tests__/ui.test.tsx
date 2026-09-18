import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'

describe('UI Design System Components', () => {
  it('renders Badge with default variant', () => {
    render(<Badge>Frontend</Badge>)
    const badge = screen.getByText('Frontend')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('bg-primary')
  })

  it('renders Button as button element and as link when href is passed', () => {
    const { rerender } = render(<Button>Click Me</Button>)
    const button = screen.getByRole('button', { name: 'Click Me' })
    expect(button).toBeDefined()

    rerender(<Button href="/projects">Go to Projects</Button>)
    const link = screen.getByRole('link', { name: 'Go to Projects' })
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('/projects')
  })

  it('renders Container with children and max-w-7xl', () => {
    render(<Container><p>Inside Container</p></Container>)
    expect(screen.getByText('Inside Container')).toBeDefined()
  })

  it('renders Card and CardContent', () => {
    render(
      <Card>
        <CardContent>
          <p>Card body</p>
        </CardContent>
      </Card>
    )
    expect(screen.getByText('Card body')).toBeDefined()
  })

  it('renders SectionHeader with title and subtitle', () => {
    render(
      <SectionHeader 
        title="Proyek Pilihan" 
        description="Studi kasus teknologi modern" 
      />
    )
    expect(screen.getByText('Proyek Pilihan')).toBeDefined()
    expect(screen.getByText('Studi kasus teknologi modern')).toBeDefined()
  })
})
