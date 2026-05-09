-- Create Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content_id TEXT NOT NULL,
    content_en TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add stats fields to profile
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS stats_projects TEXT DEFAULT '4+';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS stats_tools TEXT DEFAULT '10+';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS stats_passion TEXT DEFAULT '∞';

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policies for Testimonials
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
