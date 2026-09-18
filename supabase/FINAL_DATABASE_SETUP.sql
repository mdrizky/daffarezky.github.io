-- =============================================================================
-- DAFFA PORTFOLIO V2 — FINAL DATABASE SETUP (single source of truth)
-- =============================================================================
-- Paste this ENTIRE file into the Supabase SQL Editor and run it ONCE.
--
-- This script is SAFE on BOTH:
--   1. A brand-new Supabase project (fresh install)
--   2. The existing portfolio database (additive upgrade — no DROP TABLE, no data loss)
--
-- WHAT IT DOES
--   • Creates every table used by the app (if missing)
--   • Adds missing columns to existing tables (never removes data)
--   • Merges deprecated duplicate tables into canonical tables
--       journey_milestones  → learning_journey
--       active_projects     → projects (status = 'Ongoing')
--       concepts            → projects (status = 'Concept')
--       future_concepts     → projects (status = 'Concept')
--   • Removes the insecure plaintext admin_pin from settings
--   • Creates admin_users + is_admin() / is_super_admin() authorization
--   • Applies row-level security (RLS) — public sees ONLY published rows
--   • Configures the portfolio-images storage bucket with folder structure
--   • Bootstraps the first admin user
--
-- SECURITY MODEL
--   • Public (anon)  : SELECT published content only; INSERT to messages,
--                      guestbook, newsletter, blog_comments with validation.
--   • Authenticated   : is NOT automatically an admin.
--   • Admin           : rows in admin_users with is_active = true.
--   • NO plaintext PIN, NO `auth.role() = 'authenticated'` as admin check.
--
-- AFTER RUNNING
--   1. Authentication → Users → copy YOUR user UUID
--   2. Run the INSERT at the bottom of this file to promote your account.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 0. Helper: add a column only if missing (used for additive upgrades)
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
END;
$$;

-- -----------------------------------------------------------------------------
-- 1. BASE TABLES (created only when a fresh project is missing them)
-- -----------------------------------------------------------------------------

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
  availability_status_id TEXT DEFAULT 'Tersedia untuk proyek freelance terpilih',
  availability_status_en TEXT DEFAULT 'Available for selected freelance projects',
  work_hours TEXT,
  current_city TEXT,
  stats_projects TEXT DEFAULT '0',
  stats_tools TEXT DEFAULT '0',
  stats_passion TEXT DEFAULT '∞'
);

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
  status TEXT DEFAULT 'Completed',
  bottom_flyer_id TEXT,
  bottom_flyer_en TEXT,
  current_features_id TEXT,
  current_features_en TEXT
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  level TEXT
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
  replied_at TIMESTAMPTZ
);

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

CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0
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
  is_popular BOOLEAN DEFAULT false
);

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
  sort_order INTEGER DEFAULT 0
);

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

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  text_id TEXT NOT NULL,
  text_en TEXT NOT NULL,
  author TEXT,
  is_personal BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
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
  description_en TEXT
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
  order_index INTEGER DEFAULT 0
);

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

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.uses_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  link TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 2. NEW TABLES (admin authorization, achievements, blog taxonomy, analytics)
-- -----------------------------------------------------------------------------

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
  category TEXT NOT NULL DEFAULT 'Other'
    CHECK (category IN ('Competition','Certification','Exhibition','Hackathon','Award','Course','Other')),
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

-- -----------------------------------------------------------------------------
-- 3. ADDITIVE COLUMNS (upgrade existing databases; no-op on fresh installs)
-- -----------------------------------------------------------------------------

