-- Latest Database Updates for Daffa Portfolio
-- Run these in your Supabase SQL Editor to ensure your database is up to date.

-- 1. Add about_photo_url to profile table
ALTER TABLE profile
ADD COLUMN IF NOT EXISTS about_photo_url TEXT DEFAULT NULL;

-- 2. Create concepts table for future ideas and concepts
CREATE TABLE IF NOT EXISTS concepts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_id TEXT,
  subtitle_en TEXT,
  description_id TEXT,
  description_en TEXT,
  technology TEXT[],
  status TEXT DEFAULT 'Concept',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- 3. Create experience table for leadership and non-technical experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  description_id TEXT,
  description_en TEXT,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- 4. Create islamic table for Islamic data
CREATE TABLE IF NOT EXISTS islamic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_id TEXT,
  subtitle_en TEXT,
  description_id TEXT,
  description_en TEXT,
  category TEXT NOT NULL,
  reference TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- Enable RLS and Policies for new tables
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic ENABLE ROW LEVEL SECURITY;

-- Concepts Policies
DROP POLICY IF EXISTS "Allow read access for everyone" ON concepts;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON concepts;
CREATE POLICY "Allow read access for everyone" ON concepts FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users" ON concepts FOR ALL USING (auth.role() = 'authenticated');

-- Experience Policies
DROP POLICY IF EXISTS "Allow read access for everyone" ON experience;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON experience;
CREATE POLICY "Allow read access for everyone" ON experience FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Islamic Policies
DROP POLICY IF EXISTS "Allow read access for everyone" ON islamic;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON islamic;
CREATE POLICY "Allow read access for everyone" ON islamic FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users" ON islamic FOR ALL USING (auth.role() = 'authenticated');

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_concepts_order ON concepts(order_index);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(order_index);
CREATE INDEX IF NOT EXISTS idx_islamic_order ON islamic(order_index);
