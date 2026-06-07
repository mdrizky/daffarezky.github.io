-- ==========================================
-- PORTFOLIO ENHANCEMENTS SQL SETUP
-- ==========================================

-- 1. Guestbook Table
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Uses Items Table
CREATE TABLE IF NOT EXISTS uses_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- Software, Hardware, Daily Apps
  name TEXT NOT NULL,
  description_id TEXT,
  description_en TEXT,
  link TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0
);

-- 5. Update Projects Table for Case Studies
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='problem_id') THEN
    ALTER TABLE projects ADD COLUMN problem_id TEXT;
    ALTER TABLE projects ADD COLUMN problem_en TEXT;
    ALTER TABLE projects ADD COLUMN solution_id TEXT;
    ALTER TABLE projects ADD COLUMN solution_en TEXT;
    ALTER TABLE projects ADD COLUMN result_id TEXT;
    ALTER TABLE projects ADD COLUMN result_en TEXT;
  END IF;
END $$;

-- 6. Row Level Security (RLS) Policies

-- Guestbook Policies
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public guestbook view" ON guestbook FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Public guestbook insert" ON guestbook FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin guestbook full access" ON guestbook FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter Policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public newsletter insert" ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin newsletter full access" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');

-- Blog Comments Policies
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public blog_comments view" ON blog_comments FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Public blog_comments insert" ON blog_comments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin blog_comments full access" ON blog_comments FOR ALL USING (auth.role() = 'authenticated');

-- Uses Items Policies
ALTER TABLE uses_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public uses_items view" ON uses_items FOR SELECT USING (TRUE);
CREATE POLICY "Admin uses_items full access" ON uses_items FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- END OF SETUP
-- ==========================================
