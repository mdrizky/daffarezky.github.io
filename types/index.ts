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
  status?: 'Completed' | 'Ongoing' | 'Archived'
  problem_id?: string
  problem_en?: string
  solution_id?: string
  solution_en?: string
  result_id?: string
  result_en?: string
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
}

export type Message = {
  id: string
  name: string
  email: string
  whatsapp?: string
  subject?: string
  message: string
  is_read: boolean
  status: 'new' | 'read' | 'replied'
  replied_at?: string
  created_at: string
}

export type Skill = {
  id: string
  name: string
  icon: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  show_on_home?: boolean
  is_learning?: boolean
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
}

export type ReasonsToHire = {
  id: string
  icon: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  sort_order: number
}

export type JourneyMilestone = {
  id: string
  year: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  icon?: string
  sort_order: number
}

export type FocusArea = {
  id: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  icon?: string
  sort_order: number
}

export type CoreValue = {
  id: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  icon?: string
  sort_order: number
}

export type Quote = {
  id: string
  text_id: string
  text_en: string
  author?: string
  is_personal: boolean
  sort_order: number
}

export type ActiveProject = {
  id: string
  name_id: string
  name_en: string
  description_id?: string
  description_en?: string
  status_id: string
  status_en: string
  progress_percent: number
  estimated_completion?: string
  features_id: string[]
  features_en: string[]
  sort_order: number
}

export type FutureConcept = {
  id: string
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  category?: string
  tags: string[]
  sort_order: number
}

export type Testimonial = {
  id: string
  name: string
  role: string
  content_id: string
  content_en: string
  avatar_url: string | null
  created_at: string
}

export type Certificate = {
  id: string
  title_id: string
  title_en: string
  issuer: string
  image_url?: string
  file_url: string
  date_issued: string
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
  achievements?: string
  gallery?: string[]
  certificate_url?: string
  created_at: string
}

export type LearningJourney = {
  id: string
  year: string
  title_id: string
  title_en: string
  description_id: string
  description_en: string
  created_at: string
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
}

export type Concept = {
  id: string
  title_id: string
  title_en: string
  subtitle_id?: string
  subtitle_en?: string
  description_id?: string
  description_en?: string
  technology: string[]
  status: string
  featured: boolean
  order_index: number
  created_at: string
}

export type Partner = {
  id: string
  name: string
  logo_url?: string
  website_url?: string
  order_index: number
  created_at: string
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
}



