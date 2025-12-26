-- Add unique_id column to prelander_deployments table
ALTER TABLE prelander_deployments 
ADD COLUMN unique_id TEXT;

-- Add unique constraint to prevent duplicate IDs
ALTER TABLE prelander_deployments 
ADD CONSTRAINT unique_id_unique UNIQUE (unique_id);

-- Add index for fast lookups by unique_id
CREATE INDEX idx_prelander_deployments_unique_id ON prelander_deployments(unique_id);

-- Add comment for documentation
COMMENT ON COLUMN prelander_deployments.unique_id IS 'Short unique identifier for public URLs (e.g., landertag.com/[unique_id])';
