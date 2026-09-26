-- ============================================================================
-- PORTFOLIO V2 - SIMPLIFIED DATABASE SETUP
-- ============================================================================
-- Copy this file and paste into Supabase SQL Editor section by section
-- Follow the instructions carefully
-- ============================================================================

-- STEP 1: CREATE EXTENSION
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- STEP 2: BASE TABLES

CREATE TABLE IF NOT EXISTS public.profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL DEFAULT 'Daffa',
  title_id TEXT,
  title_en TEXT,
  bio_id TEXT,
  bio_en TEXT,
  photo_url TEXT,
  about_photo_url TEXT,
  logo_url TEXT,
  wa TEXT,
  email TEXT,
  instagram TEXT,
  github TEXT,
  linkedin TEXT,
  tiktok TEXT,
  youtube TEXT,
  birth_date DATE,
  birth_place TEXT,
  vision_id TEXT,
  vision_en TEXT,
  motto_id TEXT,
  motto_en TEXT,
  focus_id TEXT,
  focus_en TEXT,
  values_id TEXT,
  values_en TEXT,
  availability_status_id TEXT,
  availability_status_en TEXT,
  work_hours TEXT,
  current_city TEXT,
  stats_projects TEXT,
  stats_tools TEXT,
  stats_passion TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  category TEXT,
  progress INTEGER DEFAULT 0,
  start_date TEXT,
  completion_date TEXT,
  is_current BOOLEAN DEFAULT false,
  difficulty TEXT DEFAULT 'Medium',
  slug TEXT,
  duration TEXT,
  year INTEGER,
  status TEXT DEFAULT 'Completed',
  bottom_flyer_id TEXT,
  bottom_flyer_en TEXT,
  current_features_id TEXT,
  current_features_en TEXT,
  problem_id TEXT,
  problem_en TEXT,
  solution_id TEXT,
  solution_en TEXT,
  result_id TEXT,
  result_en TEXT,
  architecture_id TEXT,
  architecture_en TEXT,
  future_plans_id TEXT,
  future_plans_en TEXT,
  overview_id TEXT,
  overview_en TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  sort_order INTEGER DEFAULT 0,
  source_table TEXT,
  role TEXT,
  categories TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  level TEXT,
  show_on_home BOOLEAN DEFAULT false,
  is_learning BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  replied_at TIMESTAMPTZ,
  service TEXT,
  budget TEXT,
  timeline TEXT,
  priority TEXT
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  date_issued TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  institution TEXT NOT NULL,
  degree_id TEXT,
  degree_en TEXT,
  start_year TEXT,
  end_year TEXT,
  description_id TEXT,
  description_en TEXT,
  is_current BOOLEAN DEFAULT false,
  logo_url TEXT,
  location TEXT,
  field_of_study TEXT,
  achievement TEXT,
  gallery TEXT[] DEFAULT '{}',
  certificate_url TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT,
  title_en TEXT,
  organization TEXT,
  role TEXT,
  start_date TEXT,
  end_date TEXT,
  description_id TEXT,
  description_en TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  is_current BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price TEXT,
  description_id TEXT,
  description_en TEXT,
  features_id TEXT[] DEFAULT '{}',
  features_en TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_id TEXT,
  content_en TEXT,
  thumbnail TEXT,
  category TEXT,
  excerpt_id TEXT,
  excerpt_en TEXT,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  reading_time INTEGER,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  site_title TEXT,
  site_description TEXT
);

CREATE TABLE IF NOT EXISTS public.reasons_to_hire (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  icon TEXT,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.focus_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  text_id TEXT NOT NULL,
  text_en TEXT NOT NULL,
  author TEXT,
  is_personal BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption_id TEXT,
  caption_en TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.project_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL,
  feature_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.project_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_en TEXT NOT NULL,
  solution_id TEXT,
  solution_en TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.learning_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  year TEXT NOT NULL,
  title_id TEXT,
  title_en TEXT,
  description_id TEXT,
  description_en TEXT,
  technologies TEXT[] DEFAULT '{}',
  icon TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT,
  role TEXT,
  content_id TEXT,
  content_en TEXT,
  avatar_url TEXT,
  client_name TEXT,
  client_company TEXT,
  client_photo_url TEXT,
  testimonial_id TEXT,
  testimonial_en TEXT,
  rating INTEGER,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  project_id UUID
);

CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT
);

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.uses_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  link TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  organization TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  achieved_on DATE,
  description_id TEXT,
  description_en TEXT,
  image_url TEXT,
  certificate_url TEXT,
  credential_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.project_technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  event_name TEXT NOT NULL,
  path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.islamic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT,
  title_en TEXT,
  subtitle_id TEXT,
  subtitle_en TEXT,
  description_id TEXT,
  description_en TEXT,
  category TEXT,
  reference TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- ============================================================================
-- SUCCESS! All tables created
-- ============================================================================
-- Now run Step 2 from the guide below
