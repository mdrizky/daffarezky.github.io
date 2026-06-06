-- COMPLETE DATABASE SETUP FOR DAFFA PORTFOLIO
-- Run this in Supabase SQL Editor to set up the entire database

-- 1. Profile Table
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
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
  
  -- Additional fields for "Tentang"
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
  availability_status_id TEXT DEFAULT 'Tersedia',
  availability_status_en TEXT DEFAULT 'Available',
  work_hours TEXT,
  current_city TEXT,
  
  -- Stats
  stats_projects TEXT DEFAULT '0',
  stats_tools TEXT DEFAULT '0',
  stats_passion TEXT DEFAULT '∞'
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
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
  status TEXT CHECK (status IN ('Completed','Ongoing','Archived')) DEFAULT 'Completed',
  
  -- Bottom flyer/CTA for project
  bottom_flyer_id TEXT,
  bottom_flyer_en TEXT,
  
  -- Ongoing features/details
  current_features_id TEXT,
  current_features_en TEXT
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'))
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('new','read','replied')) DEFAULT 'new',
  replied_at TIMESTAMP WITH TIME ZONE
);

-- 5. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  date_issued TEXT
);

-- 6. Education Table
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
  logo_url TEXT
);

-- 7. Concepts Table
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_id TEXT,
  subtitle_en TEXT,
  description_id TEXT,
  description_en TEXT,
  technology TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Concept',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- 8. Partners Table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- 9. Services Table
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
  is_popular BOOLEAN DEFAULT false
);

-- 10. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_id TEXT,
  content_en TEXT,
  thumbnail TEXT,
  category TEXT,
  excerpt_id TEXT,
  excerpt_en TEXT
);

-- 11. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  site_title TEXT,
  site_description TEXT,
  admin_pin TEXT DEFAULT '240708'
);

-- 12. Additional Tables for Enhanced Features

-- Reasons to Hire
CREATE TABLE IF NOT EXISTS public.reasons_to_hire (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  icon TEXT,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Journey Milestones
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  year TEXT NOT NULL,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Focus Areas
CREATE TABLE IF NOT EXISTS public.focus_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Core Values
CREATE TABLE IF NOT EXISTS public.core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  text_id TEXT NOT NULL,
  text_en TEXT NOT NULL,
  author TEXT,
  is_personal BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Active Projects
CREATE TABLE IF NOT EXISTS public.active_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  status_id TEXT DEFAULT 'Sedang Dikerjakan',
  status_en TEXT DEFAULT 'In Progress',
  progress_percent INTEGER DEFAULT 0,
  estimated_completion TEXT,
  features_id TEXT[],
  features_en TEXT[],
  sort_order INTEGER DEFAULT 0
);

-- Future Concepts
CREATE TABLE IF NOT EXISTS public.future_concepts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  category TEXT,
  tags TEXT[],
  sort_order INTEGER DEFAULT 0
);

-- Project Images
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption_id TEXT,
  caption_en TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Project Features
CREATE TABLE IF NOT EXISTS public.project_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL,
  feature_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Project Challenges
CREATE TABLE IF NOT EXISTS public.project_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_en TEXT NOT NULL,
  solution_id TEXT,
  solution_en TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Learning Journey
CREATE TABLE IF NOT EXISTS public.learning_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  year TEXT NOT NULL,
  title_id TEXT,
  title_en TEXT,
  description_id TEXT,
  description_en TEXT
);

-- Experience
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
  order_index INTEGER DEFAULT 0
);