-- projects (case-study fields + publication model)
SELECT public._add_column_if_missing('projects','problem_id','TEXT');
SELECT public._add_column_if_missing('projects','problem_en','TEXT');
SELECT public._add_column_if_missing('projects','solution_id','TEXT');
SELECT public._add_column_if_missing('projects','solution_en','TEXT');
SELECT public._add_column_if_missing('projects','result_id','TEXT');
SELECT public._add_column_if_missing('projects','result_en','TEXT');
SELECT public._add_column_if_missing('projects','bottom_flyer_id','TEXT');
SELECT public._add_column_if_missing('projects','bottom_flyer_en','TEXT');
SELECT public._add_column_if_missing('projects','current_features_id','TEXT');
SELECT public._add_column_if_missing('projects','current_features_en','TEXT');
SELECT public._add_column_if_missing('projects','role','TEXT');
SELECT public._add_column_if_missing('projects','future_plans_id','TEXT');
SELECT public._add_column_if_missing('projects','future_plans_en','TEXT');
SELECT public._add_column_if_missing('projects','overview_id','TEXT');
SELECT public._add_column_if_missing('projects','overview_en','TEXT');
SELECT public._add_column_if_missing('projects','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('projects','published_at','TIMESTAMPTZ DEFAULT now()');
SELECT public._add_column_if_missing('projects','updated_at','TIMESTAMPTZ DEFAULT now()');
SELECT public._add_column_if_missing('projects','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('projects','source_table','TEXT');
SELECT public._add_column_if_missing('projects','architecture_id','TEXT');
SELECT public._add_column_if_missing('projects','architecture_en','TEXT');
SELECT public._add_column_if_missing('projects','categories','TEXT[] DEFAULT ''{}''');

-- Fresh installations get timestamps above; existing installations need them too.
SELECT public._add_column_if_missing('messages','created_at','TIMESTAMPTZ DEFAULT now()');
SELECT public._add_column_if_missing('blog_posts','created_at','TIMESTAMPTZ DEFAULT now()');

-- skills
SELECT public._add_column_if_missing('skills','show_on_home','BOOLEAN DEFAULT false');
SELECT public._add_column_if_missing('skills','is_learning','BOOLEAN DEFAULT false');
SELECT public._add_column_if_missing('skills','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('skills','is_published','BOOLEAN DEFAULT true');

-- education
SELECT public._add_column_if_missing('education','location','TEXT');
SELECT public._add_column_if_missing('education','field_of_study','TEXT');
SELECT public._add_column_if_missing('education','achievement','TEXT');
SELECT public._add_column_if_missing('education','gallery','TEXT[] DEFAULT ''{}''');
SELECT public._add_column_if_missing('education','certificate_url','TEXT');
SELECT public._add_column_if_missing('education','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('education','sort_order','INTEGER DEFAULT 0');

-- experience
SELECT public._add_column_if_missing('experience','is_current','BOOLEAN DEFAULT false');
SELECT public._add_column_if_missing('experience','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('experience','sort_order','INTEGER DEFAULT 0');

-- learning_journey (canonical journey table)
SELECT public._add_column_if_missing('learning_journey','technologies','TEXT[] DEFAULT ''{}''');
SELECT public._add_column_if_missing('learning_journey','icon','TEXT');
SELECT public._add_column_if_missing('learning_journey','image_url','TEXT');
SELECT public._add_column_if_missing('learning_journey','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('learning_journey','is_published','BOOLEAN DEFAULT true');

-- certificates / services / partners / reasons / focus / values / quotes / islamic / uses
SELECT public._add_column_if_missing('certificates','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('certificates','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('services','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('services','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('partners','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('reasons_to_hire','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('focus_areas','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('core_values','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('quotes','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('islamic','is_published','BOOLEAN DEFAULT true');
SELECT public._add_column_if_missing('uses_items','is_published','BOOLEAN DEFAULT true');

-- testimonials: support BOTH sql dump names and app names
SELECT public._add_column_if_missing('testimonials','client_name','TEXT');
SELECT public._add_column_if_missing('testimonials','client_company','TEXT');
SELECT public._add_column_if_missing('testimonials','client_photo_url','TEXT');
SELECT public._add_column_if_missing('testimonials','testimonial_id','TEXT');
SELECT public._add_column_if_missing('testimonials','testimonial_en','TEXT');
SELECT public._add_column_if_missing('testimonials','rating','INTEGER DEFAULT 5');
SELECT public._add_column_if_missing('testimonials','project_id','UUID');
SELECT public._add_column_if_missing('testimonials','featured','BOOLEAN DEFAULT false');
SELECT public._add_column_if_missing('testimonials','sort_order','INTEGER DEFAULT 0');
SELECT public._add_column_if_missing('testimonials','name','TEXT');
SELECT public._add_column_if_missing('testimonials','role','TEXT');
SELECT public._add_column_if_missing('testimonials','content_id','TEXT');
SELECT public._add_column_if_missing('testimonials','content_en','TEXT');
SELECT public._add_column_if_missing('testimonials','avatar_url','TEXT');
SELECT public._add_column_if_missing('testimonials','is_published','BOOLEAN DEFAULT true');

UPDATE public.testimonials SET
  name = COALESCE(NULLIF(name, ''), client_name),
  role = COALESCE(NULLIF(role, ''), client_company),
  content_id = COALESCE(NULLIF(content_id, ''), testimonial_id),
  content_en = COALESCE(NULLIF(content_en, ''), testimonial_en),
  avatar_url = COALESCE(NULLIF(avatar_url, ''), client_photo_url);

UPDATE public.testimonials SET
  client_name = COALESCE(NULLIF(client_name, ''), name),
  client_company = COALESCE(NULLIF(client_company, ''), role),
  testimonial_id = COALESCE(NULLIF(testimonial_id, ''), content_id),
  testimonial_en = COALESCE(NULLIF(testimonial_en, ''), content_en),
  client_photo_url = COALESCE(NULLIF(client_photo_url, ''), avatar_url);

-- messages (client lead system)
SELECT public._add_column_if_missing('messages','service','TEXT');
SELECT public._add_column_if_missing('messages','budget','TEXT');
SELECT public._add_column_if_missing('messages','timeline','TEXT');
SELECT public._add_column_if_missing('messages','priority','TEXT DEFAULT ''normal''');

-- blog
SELECT public._add_column_if_missing('blog_posts','status','TEXT DEFAULT ''published''');
SELECT public._add_column_if_missing('blog_posts','published_at','TIMESTAMPTZ DEFAULT now()');
SELECT public._add_column_if_missing('blog_posts','updated_at','TIMESTAMPTZ DEFAULT now()');
SELECT public._add_column_if_missing('blog_posts','reading_time','INTEGER');
SELECT public._add_column_if_missing('blog_posts','seo_title','TEXT');
SELECT public._add_column_if_missing('blog_posts','seo_description','TEXT');
SELECT public._add_column_if_missing('blog_posts','og_image','TEXT');
SELECT public._add_column_if_missing('blog_posts','is_published','BOOLEAN DEFAULT true');

-- newsletter
SELECT public._add_column_if_missing('newsletter_subscribers','unsubscribed_at','TIMESTAMPTZ');
SELECT public._add_column_if_missing('newsletter_subscribers','source','TEXT DEFAULT ''website''');

-- settings
SELECT public._add_column_if_missing('settings','og_image','TEXT');
SELECT public._add_column_if_missing('settings','canonical_url','TEXT');

-- profile extras
SELECT public._add_column_if_missing('profile','updated_at','TIMESTAMPTZ DEFAULT now()');

-- -----------------------------------------------------------------------------
-- 4. RELAX / REPLACE CHECK CONSTRAINTS (status expansion — additive only)
-- -----------------------------------------------------------------------------

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public' AND t.relname = 'projects' AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.projects DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('Completed','Planned','Ongoing','Archived','Concept'));

UPDATE public.projects SET status = 'Completed' WHERE status IS NULL OR status NOT IN ('Completed','Planned','Ongoing','Archived','Concept');

UPDATE public.projects
SET categories = ARRAY[category]
WHERE (categories IS NULL OR cardinality(categories) = 0) AND category IS NOT NULL AND category <> '';

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public' AND t.relname = 'messages' AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.messages DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_status_check
  CHECK (status IN ('new','contacted','qualified','in_progress','completed','archived','spam','read','replied'));

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public' AND t.relname = 'blog_posts' AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.blog_posts DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_status_check
  CHECK (status IN ('draft','published','archived'));

UPDATE public.blog_posts SET status = 'published' WHERE status IS NULL;
UPDATE public.blog_posts SET is_published = true WHERE status = 'published';
UPDATE public.blog_posts SET is_published = false WHERE status IN ('draft','archived');

-- Unique slug for projects when present
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique ON public.projects (slug) WHERE slug IS NOT NULL AND slug <> '';

-- -----------------------------------------------------------------------------
-- 5. MERGE DEPRECATED TABLES INTO CANONICAL TABLES (copy, never drop)
-- -----------------------------------------------------------------------------

-- journey_milestones → learning_journey
DO $$ BEGIN
  IF to_regclass('public.journey_milestones') IS NOT NULL THEN
    INSERT INTO public.learning_journey (year, title_id, title_en, description_id, description_en, icon, sort_order, is_published)
    SELECT jm.year, jm.title_id, jm.title_en, jm.description_id, jm.description_en, jm.icon, jm.sort_order, true
    FROM public.journey_milestones jm
    WHERE NOT EXISTS (SELECT 1 FROM public.learning_journey lj WHERE lj.year = jm.year AND COALESCE(lj.title_id,'') = COALESCE(jm.title_id,''));
  END IF;
END $$;

-- active_projects → projects (Ongoing)
DO $$ BEGIN
IF to_regclass('public.active_projects') IS NOT NULL THEN
INSERT INTO public.projects (
  title_id, title_en, description_id, description_en, status, is_current, progress,
  current_features_id, current_features_en, is_published, source_table, featured
)
SELECT
  ap.name_id, ap.name_en, ap.description_id, ap.description_en,
  'Ongoing', true, COALESCE(ap.progress_percent, 0),
  array_to_string(ap.features_id, E'\n'), array_to_string(ap.features_en, E'\n'),
  true, 'active_projects', false
FROM public.active_projects ap
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.title_id = ap.name_id AND p.source_table = 'active_projects'
);
END IF;
END $$;

-- concepts → projects (Concept)
DO $$ BEGIN
IF to_regclass('public.concepts') IS NOT NULL THEN
INSERT INTO public.projects (
  title_id, title_en, description_id, description_en, tech_stack, status, featured,
  sort_order, is_published, source_table, category
)
SELECT
  c.title_id, c.title_en, c.description_id, c.description_en, c.technology,
  'Concept', c.featured, c.order_index, true, 'concepts', 'Other'
FROM public.concepts c
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.title_id = c.title_id AND p.source_table = 'concepts'
);
END IF;
END $$;

-- future_concepts → projects (Concept)
DO $$ BEGIN
IF to_regclass('public.future_concepts') IS NOT NULL THEN
INSERT INTO public.projects (
  title_id, title_en, description_id, description_en, status, category,
  tech_stack, sort_order, is_published, source_table
)
SELECT
  fc.title_id, fc.title_en, fc.description_id, fc.description_en, 'Concept',
  COALESCE(fc.category, 'Other'), COALESCE(fc.tags, '{}'), fc.sort_order, true, 'future_concepts'
FROM public.future_concepts fc
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.title_id = fc.title_id AND p.source_table = 'future_concepts'
);
END IF;
END $$;

-- Backfill slugs for projects
UPDATE public.projects
SET slug = lower(regexp_replace(coalesce(title_en, title_id), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

UPDATE public.projects p
SET slug = p.slug || '-' || substr(p.id::text, 1, 8)
WHERE EXISTS (
  SELECT 1 FROM public.projects p2
  WHERE p2.slug = p.slug AND p2.id <> p.id
);

UPDATE public.projects SET is_current = true WHERE status = 'Ongoing';

-- -----------------------------------------------------------------------------
-- 6. REMOVE INSECURE ADMIN PIN (secret, not content)
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'settings' AND column_name = 'admin_pin'
  ) THEN
    ALTER TABLE public.settings DROP COLUMN admin_pin;
  END IF;
END $$;

INSERT INTO public.profile (name, title_id, title_en, bio_id, bio_en, availability_status_id, availability_status_en)
SELECT 'Daffa Rizky', 'Web & Mobile Developer', 'Web & Mobile Developer',
       'Membangun website, aplikasi Android, sistem backend, dan integrasi AI.',
       'Building websites, Android apps, backend systems, and AI integrations.',
       'Tersedia untuk proyek freelance terpilih', 'Available for selected freelance projects'
WHERE NOT EXISTS (SELECT 1 FROM public.profile);

INSERT INTO public.settings (site_title, site_description)
SELECT 'Muhammad Daffa Rezky Adyra | Web & Mobile Developer',
       'Websites, Android apps, backend systems, and AI integrations — built to solve real problems.'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- No shared admin PIN is seeded. Supabase Auth credentials are the only login secret.

-- -----------------------------------------------------------------------------
-- 7. AUTHORIZATION HELPERS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.is_active = true
      AND au.role = 'super_admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

-- Authentication is intentionally Supabase Auth + admin_users only. Remove any
-- legacy shared-PIN objects left by a previous installation.
DROP FUNCTION IF EXISTS public.change_admin_pin(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.verify_admin_pin(TEXT);
ALTER TABLE public.settings DROP COLUMN IF EXISTS admin_pin;
ALTER TABLE public.settings DROP COLUMN IF EXISTS admin_pin_hash;

-- updated_at maintenance trigger (applies to every table that has updated_at)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['projects','blog_posts','achievements']
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name=t AND column_name='updated_at'
    ) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON public.%I', t, t);
      EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
    END IF;
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 8. ENABLE RLS
-- -----------------------------------------------------------------------------

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profile','projects','skills','messages','certificates','education','concepts',
    'partners','services','blog_posts','settings','reasons_to_hire','journey_milestones',
    'focus_areas','core_values','quotes','active_projects','future_concepts',
    'project_images','project_features','project_challenges','learning_journey',
    'experience','islamic','testimonials','guestbook','newsletter_subscribers',
    'blog_comments','uses_items','admin_users','achievements','project_technologies',
    'blog_categories','blog_tags','analytics_events'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
    END IF;
  END LOOP;
END $$;

-- Drop every existing public policy so USING(true) / authenticated-admin cannot linger
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- RLS POLICIES
-- Public content: SELECT published only
-- Admin: ALL when is_admin()
-- -----------------------------------------------------------------------------

-- profile: public may read the singleton; no drafts
CREATE POLICY "public_read_profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "admin_all_profile" ON public.profile FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Canonical published content
CREATE POLICY "public_read_published_projects" ON public.projects
  FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_projects" ON public.projects
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_project_images" ON public.project_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.is_published = true)
  );
CREATE POLICY "admin_all_project_images" ON public.project_images
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_project_features" ON public.project_features
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.is_published = true)
  );
CREATE POLICY "admin_all_project_features" ON public.project_features
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_project_challenges" ON public.project_challenges
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.is_published = true)
  );
CREATE POLICY "admin_all_project_challenges" ON public.project_challenges
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_project_technologies" ON public.project_technologies
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.is_published = true)
  );
CREATE POLICY "admin_all_project_technologies" ON public.project_technologies
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_skills" ON public.skills FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_skills" ON public.skills FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_education" ON public.education FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_education" ON public.education FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_experience" ON public.experience FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_experience" ON public.experience FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_learning_journey" ON public.learning_journey FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_learning_journey" ON public.learning_journey FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_certificates" ON public.certificates FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_certificates" ON public.certificates FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_achievements" ON public.achievements FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_achievements" ON public.achievements FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_reasons" ON public.reasons_to_hire FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_reasons" ON public.reasons_to_hire FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_focus" ON public.focus_areas FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_focus" ON public.focus_areas FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_values" ON public.core_values FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_values" ON public.core_values FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_quotes" ON public.quotes FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_quotes" ON public.quotes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_partners" ON public.partners FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_partners" ON public.partners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_islamic" ON public.islamic FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_islamic" ON public.islamic FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_uses" ON public.uses_items FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_uses" ON public.uses_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_testimonials" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_testimonials" ON public.testimonials FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_blog" ON public.blog_posts
  FOR SELECT USING (is_published = true AND status = 'published');
CREATE POLICY "admin_all_blog" ON public.blog_posts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_blog_categories" ON public.blog_categories FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_blog_categories" ON public.blog_categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_blog_tags" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "admin_all_blog_tags" ON public.blog_tags FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_blog_comments" ON public.blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "public_insert_blog_comments" ON public.blog_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.blog_posts p
      WHERE p.id = post_id AND p.is_published = true AND p.status = 'published'
    )
    AND char_length(trim(name)) BETWEEN 2 AND 80
    AND char_length(trim(content)) BETWEEN 2 AND 2000
    AND email ~* '^[^@]+@[^@]+\.[^@]+$'
  );
