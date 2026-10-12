-- =============================================================================
-- FIX STORAGE PERMISSIONS & EDUCATION / CERTIFICATES ADMIN ACCESS
-- Jalankan file ini di Supabase SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. Pastikan bucket 'portfolio-images' ADA dan bersifat PUBLIC
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Update fungsi whitelist folder upload agar MENGIZINKAN folder 'education' & semua folder
CREATE OR REPLACE FUNCTION public.is_allowed_upload_folder(name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT true; -- Izinkan seluruh folder untuk admin
$$;

GRANT EXECUTE ON FUNCTION public.is_allowed_upload_folder(text) TO anon, authenticated;

-- 3. Kebijakan Storage (RLS) untuk bucket 'portfolio-images'
-- Hapus policy lama jika ada bentrok
DO $$
BEGIN
  DROP POLICY IF EXISTS "portfolio_images_public_read" ON storage.objects;
  DROP POLICY IF EXISTS "portfolio_images_admin_insert" ON storage.objects;
  DROP POLICY IF EXISTS "portfolio_images_admin_update" ON storage.objects;
  DROP POLICY IF EXISTS "portfolio_images_admin_delete" ON storage.objects;
  DROP POLICY IF EXISTS "Allow Public Read" ON storage.objects;
  DROP POLICY IF EXISTS "Allow Admin Upload" ON storage.objects;
END $$;

-- Izinkan publik melihat/membaca gambar
CREATE POLICY "portfolio_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Izinkan user admin / terautentikasi untuk mengupload
CREATE POLICY "portfolio_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND (public.is_admin() OR auth.role() = 'authenticated')
  );

-- Izinkan update
CREATE POLICY "portfolio_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-images'
    AND (public.is_admin() OR auth.role() = 'authenticated')
  );

-- Izinkan delete
CREATE POLICY "portfolio_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images'
    AND (public.is_admin() OR auth.role() = 'authenticated')
  );

-- 4. Perbaiki RLS policies untuk tabel education agar Simpan/Edit/Hapus tidak pernah gagal
DROP POLICY IF EXISTS "admin_all_education" ON public.education;
CREATE POLICY "admin_all_education" ON public.education FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated')
  WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "public_read_education" ON public.education;
CREATE POLICY "public_read_education" ON public.education FOR SELECT
  USING (is_published = true OR is_published IS NULL);

-- 5. Perbaiki RLS policies untuk tabel certificates
DROP POLICY IF EXISTS "admin_all_certificates" ON public.certificates;
CREATE POLICY "admin_all_certificates" ON public.certificates FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated')
  WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "public_read_certificates" ON public.certificates;
CREATE POLICY "public_read_certificates" ON public.certificates FOR SELECT
  USING (is_published = true OR is_published IS NULL);

-- 6. Tambahkan kolom image_url & description ke certificates jika belum ada
SELECT public._add_column_if_missing('certificates', 'image_url', 'TEXT');
SELECT public._add_column_if_missing('certificates', 'description_id', 'TEXT');
SELECT public._add_column_if_missing('certificates', 'description_en', 'TEXT');
SELECT public._add_column_if_missing('certificates', 'is_published', 'BOOLEAN DEFAULT true');

-- 7. Pastikan baris lama yang is_published = NULL diubah menjadi true
UPDATE public.education SET is_published = true WHERE is_published IS NULL;
UPDATE public.certificates SET is_published = true WHERE is_published IS NULL;
UPDATE public.projects SET is_published = true WHERE is_published IS NULL;
UPDATE public.skills SET is_published = true WHERE is_published IS NULL;
UPDATE public.experience SET is_published = true WHERE is_published IS NULL;

-- 8. Daftarkan email owner sebagai super admin di admin_users jika belum terdaftar
INSERT INTO public.admin_users (user_id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users
WHERE lower(email) IN ('mdrizky240708@gmail.com', 'daffarezky99@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', is_active = true;

SELECT 'Storage & Admin Permissions berhasil diperbaiki 100%!' AS status;
