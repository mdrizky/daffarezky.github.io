/**
 * CENTRALIZED DATABASE OPERATIONS FOR DAFFA PORTFOLIO
 * This file handles ALL database operations for 100% admin control
 * Single source of truth for all Supabase interactions
 */

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export async function getServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The setAll method was called from a Server Component
          }
        },
      },
    }
  )
}

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

export const db = {
  // Profile
  profile: {
    async get() {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('profile')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async create(profileData: any) {
      const { data, error } = await supabase
        .from('profile')
        .insert(profileData)
        .select()
        .single()
      return { data, error }
    }
  },

  // Projects
  projects: {
    async getAll() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async getFeatured() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()
      return { data, error }
    },

    async create(projectData: any) {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Skills
  skills: {
    async getAll() {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
      return { data, error }
    },

    async getByCategory(category: string) {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('category', category)
      return { data, error }
    },

    async create(skillData: any) {
      const { data, error } = await supabase
        .from('skills')
        .insert(skillData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Messages
  messages: {
    async getAll() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async getUnread() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(messageData: any) {
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single()
      return { data, error }
    },

    async markAsRead(id: string) {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true, status: 'read' })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async markAsUnread(id: string) {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: false, status: 'new' })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async markAsReplied(id: string) {
      const { data, error } = await supabase
        .from('messages')
        .update({ status: 'replied', replied_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Certificates
  certificates: {
    async getAll() {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('date_issued', { ascending: false })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(certificateData: any) {
      const { data, error } = await supabase
        .from('certificates')
        .insert(certificateData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Education
  education: {
    async getAll() {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('start_year', { ascending: false })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(educationData: any) {
      const { data, error } = await supabase
        .from('education')
        .insert(educationData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('education')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Services
  services: {
    async getAll() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('is_popular', { ascending: false })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(serviceData: any) {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Blog Posts
  blogPosts: {
    async getAll() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(blogData: any) {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(blogData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Partners
  partners: {
    async getAll() {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('order_index', { ascending: true })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(partnerData: any) {
      const { data, error } = await supabase
        .from('partners')
        .insert(partnerData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Concepts
  concepts: {
    async getAll() {
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .order('order_index', { ascending: true })
      return { data, error }
    },

    async getFeatured() {
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .eq('featured', true)
        .order('order_index', { ascending: true })
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async create(conceptData: any) {
      const { data, error } = await supabase
        .from('concepts')
        .insert(conceptData)
        .select()
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('concepts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('concepts')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Settings
  settings: {
    async get() {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()
      return { data, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Reasons to Hire
  reasonsToHire: {
    async getAll() {
      const { data, error } = await supabase
        .from('reasons_to_hire')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('reasons_to_hire')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('reasons_to_hire')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('reasons_to_hire')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Journey Milestones
  journeyMilestones: {
    async getAll() {
      const { data, error } = await supabase
        .from('journey_milestones')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('journey_milestones')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('journey_milestones')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('journey_milestones')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Focus Areas
  focusAreas: {
    async getAll() {
      const { data, error } = await supabase
        .from('focus_areas')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('focus_areas')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('focus_areas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('focus_areas')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Core Values
  coreValues: {
    async getAll() {
      const { data, error } = await supabase
        .from('core_values')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('core_values')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('core_values')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('core_values')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Quotes
  quotes: {
    async getAll() {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('quotes')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Active Projects
  activeProjects: {
    async getAll() {
      const { data, error } = await supabase
        .from('active_projects')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('active_projects')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('active_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('active_projects')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Future Concepts
  futureConcepts: {
    async getAll() {
      const { data, error } = await supabase
        .from('future_concepts')
        .select('*')
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('future_concepts')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('future_concepts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('future_concepts')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Testimonials
  testimonials: {
    async getAll() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async getFeatured() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('testimonials')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Experience
  experience: {
    async getAll() {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('experience')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('experience')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Islamic
  islamic: {
    async getAll() {
      const { data, error } = await supabase
        .from('islamic')
        .select('*')
        .order('order_index', { ascending: true })
      return { data, error }
    },

    async getFeatured() {
      const { data, error } = await supabase
        .from('islamic')
        .select('*')
        .eq('featured', true)
        .order('order_index', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('islamic')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('islamic')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('islamic')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Learning Journey
  learningJourney: {
    async getAll() {
      const { data, error } = await supabase
        .from('learning_journey')
        .select('*')
        .order('year', { ascending: false })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('learning_journey')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('learning_journey')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('learning_journey')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Project Images
  projectImages: {
    async getByProject(projectId: string) {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('project_images')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('project_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Project Features
  projectFeatures: {
    async getByProject(projectId: string) {
      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('project_features')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('project_features')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('project_features')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Project Challenges
  projectChallenges: {
    async getByProject(projectId: string) {
      const { data, error } = await supabase
        .from('project_challenges')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })
      return { data, error }
    },

    async create(data: any) {
      const { data: result, error } = await supabase
        .from('project_challenges')
        .insert(data)
        .select()
        .single()
      return { data: result, error }
    },

    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('project_challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('project_challenges')
        .delete()
        .eq('id', id)
      return { error }
    }
  }
}

export default db
