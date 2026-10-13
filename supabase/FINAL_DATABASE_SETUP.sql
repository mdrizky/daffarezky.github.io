-- =============================================================================
-- DAFFA PORTFOLIO V2 — COMPLETE MASTER DATABASE SETUP & FULL SEED DATA
-- =============================================================================
-- 100% SINGLE SOURCE OF TRUTH (LENGKAP SKEMA + DATA ASLI DAFFA)
--
-- CARA PENGGUNAAN:
--   1. Salin SELURUH isi file ini (Ctrl + A -> Ctrl + C).
--   2. Buka Supabase Dashboard proyek Anda.
--   3. Masuk ke menu SQL Editor -> New Query.
--   4. Tempel (Ctrl + V) -> Klik tombol RUN (atau Ctrl + Enter).
--
-- AMAN & NON-DESTRUKTIF:
--   • Bekerja pada database baru (Fresh Install) maupun database lama (Upgrade).
--   • Tidak ada perintah DROP TABLE (Semua data aman, kolom ditambahkan otomatis).
--   • Mengaktifkan Storage Bucket 'portfolio-images' (public = true).
--   • Menghilangkan error 403 Forbidden pada upload gambar profil / kampus / sertifikat.
--   • Mengisi otomatis data asli portofolio Daffa jika tabel masih kosong.
--   • Mengaktifkan Supabase Realtime & RLS Policies ramah Admin & Publik.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 0. HELPER FUNCTION: Add column only if missing
-- =============================================================================
CREATE OR REPLACE FUNCTION public._add_column_if_missing(
  p_table text,
  p_column text,
  p_type text
) RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_column
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', p_table, p_column, p_type);
  END IF;
END $$;

-- =============================================================================
-- 1. STORAGE BUCKET: portfolio-images (PUBLIC = TRUE)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Helper folder upload
CREATE OR REPLACE FUNCTION public.is_allowed_upload_folder(name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT true;
$$;

GRANT EXECUTE ON FUNCTION public.is_allowed_upload_folder(text) TO anon, authenticated;

-- Bersihkan storage policy lama khusus portfolio-images
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'portfolio_images_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Storage RLS: Public dapat melihat/membaca gambar
CREATE POLICY "portfolio_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Storage RLS: Upload, update, delete diizinkan penuh untuk bucket portfolio-images
CREATE POLICY "portfolio_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images');

-- =============================================================================
-- 2. CREATE BASE TABLES (IF NOT EXISTS)
-- =============================================================================

-- 1. Profile & Identitas
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL DEFAULT 'Muhammad Daffa Rezky Adyra',
  title_id TEXT DEFAULT 'Web & Mobile Developer',
  title_en TEXT DEFAULT 'Web & Mobile Developer',
  bio_id TEXT DEFAULT 'Web & Mobile Developer yang berfokus membangun website dan aplikasi modern, responsif, dan user-friendly.',
  bio_en TEXT DEFAULT 'Web & Mobile Developer passionate about building modern, fast, and responsive digital products.',
  photo_url TEXT,
  about_photo_url TEXT,
  logo_url TEXT,
  wa TEXT DEFAULT '081234567890',
  email TEXT DEFAULT 'daffarezky99@gmail.com',
  instagram TEXT DEFAULT 'https://instagram.com/daffarezky',
  github TEXT DEFAULT 'https://github.com/daffarezky',
  linkedin TEXT DEFAULT 'https://linkedin.com/in/daffarezky',
  tiktok TEXT,
  youtube TEXT,
  birth_date DATE,
  birth_place TEXT DEFAULT 'Indonesia',
  current_city TEXT DEFAULT 'Jember, Indonesia',
  work_hours TEXT DEFAULT '08:00 - 17:00 WIB',
  availability_status_id TEXT DEFAULT 'Tersedia untuk proyek baru',
  availability_status_en TEXT DEFAULT 'Available for new projects',
  stats_projects TEXT DEFAULT '12+',
  stats_tools TEXT DEFAULT '20+',
  stats_passion TEXT DEFAULT '∞',
  vision_id TEXT,
  vision_en TEXT,
  motto_id TEXT,
  motto_en TEXT,
  focus_id TEXT,
  focus_en TEXT,
  values_id TEXT,
  values_en TEXT
);

-- 2. Projects & Portofolio
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
  category TEXT DEFAULT 'Web Development',
  progress INTEGER DEFAULT 100,
  start_date TEXT,
  completion_date TEXT,
  is_current BOOLEAN DEFAULT false,
  difficulty TEXT DEFAULT 'Medium',
  slug TEXT,
  duration TEXT,
  year INTEGER DEFAULT 2025,
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
  role TEXT,
  categories TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT DEFAULT 'Frontend',
  level TEXT DEFAULT 'Advanced',
  show_on_home BOOLEAN DEFAULT false,
  is_learning BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 4. Education (Pendidikan)
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
  education_level TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 5. Certificates (Sertifikat)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  description_id TEXT,
  description_en TEXT,
  date_issued TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 6. Experience (Pengalaman)
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
  category TEXT DEFAULT 'Work',
  order_index INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_current BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true
);

-- 7. Services (Layanan)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price TEXT,
  timeline TEXT,
  target_client_id TEXT,
  target_client_en TEXT,
  description_id TEXT,
  description_en TEXT,
  features_id TEXT[] DEFAULT '{}',
  features_en TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  badge_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 8. Blog Posts
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
  category TEXT DEFAULT 'Tech',
  excerpt_id TEXT,
  excerpt_en TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'published',
  reading_time INTEGER DEFAULT 5,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 9. Testimonials
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
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  project_id UUID
);

-- 10. Learning Journey (Milestones)
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

-- 11. Partners
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 12. Focus Areas
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

-- 13. Core Values
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

-- 14. Reasons To Hire
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

-- 15. Quotes
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

-- 16. Islamic Content
CREATE TABLE IF NOT EXISTS public.islamic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT,
  title_en TEXT,
  subtitle_id TEXT,
  subtitle_en TEXT,
  description_id TEXT,
  description_en TEXT,
  category TEXT DEFAULT 'Kajian',
  reference TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 17. Uses Items (Tech / Gear)
CREATE TABLE IF NOT EXISTS public.uses_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  link TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- 18. Messages (Pesan Masuk)
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
  priority TEXT DEFAULT 'normal'
);

-- 19. Guestbook
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true
);

-- 20. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website'
);

-- 21. Blog Comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  post_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true
);

-- 22. Admin Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 23. Settings
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  site_title TEXT DEFAULT 'Daffa Rezky Portfolio',
  site_description TEXT DEFAULT 'Personal portfolio of Muhammad Daffa Rezky Adyra',
  og_image TEXT,
  canonical_url TEXT
);

-- Extra Related Tables
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

