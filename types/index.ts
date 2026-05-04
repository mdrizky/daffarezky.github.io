export type Project = {
  id: string
  title: string
  description: string
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
  title: string
  slug: string
  content: string
  thumbnail: string
  category: string
  excerpt: string
  created_at: string
}

export type Service = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
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
  title: string
  bio: string
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
  title: string
  issuer: string
  file_url: string
  date_issued: string
}
