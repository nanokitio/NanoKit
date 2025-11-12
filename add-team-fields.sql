-- Add team member fields to sites table
-- Run this in your Supabase SQL Editor

ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS featured_player TEXT,
ADD COLUMN IF NOT EXISTS sport_director TEXT;

-- Add comments for documentation
COMMENT ON COLUMN sites.featured_player IS 'Name of featured player (e.g., "Ale Miranda")';
COMMENT ON COLUMN sites.sport_director IS 'Name of sport director (e.g., "Nicolás Cantudo")';