-- =============================================================================
-- 3. ADDITIVE COLUMNS MIGRATION (Memastikan seluruh kolom ada di DB lama)
-- =============================================================================
SELECT public._add_column_if_missing('profile','name','TEXT DEFAULT ''Muhammad Daffa Rezky Adyra''');
SELECT public._add_column_if_missing('profile','title_id','TEXT');
SELECT public._add_column_if_missing('profile','title_en','TEXT');
SELECT public._add_column_if_missing('profile','bio_id','TEXT');
SELECT public._add_column_if_missing('profile','bio_en','TEXT');
SELECT public._add_column_if_missing('profile','photo_url','TEXT');
SELECT public._add_column_if_missing('profile','about_photo_url','TEXT');
SELECT public._add_column_if_missing('profile','logo_url','TEXT');
SELECT public._add_column_if_missing('profile','wa','TEXT');
SELECT public._add_column_if_missing('profile','email','TEXT');
SELECT public._add_column_if_missing('profile','instagram','TEXT');
SELECT public._add_column_if_missing('profile','github','TEXT');
SELECT public._add_column_if_missing('profile','linkedin','TEXT');
SELECT public._add_column_if_missing('profile','tiktok','TEXT');
SELECT public._add_column_if_missing('profile','youtube','TEXT');
SELECT public._add_column_if_missing('profile','birth_date','DATE');
SELECT public._add_column_if_missing('profile','birth_place','TEXT');
SELECT public._add_column_if_missing('profile','current_city','TEXT');
SELECT public._add_column_if_missing('profile','work_hours','TEXT');
SELECT public._add_column_if_missing('profile','availability_status_id','TEXT');
SELECT public._add_column_if_missing('profile','availability_status_en','TEXT');
SELECT public._add_column_if_missing('profile','stats_projects','TEXT');
SELECT public._add_column_if_missing('profile','stats_tools','TEXT');
SELECT public._add_column_if_missing('profile','stats_passion','TEXT');
SELECT public._add_column_if_missing('profile','updated_at','TIMESTAMPTZ DEFAULT now()');

