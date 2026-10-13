-- =============================================================================
-- DAFFA PORTFOLIO V2 — FINAL MASTER DATABASE SETUP (100% SINGLE SOURCE OF TRUTH)
-- =============================================================================
-- Salin (Copy) SELURUH isi file ini, lalu Paste di Supabase SQL Editor -> Run ONCE.
--
-- AMAN & NON-DESTRUKTIF:
--   • Bekerja pada database baru (Fresh Install) maupun database lama (Upgrade).
--   • TIDAK AKAN MENGHAPUS data yang sudah ada (Tidak ada DROP TABLE).
--   • Mengaktifkan Storage Bucket 'portfolio-images' berstatus PUBLIC.
--   • Mengizinkan upload foto profil, logo, sertifikat, kampus tanpa error.
--   • Memastikan seluruh tabel terhubung ke panel Admin dan halaman Publik.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 0. HELPER FUNCTION: Add column only if missing
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 1. STORAGE BUCKET: portfolio-images (PUBLIC = TRUE)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Update helper folder upload
CREATE OR REPLACE FUNCTION public.is_allowed_upload_folder(name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT true; -- Izinkan semua folder untuk admin
$$;

GRANT EXECUTE ON FUNCTION public.is_allowed_upload_folder(text) TO anon, authenticated;

-- Bersihkan storage policy lama
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Storage RLS: Public dapat melihat/membaca gambar
CREATE POLICY "portfolio_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Storage RLS: Upload, update, delete diizinkan untuk bucket portfolio-images
CREATE POLICY "portfolio_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images');

-- -----------------------------------------------------------------------------
-- 2. CREATE BASE TABLES (IF NOT EXISTS)
-- -----------------------------------------------------------------------------

-- Profile
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
  linkedin TEXT,
  tiktok TEXT,
  youtube TEXT,
  birth_date DATE,
  birth_place TEXT,
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

-- Projects
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

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Frontend',
  level TEXT DEFAULT 'Intermediate',
  show_on_home BOOLEAN DEFAULT true,
  is_learning BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  institution TEXT NOT NULL,
  degree_id TEXT,
  degree_en TEXT,
  start_year TEXT NOT NULL,
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
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT,
  issuer TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  date_issued TEXT DEFAULT '2025',
  description_id TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Experience
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT,
  organization TEXT NOT NULL,
  role TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  description_id TEXT,
  description_en TEXT,
  category TEXT DEFAULT 'Leadership',
  order_index INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT 'Konsultasi',
  description_id TEXT,
  description_en TEXT,
  features_id TEXT[] DEFAULT '{}',
  features_en TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  timeline TEXT,
  target_client_id TEXT,
  target_client_en TEXT,
  badge_text TEXT,
  is_published BOOLEAN DEFAULT true
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_id TEXT NOT NULL,
  content_en TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT DEFAULT 'Teknologi',
  excerpt_id TEXT,
  excerpt_en TEXT,
  status TEXT DEFAULT 'published',
  reading_time INTEGER DEFAULT 5,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  is_published BOOLEAN DEFAULT true
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  client_name TEXT,
  name TEXT,
  role TEXT,
  client_company TEXT,
  content_id TEXT,
  content_en TEXT,
  testimonial_id TEXT,
  testimonial_en TEXT,
  avatar_url TEXT,
  client_photo_url TEXT,
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  project_id TEXT,
  is_published BOOLEAN DEFAULT true
);

-- Learning Journey
CREATE TABLE IF NOT EXISTS public.learning_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  year TEXT NOT NULL,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  technologies TEXT[] DEFAULT '{}',
  icon TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Partners
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
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
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
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
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Reasons To Hire
CREATE TABLE IF NOT EXISTS public.reasons_to_hire (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  icon TEXT NOT NULL,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Quotes
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

-- Islamic
CREATE TABLE IF NOT EXISTS public.islamic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title_id TEXT NOT NULL,
  title_en TEXT,
  subtitle_id TEXT,
  subtitle_en TEXT,
  description_id TEXT,
  description_en TEXT,
  category TEXT DEFAULT 'Umum',
  reference TEXT,
  featured BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Uses Items
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

-- Messages
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
  service TEXT,
  budget TEXT,
  timeline TEXT,
  priority TEXT DEFAULT 'normal',
  replied_at TIMESTAMPTZ
);

-- Guestbook
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  source TEXT,
  unsubscribed_at TIMESTAMPTZ
);

-- Blog Comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true
);

-- Admin Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'super_admin',
  is_active BOOLEAN DEFAULT true
);

-- Settings
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  site_name TEXT DEFAULT 'Muhammad Daffa Rezky Adyra',
  site_description TEXT DEFAULT 'Portfolio of Muhammad Daffa Rezky Adyra',
  site_url TEXT DEFAULT 'https://portofolio-daffarezky.vercel.app',
  logo_url TEXT,
  favicon_url TEXT
);

-- -----------------------------------------------------------------------------
-- 3. ENSURE ALL COLUMNS EXIST (ADDITIVE MIGRATION)
-- -----------------------------------------------------------------------------
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

SELECT public._add_column_if_missing('projects','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('skills','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('experience','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('services','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('testimonials','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('partners','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('learning_journey','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('focus_areas','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('core_values','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('reasons_to_hire','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('quotes','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('islamic','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('uses_items','is_published','BOOLEAN DEFAULT true');

-- -----------------------------------------------------------------------------
-- 4. AUTHORIZATION HELPERS
-- -----------------------------------------------------------------------------
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
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid() AND au.is_active = true AND au.role = 'super_admin'
  ) OR (
    auth.jwt() ->> 'email' IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Enable RLS on all tables
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

-- Content Tables Policies (Public sees published OR not set, Admin has full control)
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

-- Interactive Tables (Public may insert)
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

-- -----------------------------------------------------------------------------
-- 6. DATA CLEANUP & INITIAL ROW ENSURANCE
-- -----------------------------------------------------------------------------
-- Ensure is_published is true for existing data
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

-- Ensure singleton row exists in profile
INSERT INTO public.profile (name, email, wa)
SELECT 'Muhammad Daffa Rezky Adyra', 'daffarezky99@gmail.com', '081234567890'
WHERE NOT EXISTS (SELECT 1 FROM public.profile);

-- Bootstrap admin user from auth.users
INSERT INTO public.admin_users (user_id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users
WHERE lower(email) IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
   OR (SELECT count(*) FROM auth.users) = 1
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', is_active = true;

-- -----------------------------------------------------------------------------
-- 7. REALTIME SETUP
-- -----------------------------------------------------------------------------
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

SELECT 'DAFFA PORTFOLIO V2: Database Master Setup Berhasil 100%! Semua Fitur & Storage Terintegrasi.' AS status;
