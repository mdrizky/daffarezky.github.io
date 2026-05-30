-- Create experience table for leadership and non-technical experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic info
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  
  -- Description
  description_id TEXT,
  description_en TEXT,
  
  -- Category (Leadership, Religious, Training, etc.)
  category TEXT NOT NULL,
  
  -- Order
  order_index INTEGER DEFAULT 0
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_experience_category ON experience(category);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(order_index);

-- Enable Row Level Security
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for everyone
CREATE POLICY "Allow read access for everyone" ON experience
  FOR SELECT USING (true);

-- Create policy to allow insert/update/delete for authenticated users
CREATE POLICY "Allow full access for authenticated users" ON experience
  FOR ALL USING (auth.role() = 'authenticated');