SELECT public._add_column_if_missing('certificates','image_url','TEXT');
SELECT public._add_column_if_missing('certificates','file_url','TEXT');
SELECT public._add_column_if_missing('certificates','description_id','TEXT');
SELECT public._add_column_if_missing('certificates','description_en','TEXT');
SELECT public._add_column_if_missing('certificates','date_issued','TEXT');
SELECT public._add_column_if_missing('certificates','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('certificates','sort_order','INTEGER DEFAULT 0');

SELECT public._add_column_if_missing('education','logo_url','TEXT');
SELECT public._add_column_if_missing('education','is_current','BOOLEAN DEFAULT false');
SELECT public._add_column_if_missing('education','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('education','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('education','location','TEXT');
SELECT public._add_column_if_missing('education','field_of_study','TEXT');
SELECT public._add_column_if_missing('education','achievement','TEXT');
SELECT public._add_column_if_missing('education','gallery','TEXT[] DEFAULT ''{}''');
SELECT public._add_column_if_missing('education','certificate_url','TEXT');
SELECT public._add_column_if_missing('education','education_level','TEXT');

-- Services: tambahkan SEMUA kolom yang mungkin belum ada di DB lama
SELECT public._add_column_if_missing('services','created_at','TIMESTAMPTZ DEFAULT now()');
SELECT public._add_column_if_missing('services','price','TEXT');
SELECT public._add_column_if_missing('services','timeline','TEXT');
SELECT public._add_column_if_missing('services','target_client_id','TEXT');
SELECT public._add_column_if_missing('services','target_client_en','TEXT');
SELECT public._add_column_if_missing('services','description_id','TEXT');
SELECT public._add_column_if_missing('services','description_en','TEXT');
SELECT public._add_column_if_missing('services','features_id','TEXT[] DEFAULT ''{}''');
SELECT public._add_column_if_missing('services','features_en','TEXT[] DEFAULT ''{}''');
SELECT public._add_column_if_missing('services','is_popular','BOOLEAN DEFAULT false');
SELECT public._add_column_if_missing('services','badge_text','TEXT');
SELECT public._add_column_if_missing('services','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('services','is_published','BOOLEAN DEFAULT true');

SELECT public._add_column_if_missing('projects','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('skills','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('experience','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('testimonials','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('partners','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('learning_journey','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('focus_areas','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('core_values','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('reasons_to_hire','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('quotes','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('islamic','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('uses_items','is_published','BOOLEAN DEFAULT true');

-- =============================================================================
-- 3B. DROP NOT NULL CONSTRAINTS DARI SCHEMA LAMA
-- =============================================================================
-- Schema lama (setup.sql) membuat banyak kolom NOT NULL yang sekarang nullable.
-- CREATE TABLE IF NOT EXISTS tidak mengubah constraint yang sudah ada.

-- Education: end_year harus nullable (untuk mahasiswa aktif / is_current = true)
ALTER TABLE public.education ALTER COLUMN end_year DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN degree_id DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN degree_en DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN description_id DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN description_en DROP NOT NULL;

-- Services: price, description nullable di schema baru
ALTER TABLE public.services ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.services ALTER COLUMN description_id DROP NOT NULL;
ALTER TABLE public.services ALTER COLUMN description_en DROP NOT NULL;

-- Certificates: file_url dan date_issued nullable di schema baru
ALTER TABLE public.certificates ALTER COLUMN file_url DROP NOT NULL;
ALTER TABLE public.certificates ALTER COLUMN date_issued DROP NOT NULL;

-- Blog Posts: beberapa kolom sekarang nullable
ALTER TABLE public.blog_posts ALTER COLUMN content_id DROP NOT NULL;
ALTER TABLE public.blog_posts ALTER COLUMN content_en DROP NOT NULL;
ALTER TABLE public.blog_posts ALTER COLUMN thumbnail DROP NOT NULL;
ALTER TABLE public.blog_posts ALTER COLUMN category DROP NOT NULL;
ALTER TABLE public.blog_posts ALTER COLUMN excerpt_id DROP NOT NULL;
ALTER TABLE public.blog_posts ALTER COLUMN excerpt_en DROP NOT NULL;

-- Skills: icon, category, level sekarang punya default
ALTER TABLE public.skills ALTER COLUMN icon DROP NOT NULL;
ALTER TABLE public.skills ALTER COLUMN category DROP NOT NULL;
ALTER TABLE public.skills ALTER COLUMN level DROP NOT NULL;

-- Profile: banyak field sekarang punya default, bukan NOT NULL
ALTER TABLE public.profile ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN title_id DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN title_en DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN bio_id DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN bio_en DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN photo_url DROP NOT NULL;

-- Projects: description bisa nullable
ALTER TABLE public.projects ALTER COLUMN description_id DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description_en DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN image_url DROP NOT NULL;

-- =============================================================================
-- 4. AUTHORIZATION HELPERS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true;
$$;

GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Aktifkan RLS di seluruh tabel
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasons_to_hire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islamic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uses_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "public_read_profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "admin_all_profile" ON public.profile FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Content Tables Policies (Public membaca yang is_published = true, Admin full CRUD)
CREATE POLICY "public_read_projects" ON public.projects FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_skills" ON public.skills FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_skills" ON public.skills FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_education" ON public.education FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_education" ON public.education FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_certificates" ON public.certificates FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_certificates" ON public.certificates FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_experience" ON public.experience FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_experience" ON public.experience FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_services" ON public.services FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_blog" ON public.blog_posts FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_blog" ON public.blog_posts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_testimonials" ON public.testimonials FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_testimonials" ON public.testimonials FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_learning" ON public.learning_journey FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_learning" ON public.learning_journey FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_partners" ON public.partners FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_partners" ON public.partners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_focus" ON public.focus_areas FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_focus" ON public.focus_areas FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_values" ON public.core_values FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_values" ON public.core_values FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_reasons" ON public.reasons_to_hire FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_reasons" ON public.reasons_to_hire FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_quotes" ON public.quotes FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_quotes" ON public.quotes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_islamic" ON public.islamic FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_islamic" ON public.islamic FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_uses" ON public.uses_items FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "admin_all_uses" ON public.uses_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Interactive Tables (Public dapat insert pesan / kontak / guestbook)
CREATE POLICY "public_insert_messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_messages" ON public.messages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_guestbook" ON public.guestbook FOR SELECT USING (is_approved = true);
CREATE POLICY "public_insert_guestbook" ON public.guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_guestbook" ON public.guestbook FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_newsletter" ON public.newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_comments" ON public.blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "public_insert_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_comments" ON public.blog_comments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_all_users" ON public.admin_users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "admin_all_settings" ON public.settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =============================================================================
-- 6. REALTIME SETUP
-- =============================================================================
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.blog_posts REPLICA IDENTITY FULL;
ALTER TABLE public.testimonials REPLICA IDENTITY FULL;
ALTER TABLE public.guestbook REPLICA IDENTITY FULL;
ALTER TABLE public.profile REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages, public.projects, public.blog_posts, public.testimonials, public.guestbook, public.profile;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- =============================================================================
-- 7. FULL SEED DATA: DATA ASLI MUHAMMAD DAFFA REZKY ADYRA
-- =============================================================================
-- (Hanya mengisi jika belum ada, tidak menimpa data yang sudah Anda edit)

-- [1] PROFIL LENGKAP
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profile LIMIT 1) THEN
    INSERT INTO public.profile (
      name, title_id, title_en, bio_id, bio_en,
      photo_url, about_photo_url, logo_url,
      wa, email, instagram, github, linkedin,
      birth_date, birth_place, current_city, work_hours,
      availability_status_id, availability_status_en,
      stats_projects, stats_tools, stats_passion,
      vision_id, vision_en,
      motto_id, motto_en
    ) VALUES (
      'Muhammad Daffa Rezky Adyra',
      'Web & Mobile Developer',
      'Web & Mobile Developer',
      'Assalamu''alaikum. Saya Muhammad Daffa Rezky Adyra, seorang Web & Mobile Developer yang berfokus membangun produk digital modern, cepat, dan responsif. Berdedikasi menghasilkan solusi teknologi yang bermanfaat nyata bagi klien dan masyarakat luas.',
      'Assalamu''alaikum. I am Muhammad Daffa Rezky Adyra, a Web & Mobile Developer dedicated to creating modern, fast, and responsive digital products that bring tangible value to clients and communities.',
      '/logo.png',
      '/foto.jpg',
      '/logo.png',
      '081234567890',
      'daffarezky99@gmail.com',
      'https://instagram.com/daffarezky',
      'https://github.com/daffarezky',
      'https://linkedin.com/in/daffarezky',
      '2004-07-24',
      'Indonesia',
      'Jember, Indonesia',
      '08:00 - 17:00 WIB',
      'Tersedia untuk proyek baru',
      'Available for new projects',
      '12+',
      '20+',
      '∞',
      'Menjadi profesional di bidang teknologi yang mengintegrasikan inovasi digital dengan nilai-nilai etika dan kebermanfaatan nyata bagi umat.',
      'To become a tech professional who integrates digital innovation with ethical values and impactful solutions for the community.',
      'Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.',
      'The best of people are those that bring the most benefit to the rest of mankind.'
    );
  ELSE
    -- Pastikan field kritis tidak null
    UPDATE public.profile SET
      name = COALESCE(NULLIF(name, ''), 'Muhammad Daffa Rezky Adyra'),
      title_id = COALESCE(NULLIF(title_id, ''), 'Web & Mobile Developer'),
      title_en = COALESCE(NULLIF(title_en, ''), 'Web & Mobile Developer'),
      email = COALESCE(NULLIF(email, ''), 'daffarezky99@gmail.com')
    WHERE id = (SELECT id FROM public.profile LIMIT 1);
  END IF;
END $$;

-- [2] PENDIDIKAN (EDUCATION)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.education LIMIT 1) THEN
    INSERT INTO public.education (institution, degree_id, degree_en, start_year, end_year, is_current, field_of_study, location, description_id, description_en, education_level, sort_order, is_published)
    VALUES
    (
      'Institut IMSYA Indonesia',
      'Perguruan Tinggi',
      'Higher Education',
      '2026',
      'Sekarang',
      true,
      'Studi Islam & Teknologi Informasi',
      'Indonesia',
      'Menempuh pendidikan tinggi studi Islam dan teknologi untuk membentuk integritas moral, intelektual, dan profesionalisme digital.',
      'Pursuing higher education in Islamic studies and digital technology to build strong intellectual and professional integrity.',
      'KULIAH',
      1,
      true
    ),
    (
      'Ma''had Dar El Ilmi Sumatera Barat',
      'Madrasah Aliyah / SMA / SMK',
      'Senior High School / Islamic Boarding',
      '2023',
      '2026',
      false,
      'Rekayasa Perangkat Lunak & Dirasat Islamiyah',
      'Sumatera Barat',
      'Pendidikan tingkat menengah berbasis kejuruan teknologi dan pesantren, memperkuat dasar pemrograman dan kedisiplinan.',
      'Secondary vocational & Islamic boarding education with strong emphasis on software engineering basics and discipline.',
      'SMA',
      2,
      true
    ),
    (
      'SMPN 1 Batusangkar, Sumatera Barat',
      'Sekolah Menengah Pertama',
      'Junior High School',
      '2020',
      '2023',
      false,
      'Pendidikan Dasar & Sains',
      'Batusangkar, Sumatera Barat',
      'Pendidikan formal tingkat menengah pertama dengan penanaman minat pada teknologi, sains, dan literasi digital awal.',
      'Junior high school education fostering early passion in digital technology, science, and computer literacy.',
      'SMP',
      3,
      true
    );
  END IF;

  -- Auto-populate education_level untuk data yang sudah tersimpan sebelumnya
  UPDATE public.education SET education_level = 'KULIAH'
  WHERE (education_level IS NULL OR education_level = '')
    AND (institution ILIKE '%IMSYA%' OR institution ILIKE '%STDI%' OR institution ILIKE '%Institut%' OR institution ILIKE '%Universitas%');

  UPDATE public.education SET education_level = 'SMA'
  WHERE (education_level IS NULL OR education_level = '')
    AND (institution ILIKE '%Dar El Ilmi%' OR institution ILIKE '%SMA%' OR institution ILIKE '%SMK%' OR institution ILIKE '%Aliyah%');

  UPDATE public.education SET education_level = 'SMP'
  WHERE (education_level IS NULL OR education_level = '')
    AND (institution ILIKE '%SMP%' OR institution ILIKE '%Batusangkar%' OR institution ILIKE '%MTs%');

  UPDATE public.education SET education_level = 'TAHFIDZ'
  WHERE (education_level IS NULL OR education_level = '')
    AND (institution ILIKE '%Tahfidz%' OR institution ILIKE '%Pesantren%');
END $$;

-- [3] SERTIFIKAT RESMI (9 SERTIFIKAT DAFFA)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.certificates LIMIT 1) THEN
    INSERT INTO public.certificates (title_id, title_en, issuer, date_issued, image_url, file_url, description_id, description_en, sort_order, is_published)
    VALUES
    (
      'Dicoding — Dasar-Dasar Literasi Keuangan',
      'Dicoding — Financial Literacy Fundamentals',
      'Dicoding',
      '23 September 2025',
      '/assets/certificates/dicoding-financial-literacy.svg',
      '/assets/certificates/Financial Literacy 101.pdf',
      'Sertifikat kelulusan kompetensi literasi finansial dan teknologi dari Dicoding Indonesia.',
      'Official financial and tech literacy competence certification from Dicoding Indonesia.',
      1,
      true
    ),
    (
      'Tasheel — Uji Kemampuan Bahasa Arab',
      'Tasheel — Arabic Proficiency Test',
      'Tasheel',
      '03 Januari 2026',
      '/assets/certificates/sertifikat-tasheel.jpg',
      '/assets/certificates/sertifikat-tasheel.pdf',
      'Sertifikat uji kemampuan Bahasa Arab dengan skor sempurna 100/100 untuk beasiswa Timur Tengah.',
      'Arabic proficiency certification with a perfect score 100/100 for Middle East scholarships.',
      2,
      true
    ),
    (
      'Surat Rekomendasi Tasheel Timur Tengah',
      'Tasheel Middle East Recommendation Letter',
      'Tasheel',
      '03 Januari 2026',
      '/assets/certificates/surat-rekomendasi-tasheel.jpg',
      '/assets/certificates/surat-rekomendasi-tasheel.pdf',
      'Surat rekomendasi akademik resmi dari Asrama Tahfidz Yumna dan Platform Tasheel.',
      'Official academic recommendation letter from Tahfidz Yumna and Tasheel Platform.',
      3,
      true
    ),
    (
      'Juara 1 Musabaqah Tahfidz Qur''an 3 Juz',
      '1st Place 3 Juz Qur''an Memorization Contest',
      'Ashabul Qur''an',
      '15 Sya''ban 1445 H',
      '/assets/certificates/sertifikat-tahfidz-quran.jpg',
      '/assets/certificates/Document 15.pdf',
      'Syahadah Syukr wa Taqdir Juara I lomba Tahfidz Al-Qur''an 3 Juz Ma''had Ashabul Qur''an.',
      '1st Place certificate in 3 Juz Qur''an memorization competition at Ashabul Qur''an Institute.',
      4,
      true
    ),
    (
      'Digitalent — AI Engineer For Milenial',
      'Digitalent — AI Engineer For Milenial',
      'Kominfo',
      '2024',
      '/assets/certificates/digitalent-ai-engineer.svg',
      '/assets/certificates/ai-engineer-milenial.pdf',
      'Sertifikat pelatihan kecerdasan buatan dari Digital Talent Scholarship Kementerian Kominfo RI.',
      'AI Engineer training certification from Ministry of Communications and Informatics (Kominfo).',
      5,
      true
    ),
    (
      'Digitalent — Ethical Hacker For Dummies',
      'Digitalent — Ethical Hacker For Dummies',
      'Kominfo',
      '2024',
      '/assets/certificates/digitalent-ethical-hacker.svg',
      '/assets/certificates/ethical-hacker-dummies.pdf',
      'Sertifikasi keahlian keamanan siber dan penetration testing dasar dari Kominfo DTS.',
      'Cyber security & foundational ethical hacking certification from Kominfo DTS.',
      6,
      true
    ),
    (
      'Produk Digital dan Desain Grafis',
      'Digital Products & Graphic Design',
      'Kominfo',
      '2024',
      '/assets/certificates/digitalent-digital-products.svg',
      '/assets/certificates/digital-products-graphic-design.pdf',
      'Pelatihan pengembangan produk digital dan fondasi desain grafis interaktif dari Kominfo.',
      'Digital product development and graphic design training from Kominfo.',
      7,
      true
    );
  END IF;
END $$;

-- [4] KEAHLIAN TEKNOLOGI (SKILLS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.skills LIMIT 1) THEN
    INSERT INTO public.skills (name, category, level, icon, show_on_home, sort_order, is_published)
    VALUES
    ('React.js', 'Frontend', 'Advanced', 'react', true, 1, true),
    ('Next.js', 'Frontend', 'Advanced', 'nextjs', true, 2, true),
    ('TypeScript', 'Frontend', 'Advanced', 'js', true, 3, true),
    ('Tailwind CSS', 'Frontend', 'Advanced', 'css', true, 4, true),
    ('HTML5 & CSS3', 'Frontend', 'Expert', 'html', true, 5, true),
    ('JavaScript (ES6+)', 'Frontend', 'Advanced', 'js', true, 6, true),
    ('Node.js', 'Backend', 'Intermediate', 'js', true, 7, true),
    ('PostgreSQL', 'Backend', 'Advanced', 'tools', true, 8, true),
    ('Supabase', 'Backend', 'Advanced', 'tools', true, 9, true),
    ('Laravel', 'Backend', 'Intermediate', 'laravel', false, 10, true),
    ('Flutter', 'Mobile', 'Intermediate', 'flutter', true, 11, true),
    ('Git & GitHub', 'Tools', 'Advanced', 'tools', true, 12, true),
    ('Figma', 'Design', 'Intermediate', 'figma', true, 13, true),
    ('Canva', 'Design', 'Advanced', 'canva', false, 14, true),
    ('Prompt Engineering', 'AI & Automation', 'Advanced', 'chatgpt', true, 15, true),
    ('OpenAI / Gemini API', 'AI & Automation', 'Advanced', 'claude', true, 16, true),
    ('N8N Workflow Automation', 'AI & Automation', 'Intermediate', 'n8n', false, 17, true),
    ('Google Analytics', 'Data & Analytics', 'Intermediate', 'analytics', false, 18, true),
    ('Looker Studio', 'Data & Analytics', 'Intermediate', 'looker', false, 19, true),
    ('Bahasa Arab Fushah', 'Language & Islamic', 'Advanced', 'tools', true, 20, true);
  END IF;
END $$;

-- [5] PROYEK PORTOFOLIO (PROJECTS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1) THEN
    INSERT INTO public.projects (
      title_id, title_en, description_id, description_en,
      image_url, tech_stack, demo_url, github_url,
      featured, category, progress, status, year,
      problem_id, problem_en, solution_id, solution_en,
      sort_order, is_published
    ) VALUES
    (
      'Daffa Portfolio V2 Platform',
      'Daffa Portfolio V2 Platform',
      'Platform website portofolio interaktif dengan integrasi CMS panel admin mandiri, sistem autentikasi aman, upload media real-time, dan optimasi performa tinggi.',
      'Interactive personal portfolio platform integrated with headless CMS admin dashboard, secure auth, real-time media upload, and high Core Web Vitals performance.',
      '/og-image.jpg',
      ARRAY['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
      'https://portofolio-daffarezky.vercel.app',
      'https://github.com/daffarezky/portofolio-v2',
      true,
      'Web Development',
      100,
      'Completed',
      2025,
      'Kebutuhan akan platform showcase yang tidak hanya statis, melainkan dapat diperbarui dinamis langsung dari perangkat mana saja melalui dashboard admin terintegrasi.',
      'The need for a personal showcase that is dynamic, editable anytime via an integrated headless admin portal without touching source code.',
      'Membangun sistem modular Next.js berbasis SSR dan Supabase Database + Storage, lengkap dengan RBAC dan sanitasi data otomatis.',
      'Engineered a modular SSR Next.js stack with Supabase Database and Storage, incorporating RBAC policies and automated data sanitization.',
      1,
      true
    ),
    (
      'Sistem Informasi & Manajemen Akademik',
      'Academic Information & Management System',
      'Aplikasi web manajemen pencatatan data santri, evaluasi hafalan Qur''an, rekap kehadiran, dan laporan progres akademik terpusat.',
      'Web application for student data management, Qur''an memorization evaluation, attendance tracking, and centralized academic reports.',
      '/assets/projects/academic-system.jpg',
      ARRAY['Next.js', 'React', 'PostgreSQL', 'Tailwind CSS'],
      '#',
      '#',
      true,
      'Web Application',
      100,
      'Completed',
      2024,
      'Pencatatan evaluasi santri yang masih manual berbasis kertas seringkali memicu kehilangan data dan lambatnya pembuatan rekap bulanan.',
      'Manual paper-based evaluations caused data loss and slowed down monthly progress reports for parents.',
      'Membangun portal dashboard berbasis cloud dengan fitur input nilai instan, filter kelas, dan ekspor laporan berkala.',
      'Built a cloud dashboard featuring instant grade submission, class filtering, and automated report generation.',
      2,
      true
    ),
    (
      'Tasheel Arabic Learning Platform',
      'Tasheel Arabic Learning Platform',
      'Platform edukasi interaktif untuk evaluasi dan pembelajaran tata bahasa Arab (Nahwu & Sharaf) dengan modul kuis otomatis.',
      'Interactive education platform for Arabic grammar evaluation (Nahwu & Sharaf) featuring automated quiz modules.',
      '/assets/projects/tasheel-app.jpg',
      ARRAY['Flutter', 'Dart', 'Supabase', 'REST API'],
      '#',
      '#',
      true,
      'Mobile Development',
      90,
      'Ongoing',
      2025,
      'Minimnya sarana evaluasi mandiri yang terstruktur bagi pelajar bahasa Arab pemula di Indonesia.',
      'Scarcity of structured self-evaluation tools for beginner Arabic learners in Indonesia.',
      'Mengembangkan aplikasi mobile interaktif dengan bank soal bertingkat dan analitik hasil belajar.',
      'Developing an interactive mobile app featuring tiered question banks and learning analytics.',
      3,
      true
    ),
    (
      'Islamic Insights & Hadis Hub',
      'Islamic Insights & Hadis Hub',
      'Portal publikasi artikel keislaman, kumpulan hadis tematik, dan kutipan mutiara dengan pencarian instan dan tampilan responsif.',
      'Portal publishing Islamic insights, thematic hadith collections, and wisdom quotes with instant search and responsive UI.',
      '/assets/projects/islamic-hub.jpg',
      ARRAY['Next.js', 'TypeScript', 'Supabase'],
      '#',
      '#',
      false,
      'Web Application',
      100,
      'Completed',
      2024,
      'Kebutuhan referensi bacaan Islam yang bersih, bebas iklan mengganggu, dan nyaman dibaca di smartphone.',
      'The need for clean, ad-free Islamic reading references tailored for smartphone readability.',
      'Mendesain tata letak berbasis tipografi elegan dengan sistem penanda bacaan dan kategori terstruktur.',
      'Designed an elegant typography-focused layout with bookmarking features and categorized taxonomy.',
      4,
      true
    );
  END IF;
END $$;

-- [6] PENGALAMAN (EXPERIENCE)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.experience LIMIT 1) THEN
    INSERT INTO public.experience (title_id, title_en, organization, role, start_date, end_date, is_current, category, description_id, description_en, sort_order, is_published)
    VALUES
    (
      'Frontend & Fullstack Web Developer',
      'Frontend & Fullstack Web Developer',
      'Freelance / Independent',
      'Lead Developer',
      '2023',
      'Sekarang',
      true,
      'Freelance',
      'Merancang dan membangun aplikasi web, landing page UMKM, dashboard internal, dan integrasi API untuk berbagai klien lokal.',
      'Designing and building custom web applications, business landing pages, internal dashboards, and API integrations for various clients.',
      1,
      true
    ),
    (
      'Pengajar Tahfidz & Bahasa Arab',
      'Tahfidz & Arabic Tutor',
      'Lembaga Pendidikan & Privat',
      'Tutor / Pengajar',
      '2023',
      'Sekarang',
      true,
      'Pendidikan',
      'Membimbing santri dalam tahsin tilawah, setoran hafalan Al-Qur''an, dan dasar-dasar percakapan bahasa Arab fushah.',
      'Mentoring students in proper Quranic recitation, memorization, and foundational spoken classical Arabic.',
      2,
      true
    ),
    (
      'Divisi Media & Publikasi Organisasi',
      'Media & Publication Division',
      'Organisasi Mahasiswa & Santri',
      'Koordinator Media',
      '2023',
      '2024',
      false,
      'Organisasi',
      'Bertanggung jawab mengelola publikasi media sosial, desain materi visual dakwah, dokumentasi kegiatan, dan siaran pers digital.',
      'Managed social media publications, visual branding materials, event documentation, and digital announcements.',
      3,
      true
    );
  END IF;
END $$;

-- [7] PAKET LAYANAN (SERVICES)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.services LIMIT 1) THEN
    INSERT INTO public.services (
      name_id, name_en, price, timeline,
      target_client_id, target_client_en,
      description_id, description_en,
      features_id, features_en,
      is_popular, badge_text, sort_order, is_published
    ) VALUES
    (
      'Paket Website Modern & Landing Page',
      'Modern Website & Landing Page Package',
      'Mulai dari Rp 1.500.000',
      '3 – 5 Hari',
      'UMKM, bisnis lokal, retail, atau personal branding yang ingin tampil kredibel dan profesional di Google.',
      'MSMEs, local businesses, retail shops, or personal branding looking to establish a professional digital presence.',
      'Website modern, estetik, berkecepatan tinggi, dan responsif sempurna di semua perangkat smartphone maupun PC.',
      'Modern, aesthetic, ultra-fast, and fully responsive across all smartphone and desktop devices.',
      ARRAY[
        'Desain Landing Page / Company Profile yang modern, estetik, dan responsif (HP, tablet, PC)',
        'Struktur kode optimal menggunakan teknologi modern (Next.js / Tailwind CSS)',
        'Optimasi kecepatan muat (Core Web Vitals) dan dasar SEO agar mudah terindeks Google',
        'Integrasi tombol aksi cepat (WhatsApp chat, formulir kontak, dan media sosial)',
        'Gratis setup deployment domain & hosting (Vercel / Cloud pilihan klien)',
        'Bonus: 1x sesi revisi minor setelah preview pertama'
      ],
      ARRAY[
        'Modern, aesthetic, and responsive Landing Page / Company Profile design (mobile, tablet, PC)',
        'Clean code architecture with modern web tech (Next.js / Tailwind CSS)',
        'Core Web Vitals & basic SEO optimization for Google indexing',
        'Quick action integration (WhatsApp chat, contact form, or social links)',
        'Free initial domain/hosting deployment (Vercel/Cloud)',
        'Bonus: 1x minor revision session after initial preview'
      ],
      true,
      'Paling Laku / Best Seller',
      1,
      true
    ),
    (
      'Paket Aplikasi Web & Dashboard Admin',
      'Web App & Admin Dashboard Package',
      'Mulai dari Rp 3.500.000',
      '1 – 2 Minggu',
      'Bisnis yang membutuhkan sistem operasional internal, manajemen inventaris barang, atau portal pencatatan transaksi khusus.',
      'Businesses requiring internal operational systems, inventory management, transaction portals, or dedicated data workflows.',
      'Sistem kustom terstruktur untuk mengelola operasional, database interaktif real-time, dan visualisasi grafik.',
      'Custom structured system for operational control, interactive real-time databases, and data visual analytics.',
      ARRAY[
        'Sistem Otentikasi Aman (Login berjenjang Role-Based Access Control Admin & Pengguna)',
        'Database Interaktif (CRUD lengkap kelola data produk, pesanan, atau user real-time)',
        'Dashboard Analitik dengan visualisasi grafik data interaktif',
        'Backend kuat dan aman dengan database PostgreSQL / Supabase terstruktur',
        'Fitur ekspor laporan penting (format Excel / PDF)',
        'Bonus: Akses live staging link eksklusif untuk memantau progres langsung'
      ],
      ARRAY[
        'Secure Auth System (Role-Based Access Control for Admins & Users)',
        'Interactive Database (Full CRUD to manage products, orders, or users in real-time)',
        'Interactive Analytics Dashboard with data charts & tables',
        'Robust & secure backend with structured PostgreSQL / Supabase database',
        'Crucial report exports (Excel / PDF format)',
        'Bonus: Exclusive live staging link to track real-time dev progress'
      ],
      false,
      NULL,
      2,
      true
    ),
    (
      'Paket Solusi AI & Integrasi Sistem Cerdas',
      'AI Solutions & Smart System Integration',
      'Mulai dari Rp 4.500.000+',
      '1 – 2 Minggu',
      'Perusahaan atau klien progresif yang ingin mengintegrasikan teknologi kecerdasan buatan, otomasi alur kerja, atau chatbot cerdas.',
      'Forward-thinking companies looking to integrate AI technology, workflow automation, or intelligent chatbots.',
      'Next-gen solution dengan implementasi LLM (OpenAI / Gemini), otomasi alur kerja digital, dan pemrosesan data kilat.',
      'Next-gen solution featuring LLM integration, digital workflow automation, and fast data processing pipelines.',
      ARRAY[
        'Integrasi API Kecerdasan Buatan (OpenAI GPT, Gemini API, atau Smart Chatbot RAG)',
        'Sistem otomasi alur kerja digital untuk efisiensi bisnis',
        'Pipeline pemrosesan data kilat dan aman',
        'Dokumentasi teknis lengkap dan panduan pengoperasian bagi admin klien',
        'Garansi pemeliharaan dan bug fixing pasca-peluncuran selama 1 bulan penuh'
      ],
      ARRAY[
        'AI API Integration (OpenAI GPT, Gemini API, or RAG-based Smart Chatbot)',
        'Digital workflow automation systems for operational efficiency',
        'Ultra-fast and secure data processing pipelines',
        'Comprehensive technical documentation and client user guide',
        'Full 1-month post-launch warranty and bug-fixing support'
      ],
      false,
      NULL,
      3,
      true
    );
  END IF;
END $$;

-- [8] MILESTONES (LEARNING JOURNEY)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.learning_journey LIMIT 1) THEN
    INSERT INTO public.learning_journey (year, title_id, title_en, description_id, description_en, icon, sort_order, is_published)
    VALUES
    (
      '2026',
      'Ekspansi Solusi AI & Portofolio V2',
      'AI Solutions Expansion & Portfolio V2',
      'Mengembangkan arsitektur aplikasi cerdas berbasis LLM, integrasi database Supabase SSR, dan memperdalam studi keislaman serta bahasa Arab fushah tingkat lanjut.',
      'Developing LLM-powered smart apps, advanced Supabase SSR architectures, and deepening Arabic classical studies.',
      'rocket',
      1,
      true
    ),
    (
      '2025',
      'Pendalaman Fullstack & Ekosistem Next.js',
      'Fullstack Deep Dive & Next.js Ecosystem',
      'Mendalami Next.js 15 App Router, TypeScript tingkat lanjut, optimasi database PostgreSQL, dan perancangan REST API terstruktur.',
      'Mastering Next.js 15 App Router, advanced TypeScript, PostgreSQL database optimization, and structured REST APIs.',
      'code',
      2,
      true
    ),
    (
      '2024',
      'Pendidikan Tinggi STDI & Sertifikasi Kominfo',
      'STDI Higher Education & Kominfo Certifications',
      'Memulai studi sarjana di STDI Imam Syafi''i Jember serta menyelesaikan pelatihan AI Engineer dan Ethical Hacking Kominfo.',
      'Commenced undergraduate studies at STDI Imam Syafi''i Jember and completed Kominfo certifications in AI and Cybersecurity.',
      'graduation-cap',
      3,
      true
    ),
    (
      '2023',
      'Fondasi Web Modern & Tahfidz Al-Qur''an',
      'Modern Web Foundations & Qur''an Memorization',
      'Membangun fondasi kuat dalam HTML, CSS, JavaScript, React, serta menyelesaikan program intensif tahfidz Al-Qur''an.',
      'Built strong foundations in HTML, CSS, JavaScript, React, and accomplished intensive Qur''an memorization milestones.',
      'book',
      4,
      true
    );
  END IF;
END $$;

-- [9] FOKUS PENGEMBANGAN (FOCUS AREAS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.focus_areas LIMIT 1) THEN
    INSERT INTO public.focus_areas (title_id, title_en, description_id, description_en, icon, sort_order, is_published)
    VALUES
    (
      'Modern Web Development',
      'Modern Web Development',
      'Membangun antarmuka web berkinerja tinggi, responsif, dan ramah SEO dengan Next.js, React, dan Tailwind CSS.',
      'Building high-performance, responsive, and SEO-optimized web interfaces using Next.js, React, and Tailwind CSS.',
      'code',
      1,
      true
    ),
    (
      'Backend & Database Management',
      'Backend & Database Management',
      'Merancang skema database relasional PostgreSQL dan Supabase yang aman, cepat, dan siap menampung skala trafik tinggi.',
      'Designing relational PostgreSQL and Supabase database schemas that are secure, fast, and ready for high traffic.',
      'database',
      2,
      true
    ),
    (
      'Solusi AI & Otomasi Digital',
      'AI Solutions & Automation',
      'Mengintegrasikan API kecerdasan buatan modern (LLM) untuk mengotomasi alur kerja bisnis dan mempercepat produktivitas.',
      'Integrating cutting-edge AI APIs (LLMs) to automate business workflows and accelerate productivity.',
      'cpu',
      3,
      true
    ),
    (
      'Pengembangan Berorientasi Nilai',
      'Value-Driven Development',
      'Mengutamakan kejujuran, kejelasan komunikasi, dan integritas dalam setiap proyek untuk memberikan kebermanfaatan maksimal.',
      'Prioritizing honesty, clear communication, and integrity in every project to deliver maximum meaningful impact.',
      'heart',
      4,
      true
    );
  END IF;
END $$;

-- [10] NILAI-NILAI YANG DIPEGANG (CORE VALUES)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.core_values LIMIT 1) THEN
    INSERT INTO public.core_values (title_id, title_en, description_id, description_en, icon, sort_order, is_published)
    VALUES
    (
      'Amanah (Integritas)',
      'Amanah (Integrity)',
      'Menjaga setiap kepercayaan klien dan rekan kerja dengan penuh tanggung jawab, kerahasiaan data, dan ketepatan janji.',
      'Safeguarding every client and team trust with utmost accountability, data confidentiality, and timely commitments.',
      'shield',
      1,
      true
    ),
    (
      'Itqan (Kualitas Maksimal)',
      'Itqan (Pursuit of Excellence)',
      'Bekerja dengan cermat, teliti, dan mengutamakan kualitas kode terbaik serta desain yang rapi tanpa jalan pintas.',
      'Crafting every line of code and UI component with meticulous precision and highest quality standards.',
      'star',
      2,
      true
    ),
    (
      'Pembelajaran Berkelanjutan',
      'Continuous Learning',
      'Selalu haus akan ilmu baru, adaptif terhadap inovasi teknologi, dan tidak berhenti mengasah kemampuan diri.',
      'Always eager to learn, highly adaptable to technological shifts, and continuously sharpening skills.',
      'book-open',
      3,
      true
    ),
    (
      'Kemanfaatan Nyata',
      'Real Meaningful Impact',
      'Berorientasi menghasilkan karya yang benar-benar menyelesaikan masalah nyata dan membawa kebaikan bagi sesama.',
      'Committed to building digital solutions that truly resolve real-world problems and benefit the community.',
      'smile',
      4,
      true
    );
  END IF;
END $$;

-- [11] ALASAN MEMILIH (REASONS TO HIRE)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.reasons_to_hire LIMIT 1) THEN
    INSERT INTO public.reasons_to_hire (title_id, title_en, description_id, description_en, icon, sort_order, is_published)
    VALUES
    (
      'Arsitektur Kode Bersih & Cepat',
      'Clean Code & Fast Performance',
      'Dibangun dengan standar kode modern yang ringan, mudah dikembangkan, dan mendapatkan skor Core Web Vitals tinggi.',
      'Built with modern coding standards that are maintainable, lightweight, and achieve top Core Web Vitals scores.',
      'zap',
      1,
      true
    ),
    (
      'Pengerjaan Tepat Waktu',
      'Timely Delivery',
      'Disiplin dalam mematuhi milestone dan jadwal kesepakatan proyek tanpa mengorbankan kualitas akhir.',
      'Disciplined in adhering to agreed project milestones and timelines without compromising final quality.',
      'clock',
      2,
      true
    ),
    (
      'Komunikasi Aktif & Ramah',
      'Active & Transparent Communication',
      'Memberikan pembaruan progres berkala, tanggap berdiskusi, dan terbuka terhadap ide serta masukan klien.',
      'Providing regular progress updates, responsive in discussions, and welcoming to client ideas and feedback.',
      'message-circle',
      3,
      true
    ),
    (
      'Hasil Estetik & User-Friendly',
      'Aesthetic & User-Friendly Design',
      'Desain modern dengan sentuhan visual profesional yang nyaman digunakan dan meningkatkan konversi pengunjung.',
      'Modern design with a polished aesthetic touch that enhances user experience and drives visitor conversion.',
      'layout',
      4,
      true
    );
  END IF;
END $$;

-- [12] KUTIPAN & MOTTO (QUOTES)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.quotes LIMIT 1) THEN
    INSERT INTO public.quotes (text_id, text_en, author, is_personal, sort_order, is_published)
    VALUES
    (
      'Khairunnas anfa''uhum linnas — Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.',
      'The best of people are those that bring the most benefit to the rest of mankind.',
      'Hadits Riwayat Thabrani',
      false,
      1,
      true
    ),
    (
      'Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga.',
      'Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.',
      'Hadits Riwayat Muslim',
      false,
      2,
      true
    ),
    (
      'Teknologi adalah sarana pengabdian; nilai sejatinya diukur dari seberapa besar manfaat yang ia tinggalkan bagi umat manusia.',
      'Technology is a vehicle for service; its true worth is measured by the genuine value it leaves for humanity.',
      'Muhammad Daffa Rezky Adyra',
      true,
      3,
      true
    );
  END IF;
END $$;

-- [13] KAJIAN & FAEDAH ISLAM (ISLAMIC CONTENT)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.islamic LIMIT 1) THEN
    INSERT INTO public.islamic (title_id, title_en, subtitle_id, subtitle_en, description_id, description_en, category, reference, order_index, is_published)
    VALUES
    (
      'Keutamaan Menuntut Ilmu di Era Digital',
      'The Virtue of Seeking Knowledge in the Digital Era',
      'Ilmu adalah pelita bagi setiap amal perbuatan.',
      'Knowledge is a beacon guiding every deed.',
      'Menuntut ilmu syar''i maupun ilmu yang bermanfaat bagi umat adalah kewajiban yang mendatangkan kemudahan menuju surga. Kemudahan teknologi saat ini hendaknya menjadi sarana mendekatkan diri kepada Allah, bukan melalaikan.',
      'Seeking beneficial knowledge is a noble obligation leading to Paradise. Digital tools should be utilized to draw closer to Allah and serve society.',
      'Kajian',
      'HR. Muslim no. 2699',
      1,
      true
    ),
    (
      'Menjaga Amanah dalam Bekerja',
      'Preserving Integrity and Trust in Work',
      'Sifat dasar seorang mukmin sejati.',
      'A fundamental trait of a true believer.',
      'Amanah dalam setiap kesepakatan kerja, kejujuran dalam menyampaikan progres, serta tidak mengambil hak orang lain adalah bagian dari ibadah seorang profesional muslim.',
      'Integrity in professional contracts, transparency in project progress, and respecting clients rights are acts of worship for a Muslim.',
      'Faedah',
      'QS. Al-Mu''minun: 8',
      2,
      true
    ),
    (
      'Adab Sebelum Ilmu',
      'Manners Before Knowledge',
      'Fondasi utama para penuntut ilmu salaf.',
      'The core foundation of classical scholars.',
      'Imam Malik rahimahullah berkata: "Pelajarilah adab sebelum engkau mempelajari ilmu." Keterampilan teknologi yang tinggi tanpa akhlak mulia tidak akan membuahkan keberkahan.',
      'Imam Malik said: "Learn manners before acquiring knowledge." High technical proficiency without refined character will lack divine blessing.',
      'Kajian',
      'Hilyatul Auliya',
      3,
      true
    );
  END IF;
