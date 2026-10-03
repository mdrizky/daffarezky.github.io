-- =============================================================================
-- 1-CLICK SCRIPT: ENABLE REALTIME & VERIFY ADMIN ACCESS
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. Ensure public.is_admin() and public.is_super_admin() recognize owner emails
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
  ) OR (
    auth.jwt() ->> 'email' IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
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
  ) OR (
    auth.jwt() ->> 'email' IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
  );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

-- 2. Bootstrap admin row for existing users
INSERT INTO public.admin_users (user_id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users
WHERE lower(email) IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
   OR (SELECT count(*) FROM auth.users) = 1
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', is_active = true;

-- 3. Set REPLICA IDENTITY FULL for tables with realtime updates
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.blog_posts REPLICA IDENTITY FULL;
ALTER TABLE public.testimonials REPLICA IDENTITY FULL;
ALTER TABLE public.guestbook REPLICA IDENTITY FULL;

-- 4. Enable Supabase Realtime publication safely (idempotent, won't error if already added)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;
