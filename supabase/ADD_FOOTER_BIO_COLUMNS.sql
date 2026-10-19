-- =============================================================================
-- FIX: Tambahkan Kolom footer_bio_id & footer_bio_en ke Tabel Profile
-- Jalankan query ini di Supabase SQL Editor (tab "Untitled query") lalu klik RUN
-- =============================================================================

ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS footer_bio_id TEXT DEFAULT 'Web & Mobile Developer yang berfokus pada pengembangan teknologi, inovasi digital, dan solusi yang memberikan dampak positif bagi masyarakat.';

ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS footer_bio_en TEXT DEFAULT 'Web & Mobile Developer focused on technology development, digital innovation, and solutions that provide a positive impact on society.';

-- Segarkan cache PostgREST agar Supabase API langsung mengenali kolom baru tanpa restart
NOTIFY pgrst, 'reload schema';

SELECT 'BERHASIL: Kolom footer_bio_id dan footer_bio_en sudah aktif dan siap digunakan!' AS status;