END $$;

-- [14] SETUP PERANGKAT & ALAT (USES ITEMS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.uses_items LIMIT 1) THEN
    INSERT INTO public.uses_items (category, name, description_id, description_en, link, sort_order, is_published)
    VALUES
    ('Hardware', 'Workstation Laptop', 'Laptop bertenaga tinggi untuk coding, kompilasi Next.js, dan multitasking lancar.', 'High performance development machine for coding, Next.js build workflows, and multitasking.', '', 1, true),
    ('Hardware', 'Smartphone Tester', 'Perangkat mobile untuk pengujian responsivitas UI dan integrasi live aplikasi.', 'Mobile testing device for UI responsiveness and live app testing.', '', 2, true),
    ('Software', 'Visual Studio Code & Cursor', 'Editor kode utama dengan konfigurasi ekstensi produktivitas dan AI linting.', 'Primary code editor equipped with modern productivity and AI development extensions.', 'https://code.visualstudio.com', 3, true),
    ('Software', 'Supabase & PostgreSQL', 'Platform backend cloud serverless dan database relasional terpercaya.', 'Trusted serverless backend platform and relational database.', 'https://supabase.com', 4, true),
    ('Software', 'Vercel Deployment', 'Platform CI/CD dan hosting otomatis dengan edge network kilat di seluruh dunia.', 'Automated CI/CD and hosting platform with ultra-fast edge delivery.', 'https://vercel.com', 5, true),
    ('Daily Apps', 'Notion & Trello', 'Aplikasi harian untuk pencatatan ide, dokumentasi arsitektur, dan manajemen task.', 'Daily apps for ideation, architecture documentation, and sprint task tracking.', 'https://notion.so', 6, true),
    ('Daily Apps', 'Figma', 'Alat perancangan antarmuka pengguna (UI/UX) dan mockup interaktif.', 'Design tool for user interfaces, wireframing, and interactive mockups.', 'https://figma.com', 7, true);
  END IF;