CREATE POLICY "admin_all_blog_comments" ON public.blog_comments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Settings are CMS configuration.  Public pages obtain their static metadata from
-- Next.js; only administrators may read or change the backing rows.
CREATE POLICY "admin_all_settings" ON public.settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- messages: public INSERT only (validated)
CREATE POLICY "public_insert_messages" ON public.messages
  FOR INSERT WITH CHECK (
    char_length(trim(name)) BETWEEN 2 AND 120
    AND char_length(trim(message)) BETWEEN 2 AND 8000
    AND email ~* '^[^@]+@[^@]+\.[^@]+$'
  );
CREATE POLICY "admin_all_messages" ON public.messages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- guestbook
CREATE POLICY "public_read_guestbook" ON public.guestbook FOR SELECT USING (is_approved = true);
CREATE POLICY "public_insert_guestbook" ON public.guestbook
  FOR INSERT WITH CHECK (
    char_length(trim(name)) BETWEEN 2 AND 80
    AND char_length(trim(message)) BETWEEN 2 AND 1000
    AND is_approved = false
  );
CREATE POLICY "admin_all_guestbook" ON public.guestbook FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- newsletter: public INSERT, never public SELECT (subscriber emails stay private)
CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$');
CREATE POLICY "admin_all_newsletter" ON public.newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- deprecated satellite tables: admin-only (public uses projects / learning_journey)
CREATE POLICY "admin_all_concepts" ON public.concepts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_active_projects" ON public.active_projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_future_concepts" ON public.future_concepts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_journey_milestones" ON public.journey_milestones FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- admin_users: user can read own row; super_admin manages all
CREATE POLICY "admin_users_self_select" ON public.admin_users
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "admin_users_super_write" ON public.admin_users
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- analytics: admin read; public insert validated
CREATE POLICY "public_insert_analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (char_length(event_name) BETWEEN 1 AND 80);
CREATE POLICY "admin_read_analytics" ON public.analytics_events
  FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_all_analytics" ON public.analytics_events
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 9. STORAGE — portfolio-images bucket with folder structure
--    Allowed folders: profile/ projects/ certificates/ blog/ testimonials/
--                     partners/ skills/ general/
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
SELECT 'portfolio-images', 'portfolio-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portfolio-images');

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.is_allowed_upload_folder(name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((storage.foldername(name))[1], '') IN
    ('profile','projects','certificates','blog','testimonials','partners','skills','general');
$$;

REVOKE ALL ON FUNCTION public.is_allowed_upload_folder(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_allowed_upload_folder(text) TO authenticated;

CREATE POLICY "portfolio_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND public.is_admin()
    AND public.is_allowed_upload_folder(name)
  );

CREATE POLICY "portfolio_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images' AND public.is_admin())
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND public.is_admin()
    AND public.is_allowed_upload_folder(name)
  );

CREATE POLICY "portfolio_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images' AND public.is_admin());

-- -----------------------------------------------------------------------------
-- 10. BOOTSTRAP ADMIN
-- -----------------------------------------------------------------------------
-- If you only have ONE Auth user, this promotes them automatically.
-- Otherwise, Authentication → Users → copy your User UID and run:
--
--   INSERT INTO public.admin_users (user_id, role, is_active)
--   VALUES ('YOUR-USER-UUID', 'super_admin', true)
--   ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', is_active = true;

INSERT INTO public.admin_users (user_id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users
WHERE (SELECT count(*) FROM auth.users) = 1
ON CONFLICT (user_id) DO NOTHING;

DROP FUNCTION IF EXISTS public._add_column_if_missing(text, text, text);

-- =============================================================================
-- END OF FINAL DATABASE SETUP
-- =============================================================================
