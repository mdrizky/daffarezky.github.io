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
  wa: string
  email: string
  instagram: string
  github: string
  linkedin: string
  tiktok: string
  youtube: string
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
  created_at: string
}