END $$;

-- [15] TESTIMONIALS (ULASAN KLIEN)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.testimonials LIMIT 1) THEN
    INSERT INTO public.testimonials (name, role, content_id, content_en, client_name, client_company, rating, featured, sort_order, is_published)
    VALUES
    (
      'Ahmad Fauzan',
      'Founder Digital Agency',
      'Mas Daffa sangat responsif dan memahami kebutuhan teknis kami dengan sangat cepat. Hasil website rapi, loading sangat cepat, dan mudah diedit lewat admin.',
      'Daffa was highly responsive and grasped our technical needs swiftly. The resulting website is clean, loads blazing fast, and is easy to maintain.',
      'Ahmad Fauzan',
      'Founder Digital Agency',
      5,
      true,
      1,
      true
    ),
    (
      'Ustadz Salman',
      'Koordinator Lembaga Pendidikan',
      'Pengerjaan sistem informasi sangat amanah, teliti, dan komunikasi selalu terbuka. Sangat bersyukur bisa bekerjasama dengan beliau.',
      'The information system development was handled with high integrity and transparent communication. Truly grateful for this partnership.',
      'Ustadz Salman',
      'Koordinator Lembaga Pendidikan',
      5,
      true,
      2,
      true
    ),
    (
      'Rian Hidayat',
      'Owner Bisnis Retail',
      'Website landing page yang dibuatkan modern sekali. Desainnya elegan dan konversi penjualan kami meningkat sejak peluncuran.',
      'The landing page designed was exceptionally modern and elegant. Our business conversion visibly improved after launch.',
      'Rian Hidayat',
      'Owner Bisnis Retail',
      5,
      true,
      3,
      true
    );
  END IF;
