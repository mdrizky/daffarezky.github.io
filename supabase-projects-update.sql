-- Add progress fields to existing projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS start_date TEXT,
ADD COLUMN IF NOT EXISTS completion_date TEXT,
ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS estimated_hours TEXT,
ADD COLUMN IF NOT EXISTS actual_hours TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Medium';

-- Create index for current projects
CREATE INDEX IF NOT EXISTS idx_projects_current ON projects(is_current);
CREATE INDEX IF NOT EXISTS idx_projects_progress ON projects(progress);