-- Islamic
CREATE TABLE IF NOT EXISTS public.islamic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT,
  title_en TEXT,
  description_id TEXT,
  description_en TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_photo_url TEXT,
  testimonial_id TEXT NOT NULL,
  testimonial_en TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  project_id UUID REFERENCES public.projects(id),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Enable RLS for all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasons_to_hire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islamic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read" ON public.profile;
  DROP POLICY IF EXISTS "Allow admin all" ON public.profile;
  DROP POLICY IF EXISTS "Allow public read" ON public.projects;
  DROP POLICY IF EXISTS "Allow admin all" ON public.projects;
  DROP POLICY IF EXISTS "Allow public read" ON public.skills;
  DROP POLICY IF EXISTS "Allow admin all" ON public.skills;
  DROP POLICY IF EXISTS "Allow public insert messages" ON public.messages;
  DROP POLICY IF EXISTS "Allow public read" ON public.messages;
  DROP POLICY IF EXISTS "Allow admin all" ON public.messages;
  DROP POLICY IF EXISTS "Allow public read" ON public.certificates;
  DROP POLICY IF EXISTS "Allow admin all" ON public.certificates;
  DROP POLICY IF EXISTS "Allow public read" ON public.education;
  DROP POLICY IF EXISTS "Allow admin all" ON public.education;
  DROP POLICY IF EXISTS "Allow public read" ON public.concepts;
  DROP POLICY IF EXISTS "Allow admin all" ON public.concepts;
  DROP POLICY IF EXISTS "Allow public read" ON public.partners;
  DROP POLICY IF EXISTS "Allow admin all" ON public.partners;
  DROP POLICY IF EXISTS "Allow public read" ON public.services;
  DROP POLICY IF EXISTS "Allow admin all" ON public.services;
  DROP POLICY IF EXISTS "Allow public read" ON public.blog_posts;
  DROP POLICY IF EXISTS "Allow admin all" ON public.blog_posts;
  DROP POLICY IF EXISTS "Allow public read" ON public.settings;
  DROP POLICY IF EXISTS "Allow admin all" ON public.settings;
  DROP POLICY IF EXISTS "Allow public read" ON public.reasons_to_hire;
  DROP POLICY IF EXISTS "Allow admin all" ON public.reasons_to_hire;
  DROP POLICY IF EXISTS "Allow public read" ON public.journey_milestones;
  DROP POLICY IF EXISTS "Allow admin all" ON public.journey_milestones;
  DROP POLICY IF EXISTS "Allow public read" ON public.focus_areas;
  DROP POLICY IF EXISTS "Allow admin all" ON public.focus_areas;
  DROP POLICY IF EXISTS "Allow public read" ON public.core_values;
  DROP POLICY IF EXISTS "Allow admin all" ON public.core_values;
  DROP POLICY IF EXISTS "Allow public read" ON public.quotes;
  DROP POLICY IF EXISTS "Allow admin all" ON public.quotes;
  DROP POLICY IF EXISTS "Allow public read" ON public.active_projects;
  DROP POLICY IF EXISTS "Allow admin all" ON public.active_projects;
  DROP POLICY IF EXISTS "Allow public read" ON public.future_concepts;
  DROP POLICY IF EXISTS "Allow admin all" ON public.future_concepts;
  DROP POLICY IF EXISTS "Allow public read" ON public.project_images;
  DROP POLICY IF EXISTS "Allow admin all" ON public.project_images;
  DROP POLICY IF EXISTS "Allow public read" ON public.project_features;
  DROP POLICY IF EXISTS "Allow admin all" ON public.project_features;
  DROP POLICY IF EXISTS "Allow public read" ON public.project_challenges;
  DROP POLICY IF EXISTS "Allow admin all" ON public.project_challenges;
  DROP POLICY IF EXISTS "Allow public read" ON public.learning_journey;
  DROP POLICY IF EXISTS "Allow admin all" ON public.learning_journey;
  DROP POLICY IF EXISTS "Allow public read" ON public.experience;
  DROP POLICY IF EXISTS "Allow admin all" ON public.experience;
  DROP POLICY IF EXISTS "Allow public read" ON public.islamic;
  DROP POLICY IF EXISTS "Allow admin all" ON public.islamic;
  DROP POLICY IF EXISTS "Allow public read" ON public.testimonials;
  DROP POLICY IF EXISTS "Allow admin all" ON public.testimonials;
END $$;

-- Create Public Read Policies
CREATE POLICY "Allow public read" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.concepts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.reasons_to_hire FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.journey_milestones FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.focus_areas FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.active_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.future_concepts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.project_features FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.project_challenges FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.learning_journey FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.islamic FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.testimonials FOR SELECT USING (true);

-- Public Insert for Messages
CREATE POLICY "Allow public insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
CREATE POLICY "Allow admin all" ON public.profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.concepts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.partners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.reasons_to_hire FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.journey_milestones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.focus_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.core_values FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.quotes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.active_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.future_concepts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.project_features FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.project_challenges FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.learning_journey FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.islamic FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Storage Setup
INSERT INTO storage.buckets (id, name, public)
SELECT 'portfolio-images', 'portfolio-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portfolio-images');

-- Storage Policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public Read" ON storage.objects;
  DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
  DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
  DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
END $$;

CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO public.settings (site_title, site_description, admin_pin)
SELECT 'Daffa Rizky | Web & Mobile Developer', 'Freelance Developer Indonesia...', '240708'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);
