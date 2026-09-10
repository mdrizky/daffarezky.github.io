import type { Testimonial } from '@/types'

export function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    id: String(row.id),
    name: String(row.name || row.client_name || ''),
    role: String(row.role || row.client_company || ''),
    content_id: String(row.content_id || row.testimonial_id || ''),
    content_en: String(row.content_en || row.testimonial_en || ''),
    avatar_url: (row.avatar_url || row.client_photo_url || null) as string | null,
    created_at: String(row.created_at || ''),
    rating: typeof row.rating === 'number' ? row.rating : 5,
    featured: Boolean(row.featured),
  }
}

export function projectHref(project: { slug?: string | null; id: string }) {
  return `/projects/${project.slug || project.id}`
}
