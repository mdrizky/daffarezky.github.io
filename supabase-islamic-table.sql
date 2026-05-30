-- Create islamic table for Islamic data
CREATE TABLE IF NOT EXISTS islamic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic info
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_id TEXT,
  subtitle_en TEXT,
  
  -- Description
  description_id TEXT,
  description_en TEXT,
  
  -- Category (Quran, Hadith, Worship, etc.)
  category TEXT NOT NULL,
  
  -- Reference (Ayah, Surah, etc.)
  reference TEXT,
  
  -- Featured
  featured BOOLEAN DEFAULT false,
  
  -- Order
  order_index INTEGER DEFAULT 0
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_islamic_category ON islamic(category);
CREATE INDEX IF NOT EXISTS idx_islamic_featured ON islamic(featured);
CREATE INDEX IF NOT EXISTS idx_islamic_order ON islamic(order_index);

-- Enable Row Level Security
ALTER TABLE islamic ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for everyone
CREATE POLICY "Allow read access for everyone" ON islamic
  FOR SELECT USING (true);

-- Create policy to allow insert/update/delete for authenticated users
CREATE POLICY "Allow full access for authenticated users" ON islamic
  FOR ALL USING (auth.role() = 'authenticated');
