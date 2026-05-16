-- Migration: Add logo_url column to profile table
-- Run this in your Supabase SQL Editor

ALTER TABLE profile
ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT NULL;

-- Optional: Add a comment for documentation
COMMENT ON COLUMN profile.logo_url IS 'URL of the site logo image. If NULL, the UI falls back to initials.';
