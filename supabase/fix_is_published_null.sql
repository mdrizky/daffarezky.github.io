-- =============================================================================
-- PATCH: Set is_published = true for ALL rows where is_published IS NULL
-- Run this in Supabase SQL Editor to fix missing data on public pages.
-- =============================================================================

-- Education
UPDATE public.education
SET is_published = true
WHERE is_published IS NULL;

-- Focus Areas
UPDATE public.focus_areas
SET is_published = true
WHERE is_published IS NULL;

-- Core Values
UPDATE public.core_values
SET is_published = true
WHERE is_published IS NULL;

-- Projects
UPDATE public.projects
SET is_published = true
WHERE is_published IS NULL;

-- Certificates
UPDATE public.certificates
SET is_published = true
WHERE is_published IS NULL;

-- Skills
UPDATE public.skills
SET is_published = true
WHERE is_published IS NULL;

-- Blog Posts
UPDATE public.blog_posts
SET is_published = true
WHERE is_published IS NULL;

-- Testimonials
UPDATE public.testimonials
SET is_published = true
WHERE is_published IS NULL;

-- Services
UPDATE public.services
SET is_published = true
WHERE is_published IS NULL;

-- Learning Journey
UPDATE public.learning_journey
SET is_published = true
WHERE is_published IS NULL;

-- Reasons To Hire
UPDATE public.reasons_to_hire
SET is_published = true
WHERE is_published IS NULL;

-- Partners
UPDATE public.partners
SET is_published = true
WHERE is_published IS NULL;

-- Achievements (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'is_published'
  ) THEN
    UPDATE public.achievements SET is_published = true WHERE is_published IS NULL;
  END IF;
END $$;

-- Experience (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experience' AND column_name = 'is_published'
  ) THEN
    UPDATE public.experience SET is_published = true WHERE is_published IS NULL;
  END IF;
END $$;

-- Quotes (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotes' AND column_name = 'is_published'
  ) THEN
    UPDATE public.quotes SET is_published = true WHERE is_published IS NULL;
  END IF;
END $$;

-- Islamic (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'islamic' AND column_name = 'is_published'
  ) THEN
    UPDATE public.islamic SET is_published = true WHERE is_published IS NULL;
  END IF;
END $$;

-- Uses Items (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'uses_items' AND column_name = 'is_published'
  ) THEN
    UPDATE public.uses_items SET is_published = true WHERE is_published IS NULL;
  END IF;
END $$;

SELECT 'Patch complete! All NULL is_published rows are now set to true.' AS result;
