-- Add background customization fields to sites table
ALTER TABLE sites
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e',
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN sites.background_color IS 'Background color in hex format (e.g., #1a1a2e)';
COMMENT ON COLUMN sites.background_image IS 'URL to custom background image (optional)';
