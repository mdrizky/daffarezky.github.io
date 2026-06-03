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
  message: string
  is_read: boolean
  created_at: string
}

export type Skill = {
  id: string
  name: string
  icon: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
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


