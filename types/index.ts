export type Project = {
  id: string
  title_id: string
  title_en: string
  description_id: string
  description_en: string
  image_url: string
  tech_stack: string[]
  demo_url?: string
  github_url?: string
  featured: boolean
  category: string
  created_at: string
  progress: number
  start_date?: string
  completion_date?: string
  is_current: boolean
  estimated_hours?: string
  actual_hours?: string
  difficulty: string
  bottom_flyer_id?: string
  bottom_flyer_en?: string
  current_features_id?: string
  current_features_en?: string
  slug?: string
  duration?: string
  year?: number
  status?: 'Completed' | 'Planned' | 'Ongoing' | 'Archived' | 'Concept'
  is_published?: boolean
  published_at?: string
  updated_at?: string
  role?: string
  overview_id?: string
  overview_en?: string
  future_plans_id?: string
  future_plans_en?: string
  sort_order?: number
  problem_id?: string
  problem_en?: string
  solution_id?: string
  solution_en?: string
  result_id?: string
  result_en?: string
  architecture_id?: string
  architecture_en?: string
  categories?: string[]
  source_table?: string
}

export type GuestbookEntry = {
  id: string
  name: string
  message: string
  is_approved: boolean
  created_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  is_active: boolean
  created_at: string
  unsubscribed_at?: string
  source?: string
}

export type BlogComment = {
  id: string
  post_id: string
  name: string
  email: string
  content: string
  is_approved: boolean
  created_at: string
}

export type UsesItem = {
  id: string
  category: string
  name: string
  description_id?: string
  description_en?: string
  link?: string
  icon?: string
  sort_order: number
  is_published?: boolean
}

export type ProjectImage = {
  id: string
  project_id: string
  image_url: string
  caption_id?: string
  caption_en?: string
  sort_order: number
}

export type ProjectFeature = {
  id: string
  project_id: string
  feature_id: string
  feature_en: string
  sort_order: number
}

export type ProjectChallenge = {
  id: string
  project_id: string
  challenge_id: string
  challenge_en: string
  solution_id?: string
  solution_en?: string
  sort_order: number
}

export type BlogPost = {
  id: string
  title_id: string
  title_en: string
  slug: string
  content_id: string
  content_en: string
  thumbnail: string
  category: string
  excerpt_id: string
  excerpt_en: string
  created_at: string
  updated_at?: string
  published_at?: string
  status?: 'draft' | 'published' | 'archived'
  reading_time?: number
  seo_title?: string
  seo_description?: string
  og_image?: string
  is_published?: boolean
}

export type Service = {
  id: string
  name_id: string
  name_en: string
  price: string
  description_id: string
  description_en: string
  features_id: string[]
  features_en: string[]
  is_popular: boolean
  sort_order?: number
  is_published?: boolean
}

export type Message = {
  id: string
  name: string
  email: string
  whatsapp?: string
  subject?: string
  message: string
  is_read: boolean
  status: 'new' | 'contacted' | 'qualified' | 'in_progress' | 'completed' | 'archived' | 'spam' | 'read' | 'replied'
  replied_at?: string
  created_at: string
  service?: string
  budget?: string
  timeline?: string
  priority?: string
}

export type Skill = {
  id: string
  name: string
  icon: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  show_on_home?: boolean
  is_learning?: boolean
  sort_order?: number
  is_published?: boolean
}

export type Profile = {
  id: string
  name: string
  title_id: string
  title_en: string
  bio_id: string
  bio_en: string
  photo_url: string
  about_photo_url?: string
  logo_url?: string
  wa: string
  email: string
  instagram: string
  github: string
  linkedin: string
  tiktok: string
  youtube: string
  stats_projects: string
  stats_tools: string
  stats_passion: string
  birth_date?: string
  birth_place?: string
  vision_id?: string
  vision_en?: string
  motto_id?: string
  motto_en?: string
  focus_id?: string
  focus_en?: string
  values_id?: string
  values_en?: string
  availability_status_id?: string
  availability_status_en?: string
  work_hours?: string
  current_city?: string
  updated_at?: string
}

export type ReasonsToHire = {
  id: string
  icon: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  sort_order: number
  is_published?: boolean
}

export type FocusArea = {
  id: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  icon?: string
  sort_order: number
  is_published?: boolean
}

export type CoreValue = {
  id: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  icon?: string
  sort_order: number
  is_published?: boolean
}

export type Quote = {
  id: string
  text_id: string
  text_en: string
  author?: string
  is_personal: boolean
  sort_order: number
  is_published?: boolean
}

export type Testimonial = {
  id: string
  name?: string
  role?: string
  content_id?: string
  content_en?: string
  avatar_url?: string | null
  client_name?: string
  client_company?: string
  client_photo_url?: string
  testimonial_id?: string
  testimonial_en?: string
  created_at: string
  rating?: number
  featured?: boolean
  sort_order?: number
  is_published?: boolean
  project_id?: string
}

export type Certificate = {
  id: string
  title_id: string
  title_en: string
  issuer: string
  image_url?: string
  file_url: string
  date_issued: string
  sort_order?: number
  is_published?: boolean
}

export type Education = {
  id: string
  institution: string
  degree_id: string
  degree_en: string
  start_year: string
  end_year: string
  description_id: string
  description_en: string
  is_current: boolean
  logo_url?: string
  location?: string
  achievement?: string
  gallery?: string[]
  certificate_url?: string
  created_at: string
  field_of_study?: string
  sort_order?: number
  is_published?: boolean
}

export type LearningJourney = {
  id: string
  year: string
  title_id: string
  title_en: string
  description_id: string
  description_en: string
  created_at: string
  technologies?: string[]
  icon?: string
  image_url?: string
  sort_order?: number
  is_published?: boolean
}

export type Achievement = {
  id: string
  title_id: string
  title_en: string
  organization?: string
  category: string
  achieved_on?: string
  description_id?: string
  description_en?: string
  image_url?: string
  certificate_url?: string
  credential_url?: string
  featured?: boolean
  sort_order?: number
  is_published?: boolean
  created_at?: string
  updated_at?: string
  published_at?: string
}

export type Experience = {
  id: string
  title_id: string
  title_en: string
  organization: string
  role: string
  start_date: string
  end_date?: string
  is_current: boolean
  description_id?: string
  description_en?: string
  category: string
  order_index: number
  created_at: string
  sort_order?: number
  is_published?: boolean
}

export type Partner = {
  id: string
  name: string
  logo_url?: string
  website_url?: string
  order_index: number
  created_at: string
  is_published?: boolean
}

export type Islamic = {
  id: string
  title_id: string
  title_en: string
  subtitle_id?: string
  subtitle_en?: string
  description_id?: string
  description_en?: string
  category: string
  reference?: string
  featured: boolean
  order_index: number
  created_at: string
  is_published?: boolean
}

export type AdminUser = {
  id: string
  user_id: string
  role: 'super_admin' | 'editor'
  is_active: boolean
  created_at: string
}

export type ProjectTechnology = {
  id: string
  project_id: string
  name: string
  sort_order: number
}

export type BlogCategory = {
  id: string
  name_id: string
  name_en: string
  slug: string
  sort_order: number
  is_published: boolean
  created_at: string
}

export type BlogTag = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type AnalyticsEvent = {
  id: string
  event_name: string
  path?: string
  metadata?: Record<string, unknown>
  created_at: string
}
