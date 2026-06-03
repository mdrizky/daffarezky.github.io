-- =================================================================================
-- SUPABASE FULL DATABASE SCHEMA UPDATE
-- =================================================================================
-- Run this script in the Supabase SQL Editor to ensure all tables exist and are
-- configured correctly.
-- =================================================================================

-- 1. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- Enable RLS and setup policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON messages;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON messages;
CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for anonymous users" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON messages FOR ALL USING (auth.role() = 'authenticated');


-- 2. PROFILE TABLE (Update or create)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  role TEXT,
  bio_id TEXT,
  bio_en TEXT,
  photo_url TEXT,
  logo_url TEXT,
  resume_url TEXT,
  about_photo_url TEXT
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access for everyone on profile" ON profile;
DROP POLICY IF EXISTS "Allow full access for authenticated users on profile" ON profile;
CREATE POLICY "Allow read access for everyone on profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users on profile" ON profile FOR ALL USING (auth.role() = 'authenticated');


-- 3. SETTINGS TABLE (New Table for SEO and Site config)
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- SEO & Site Identity
  site_title TEXT DEFAULT 'Daffa Rizky | Freelance Web & Mobile Developer',
  site_description TEXT DEFAULT 'Freelance Developer Indonesia - Daffa Rizky. Spesialis Next.js, React, TypeScript, dan Mobile Development.',
  seo_keywords TEXT DEFAULT 'Freelance Developer Indonesia, Web Developer, Mobile Developer, Next.js',
  
  -- Security
  admin_pin TEXT DEFAULT '240708'
);

-- Trigger to update 'updated_at' on settings
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_settings_updated_at ON settings;
CREATE TRIGGER tr_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_settings_updated_at();

-- Insert default settings row if it doesn't exist
INSERT INTO settings (site_title)
SELECT 'Daffa Rizky | Freelance Web & Mobile Developer'
WHERE NOT EXISTS (SELECT 1 FROM settings);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access for everyone on settings" ON settings;
DROP POLICY IF EXISTS "Allow full access for authenticated users on settings" ON settings;
CREATE POLICY "Allow read access for everyone on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users on settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Enable Realtime for Messages Table
-- This is crucial for the admin dashboard to receive instant updates.
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
