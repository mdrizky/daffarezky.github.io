/**
 * CENTRALIZED DATABASE OPERATIONS FOR DAFFA PORTFOLIO
 * This file handles ALL database operations for 100% admin control
 * Single source of truth for all Supabase interactions
 */

import { supabase } from '@/lib/supabase'
export { supabase } from '@/lib/supabase'

// Generate standard CRUD operations for a given table
const createCrudOps = (tableName: string, orderByColumn: string = 'created_at', ascending: boolean = false) => ({
  async getAll() {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderByColumn, { ascending })
    return { data, error }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(record: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
      .single()
    return { data, error }
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    return { error }
  }
})

export const db = {
  // Profile
  profile: {
    async get() {
      const { data, error } = await supabase.from('profile').select('*').single()
      return { data, error }
    },
    async update(id: string, updates: Record<string, unknown>) {
      const { data, error } = await supabase.from('profile').update(updates).eq('id', id).select().single()
      return { data, error }
    },
    async create(profileData: Record<string, unknown>) {
      const { data, error } = await supabase.from('profile').insert(profileData).select().single()
      return { data, error }
    }
  },

  // Projects
  projects: {
    ...createCrudOps('projects', 'created_at', false),
    async getFeatured() {
      const { data, error } = await supabase.from('projects').select('*').eq('featured', true).order('created_at', { ascending: false })
      return { data, error }
    },
    async getBySlug(slug: string) {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()
      return { data, error }
    }
  },

  // Skills
  skills: {
    ...createCrudOps('skills', 'category', true),
    async getByCategory(category: string) {
      const { data, error } = await supabase.from('skills').select('*').eq('category', category)
      return { data, error }
    }
  },

  // Messages
  messages: {
    ...createCrudOps('messages', 'created_at', false),
    async getUnread() {
      const { data, error } = await supabase.from('messages').select('*').eq('is_read', false).order('created_at', { ascending: false })
      return { data, error }
    },
    async markAsRead(id: string) {
      const { data, error } = await supabase.from('messages').update({ is_read: true, status: 'read' }).eq('id', id).select().single()
      return { data, error }
    },
    async markAsUnread(id: string) {
      const { data, error } = await supabase.from('messages').update({ is_read: false, status: 'new' }).eq('id', id).select().single()
      return { data, error }
    },
    async markAsReplied(id: string) {
      const { data, error } = await supabase.from('messages').update({ status: 'replied', replied_at: new Date().toISOString() }).eq('id', id).select().single()
      return { data, error }
    }
  },

  // Blog Posts
  blogPosts: {
    ...createCrudOps('blog_posts', 'created_at', false),
    async getBySlug(slug: string) {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
      return { data, error }
    }
  },

  // Settings
  settings: {
    async get() {
      const { data, error } = await supabase.from('settings').select('*').single()
      return { data, error }
    },
    async update(id: string, updates: Record<string, unknown>) {
      const { data, error } = await supabase.from('settings').update(updates).eq('id', id).select().single()
      return { data, error }
    }
  },

  // Project Relations
  projectImages: {
    ...createCrudOps('project_images', 'sort_order', true),
    async getByProject(projectId: string) {
      const { data, error } = await supabase.from('project_images').select('*').eq('project_id', projectId).order('sort_order', { ascending: true })
      return { data, error }
    }
  },
  projectFeatures: {
    ...createCrudOps('project_features', 'sort_order', true),
    async getByProject(projectId: string) {
      const { data, error } = await supabase.from('project_features').select('*').eq('project_id', projectId).order('sort_order', { ascending: true })
      return { data, error }
    }
  },
  projectChallenges: {
    ...createCrudOps('project_challenges', 'sort_order', true),
    async getByProject(projectId: string) {
      const { data, error } = await supabase.from('project_challenges').select('*').eq('project_id', projectId).order('sort_order', { ascending: true })
      return { data, error }
    }
  },
  projectTechnologies: {
    ...createCrudOps('project_technologies', 'sort_order', true),
    async getByProject(projectId: string) {
      const { data, error } = await supabase.from('project_technologies').select('*').eq('project_id', projectId).order('sort_order', { ascending: true })
      return { data, error }
    }
  },

  // Standard entities
  certificates: createCrudOps('certificates', 'date_issued', false),
  education: createCrudOps('education', 'start_year', false),
  services: createCrudOps('services', 'sort_order', true),
  partners: createCrudOps('partners', 'order_index', true),
  reasonsToHire: createCrudOps('reasons_to_hire', 'sort_order', true),
  focusAreas: createCrudOps('focus_areas', 'sort_order', true),
  coreValues: createCrudOps('core_values', 'sort_order', true),
  quotes: createCrudOps('quotes', 'sort_order', true),
  testimonials: {
    ...createCrudOps('testimonials', 'created_at', false),
    async getFeatured() {
      const { data, error } = await supabase.from('testimonials').select('*').eq('featured', true).order('sort_order', { ascending: true })
      return { data, error }
    }
  },
  experience: createCrudOps('experience', 'order_index', true),
  islamic: {
    ...createCrudOps('islamic', 'order_index', true),
    async getFeatured() {
      const { data, error } = await supabase.from('islamic').select('*').eq('featured', true).order('order_index', { ascending: true })
      return { data, error }
    }
  },
  learningJourney: createCrudOps('learning_journey', 'year', false),
  
  // New Entities
  achievements: createCrudOps('achievements', 'sort_order', true),
  guestbook: createCrudOps('guestbook', 'created_at', false),
  newsletterSubscribers: createCrudOps('newsletter_subscribers', 'created_at', false),
  blogComments: createCrudOps('blog_comments', 'created_at', false),
  blogCategories: createCrudOps('blog_categories', 'sort_order', true),
  blogTags: createCrudOps('blog_tags', 'created_at', false),
  analyticsEvents: createCrudOps('analytics_events', 'created_at', false),
  usesItems: createCrudOps('uses_items', 'sort_order', true),
  adminUsers: createCrudOps('admin_users', 'created_at', false)
}

export default db
