-- Setup Script for Daffa Rizky Portfolio
-- Run this in your Supabase SQL Editor

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create BlogPosts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_id TEXT NOT NULL,
  content_en TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt_id TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price TEXT NOT NULL,
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  features_id TEXT[] NOT NULL DEFAULT '{}',
  features_en TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false
);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'))
);

-- 6. Create Profile Table
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  bio_id TEXT NOT NULL,
  bio_en TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  wa TEXT,
  email TEXT,
  instagram TEXT,
  github TEXT,
  linkedin TEXT,
  tiktok TEXT,
  youtube TEXT
);

-- 7. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  issuer TEXT NOT NULL,
  file_url TEXT NOT NULL,
  date_issued DATE NOT NULL
);

-- 8. Create Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree_id TEXT NOT NULL,
  degree_en TEXT NOT NULL,
  start_year TEXT NOT NULL,
  end_year TEXT NOT NULL,
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read-only access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.education FOR SELECT USING (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow admin full access" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.education FOR ALL USING (auth.role() = 'authenticated');

-- Allow public to insert messages
CREATE POLICY "Allow public insert" ON public.messages FOR INSERT WITH CHECK (true);

-- Instructions to create Admin User:
-- Since Supabase handles auth securely, to create the admin user with email 'admin@daffarizky.com' and password 'AdminPro123!'
-- 1. Go to Supabase Dashboard -> Authentication -> Users.
-- 2. Click 'Add user' -> 'Create new user'.
-- 3. Enter Email: admin@daffarizky.com
-- 4. Enter Password: AdminPro123!
-- 5. Auto Confirm User (Optional but recommended).
-- 6. Click 'Create user'.
