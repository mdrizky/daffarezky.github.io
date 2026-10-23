-- =============================================================================
-- QUICK FIX: TAMBAHKAN SEMUA KOLOM PROYEK KE SUPABASE
-- =============================================================================
-- Jalankan skrip ini di Supabase SQL Editor untuk memperbaiki error
-- "Gagal menyimpan project" saat mengedit target_audience, workflow, dll.
-- =============================================================================

-- 1. Tambahkan kolom-kolom baru ke tabel projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS target_audience_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS target_audience_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS workflow_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS workflow_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS estimated_hours TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS actual_hours TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS bottom_flyer_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS bottom_flyer_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS current_features_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS current_features_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS problem_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS problem_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS solution_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS solution_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS result_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS result_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS architecture_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS architecture_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS future_plans_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS future_plans_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS overview_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS overview_en TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year INTEGER DEFAULT 2025;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Completed';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS completion_date TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Medium';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 100;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Pastikan kolom yang sebelumnya NOT NULL sekarang nullable
ALTER TABLE public.projects ALTER COLUMN description_id DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description_en DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN image_url DROP NOT NULL;

-- 2. Pastikan tabel galeri multi-foto project_images ada
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption_id TEXT,
  caption_en TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 3. Pastikan RLS diaktifkan & admin memiliki akses penuh
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON public.projects;
DROP POLICY IF EXISTS "admin_all_projects" ON public.projects;
DROP POLICY IF EXISTS "public_read_project_images" ON public.project_images;
DROP POLICY IF EXISTS "admin_all_project_images" ON public.project_images;

CREATE POLICY "public_read_projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "admin_all_projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_project_images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "admin_all_project_images" ON public.project_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Reload PostgREST schema cache agar perubahan langsung terbaca
NOTIFY pgrst, 'reload schema';

SELECT 'BERHASIL! Semua kolom projects telah diperbarui dan schema cache telah di-reload.' AS status;