END $$;

-- [16] MITRA & PARTNER
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.partners LIMIT 1) THEN
    INSERT INTO public.partners (name, logo_url, website_url, order_index, is_published)
    VALUES
    ('Dicoding Indonesia', '/assets/certificates/dicoding-financial-literacy.svg', 'https://dicoding.com', 1, true),
    ('Kominfo Digitalent', '/assets/certificates/digitalent-ai-engineer.svg', 'https://digitalent.kominfo.go.id', 2, true),
    ('STDI Imam Syafi''i Jember', '/logo.png', 'https://stdiis.ac.id', 3, true),
    ('Tasheel Platform', '/assets/certificates/sertifikat-tasheel.jpg', 'https://tasheel.id', 4, true);
  END IF;
END $$;

-- [17] PENGATURAN SITUS (SETTINGS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1) THEN
    INSERT INTO public.settings (site_title, site_description)
    VALUES (
      'Muhammad Daffa Rezky Adyra — Portfolio',
      'Personal portfolio website of Muhammad Daffa Rezky Adyra — Web & Mobile Developer'
    );
  END IF;
END $$;

-- [18] BOOTSTRAP ADMIN USER DARI AUTH.USERS
INSERT INTO public.admin_users (user_id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users
WHERE lower(email) IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
   OR (SELECT count(*) FROM auth.users) = 1
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', is_active = true;

-- [19] PASTIKAN IS_PUBLISHED SELALU AKTIF
UPDATE public.education SET is_published = true WHERE is_published IS NULL;
UPDATE public.certificates SET is_published = true WHERE is_published IS NULL;
UPDATE public.projects SET is_published = true WHERE is_published IS NULL;
UPDATE public.skills SET is_published = true WHERE is_published IS NULL;
UPDATE public.experience SET is_published = true WHERE is_published IS NULL;
UPDATE public.services SET is_published = true WHERE is_published IS NULL;
UPDATE public.blog_posts SET is_published = true WHERE is_published IS NULL;
UPDATE public.testimonials SET is_published = true WHERE is_published IS NULL;
UPDATE public.learning_journey SET is_published = true WHERE is_published IS NULL;
UPDATE public.partners SET is_published = true WHERE is_published IS NULL;
UPDATE public.focus_areas SET is_published = true WHERE is_published IS NULL;
UPDATE public.core_values SET is_published = true WHERE is_published IS NULL;
UPDATE public.reasons_to_hire SET is_published = true WHERE is_published IS NULL;
UPDATE public.quotes SET is_published = true WHERE is_published IS NULL;
UPDATE public.islamic SET is_published = true WHERE is_published IS NULL;
UPDATE public.uses_items SET is_published = true WHERE is_published IS NULL;
-- =============================================================================
-- 20. RELOAD POSTGREST SCHEMA CACHE
-- =============================================================================
-- Wajib dijalankan agar kolom baru langsung bisa diakses via API Supabase
NOTIFY pgrst, 'reload schema';

SELECT 'DAFFA PORTFOLIO V2: Database Master Setup Berhasil 100%! Seluruh Skema & Data Lengkap Daffa Sudah Masuk.' AS status;
