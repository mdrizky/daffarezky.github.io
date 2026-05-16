-- ============================================================
-- Supabase Row Level Security (RLS) Policies
-- Portfolio: Daffa Rizky
-- 
-- Run this entire file in your Supabase SQL Editor.
-- 
-- Strategy:
--   PUBLIC tables  → anyone can SELECT (read)
--   PRIVATE tables → only authenticated users can SELECT
--   ALL writes      → only authenticated users (INSERT / UPDATE / DELETE)
-- ============================================================


-- ── 1. Enable RLS on all tables ──────────────────────────────

ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE education        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;


-- ── 2. PUBLIC READ policies (portfolio visitors) ─────────────
-- These tables are safe to expose publicly.

-- profile: public read (name, photo, bio, social links)
CREATE POLICY "Public can read profile"
  ON profile FOR SELECT
  USING (true);

-- projects: public read
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (true);

-- blog_posts: public read
CREATE POLICY "Public can read blog posts"
  ON blog_posts FOR SELECT
  USING (true);

-- services: public read
CREATE POLICY "Public can read services"
  ON services FOR SELECT
  USING (true);

-- skills: public read
CREATE POLICY "Public can read skills"
  ON skills FOR SELECT
  USING (true);

-- education: public read
CREATE POLICY "Public can read education"
  ON education FOR SELECT
  USING (true);

-- certificates: public read
CREATE POLICY "Public can read certificates"
  ON certificates FOR SELECT
  USING (true);

-- learning_journey: public read
CREATE POLICY "Public can read learning journey"
  ON learning_journey FOR SELECT
  USING (true);

-- testimonials: public read
CREATE POLICY "Public can read testimonials"
  ON testimonials FOR SELECT
  USING (true);


-- ── 3. MESSAGES: public INSERT, auth-only SELECT/UPDATE/DELETE ─
-- Visitors can submit contact form messages (INSERT),
-- but only the admin can read or manage them.

CREATE POLICY "Public can submit messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth users can read messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update messages"
  ON messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'authenticated');


-- ── 4. WRITE policies (admin only) ───────────────────────────
-- All INSERT / UPDATE / DELETE require authentication.

-- profile
CREATE POLICY "Auth users can insert profile"
  ON profile FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update profile"
  ON profile FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete profile"
  ON profile FOR DELETE
  USING (auth.role() = 'authenticated');

-- projects
CREATE POLICY "Auth users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- blog_posts
CREATE POLICY "Auth users can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update blog posts"
  ON blog_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete blog posts"
  ON blog_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- services
CREATE POLICY "Auth users can insert services"
  ON services FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update services"
  ON services FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete services"
  ON services FOR DELETE
  USING (auth.role() = 'authenticated');

-- skills
CREATE POLICY "Auth users can insert skills"
  ON skills FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update skills"
  ON skills FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete skills"
  ON skills FOR DELETE
  USING (auth.role() = 'authenticated');

-- education
CREATE POLICY "Auth users can insert education"
  ON education FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update education"
  ON education FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete education"
  ON education FOR DELETE
  USING (auth.role() = 'authenticated');

-- certificates
CREATE POLICY "Auth users can insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update certificates"
  ON certificates FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete certificates"
  ON certificates FOR DELETE
  USING (auth.role() = 'authenticated');

-- learning_journey
CREATE POLICY "Auth users can insert learning journey"
  ON learning_journey FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update learning journey"
  ON learning_journey FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete learning journey"
  ON learning_journey FOR DELETE
  USING (auth.role() = 'authenticated');

-- testimonials
CREATE POLICY "Auth users can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update testimonials"
  ON testimonials FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete testimonials"
  ON testimonials FOR DELETE
  USING (auth.role() = 'authenticated');


-- ── 5. Storage bucket policies ────────────────────────────────
-- Bucket: portfolio-images
-- Public read, auth-only write.

-- Allow public to view uploaded files
CREATE POLICY "Public can view portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload
CREATE POLICY "Auth users can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update (overwrite)
CREATE POLICY "Auth users can update portfolio images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete
CREATE POLICY "Auth users can delete portfolio images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images'
    AND auth.role() = 'authenticated'
  );


-- ── Done ──────────────────────────────────────────────────────
-- After running this, verify in Supabase Dashboard:
--   Authentication > Policies — each table should show its policies.
--   Storage > Policies — portfolio-images bucket should show 4 policies.
