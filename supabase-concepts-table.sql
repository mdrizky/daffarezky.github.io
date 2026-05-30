-- Create concepts table for future ideas and concepts
CREATE TABLE IF NOT EXISTS concepts (
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
  
  -- Technology/Stack
  technology TEXT[],
  
  -- Status (Concept, In Progress, Planned)
  status TEXT DEFAULT 'Concept',
  
  -- Featured
  featured BOOLEAN DEFAULT false,
  
  -- Order
  order_index INTEGER DEFAULT 0
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_concepts_status ON concepts(status);
CREATE INDEX IF NOT EXISTS idx_concepts_featured ON concepts(featured);
CREATE INDEX IF NOT EXISTS idx_concepts_order ON concepts(order_index);

-- Enable Row Level Security
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access for everyone" ON concepts;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON concepts;

-- Create policy to allow read access for everyone
CREATE POLICY "Allow read access for everyone" ON concepts
  FOR SELECT USING (true);

-- Create policy to allow insert/update/delete for authenticated users
CREATE POLICY "Allow full access for authenticated users" ON concepts
  FOR ALL USING (auth.role() = 'authenticated');
