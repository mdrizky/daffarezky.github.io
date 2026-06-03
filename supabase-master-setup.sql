-- MASTER DATABASE SETUP FOR DAFFA PORTFOLIO
-- Jalankan ini di SQL Editor Supabase untuk memastikan semua tabel dan kolom sudah benar.

-- 1. Tabel Profile
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  stats_projects TEXT DEFAULT '4+',
  stats_tools TEXT DEFAULT '10+',
  stats_passion TEXT DEFAULT '∞'
);

-- 2. Tabel Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  image_url TEXT,
  tech_stack TEXT[],
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  category TEXT,
  progress INTEGER DEFAULT 0,
  start_date TEXT,
  completion_date TEXT,
  is_current BOOLEAN DEFAULT false,
  difficulty TEXT DEFAULT 'Medium'
);

-- 3. Tabel Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'))
);

-- 4. Tabel Messages (Kontak)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT, -- Kolom baru untuk nomor WhatsApp
  subject TEXT, -- Kolom baru untuk subjek pesan
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- 5. Tabel Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- 6. Tabel Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price TEXT,
  description_id TEXT,
  description_en TEXT,
  features_id TEXT[],
  features_en TEXT[],
  is_popular BOOLEAN DEFAULT false
);

-- 7. Tabel Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  issuer TEXT NOT NULL,
  file_url TEXT,
  date_issued TEXT
);

-- 8. Tabel Education
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- 9. Tabel Learning Journey
CREATE TABLE IF NOT EXISTS learning_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  year TEXT NOT NULL,
  title_id TEXT,
  title_en TEXT,
  description_id TEXT,
  description_en TEXT
);

-- ENABLE RLS (Row Level Security)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_journey ENABLE ROW LEVEL SECURITY;

-- 10. Tabel Partners / Clients
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- 11. Tabel Settings (SEO & Keamanan)
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  site_title TEXT,
  site_description TEXT,
  admin_pin TEXT DEFAULT '240708'
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 12. Storage Setup (Bucket & Policies)
-- Perintah ini akan mencoba membuat bucket jika belum ada
INSERT INTO storage.buckets (id, name, public)
SELECT 'portfolio-images', 'portfolio-images', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'portfolio-images'
);

-- Kebijakan Storage agar bisa upload dan baca
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
END $$;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR ALL USING (bucket_id = 'portfolio-images');

-- POLICIES: Publik bisa baca (SELECT), Admin bisa semua (ALL)
-- DROP EXISTING POLICIES TO AVOID ERRORS ON RERUN
DO $$ 
BEGIN
    -- Profile
    DROP POLICY IF EXISTS "Allow public read" ON profile;
    DROP POLICY IF EXISTS "Allow all for auth" ON profile;
    -- Projects
    DROP POLICY IF EXISTS "Allow public read" ON projects;
    DROP POLICY IF EXISTS "Allow all for auth" ON projects;
    -- Skills
    DROP POLICY IF EXISTS "Allow public read" ON skills;
    DROP POLICY IF EXISTS "Allow all for auth" ON skills;
    -- Messages
    DROP POLICY IF EXISTS "Allow public read" ON messages;
    DROP POLICY IF EXISTS "Allow all for auth" ON messages;
    -- Blog Posts
    DROP POLICY IF EXISTS "Allow public read" ON blog_posts;
    DROP POLICY IF EXISTS "Allow all for auth" ON blog_posts;
    -- Services
    DROP POLICY IF EXISTS "Allow public read" ON services;
    DROP POLICY IF EXISTS "Allow all for auth" ON services;
    -- Certificates
    DROP POLICY IF EXISTS "Allow public read" ON certificates;
    DROP POLICY IF EXISTS "Allow all for auth" ON certificates;
    -- Education
    DROP POLICY IF EXISTS "Allow public read" ON education;
    DROP POLICY IF EXISTS "Allow all for auth" ON education;
    -- Learning Journey
    DROP POLICY IF EXISTS "Allow public read" ON learning_journey;
    DROP POLICY IF EXISTS "Allow all for auth" ON learning_journey;
    -- Partners
    DROP POLICY IF EXISTS "Allow public read" ON partners;
    DROP POLICY IF EXISTS "Allow all for auth" ON partners;
    -- Settings
    DROP POLICY IF EXISTS "Allow public read" ON settings;
    DROP POLICY IF EXISTS "Allow all for auth" ON settings;
END $$;

-- RECREATE POLICIES
CREATE POLICY "Allow public read" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON profile FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON skills FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON messages FOR INSERT WITH CHECK (true); 
CREATE POLICY "Allow all for auth" ON messages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON services FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON certificates FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON education FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON education FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON learning_journey FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON learning_journey FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON partners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- INSERT DATA AWAL SETTINGS (Jika Kosong)
INSERT INTO settings (site_title, site_description, admin_pin)
SELECT 'Daffa Rizky | Web & Mobile Developer', 'Freelance Developer Indonesia...', '240708'
WHERE NOT EXISTS (SELECT 1 FROM settings);

