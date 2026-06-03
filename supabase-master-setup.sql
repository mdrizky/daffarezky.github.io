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

-- POLICIES: Publik bisa baca (SELECT), Admin bisa semua (ALL)
-- Catatan: 'authenticated' merujuk pada user yang login lewat Supabase Auth.
-- Karena Anda menggunakan PIN, kita beri akses ALL untuk sementara atau gunakan service role.
-- Di sini kita asumsikan Anda ingin bisa edit dari panel admin.

CREATE POLICY "Allow public read" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON messages FOR INSERT WITH CHECK (true); -- Publik bisa kirim pesan
CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON education FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON learning_journey FOR SELECT USING (true);

-- Polisi untuk Admin (Bisa edit/hapus)
-- JIKA ANDA LOGIN SUPABASE:
CREATE POLICY "Allow all for auth" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for auth" ON learning_journey FOR ALL USING (auth.role() = 'authenticated');

-- JIKA TIDAK LOGIN SUPABASE (Hanya PIN):
-- Anda mungkin perlu mematikan RLS atau menggunakan API Key service_role di client (TIDAK DISARANKAN).
-- Sebaiknya aktifkan login admin Supabase agar RLS 'authenticated' berfungsi.

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
CREATE POLICY "Allow public read" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow all for auth" ON partners FOR ALL USING (auth.role() = 'authenticated');

