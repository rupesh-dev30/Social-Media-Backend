-- Add scheduled_at and is_published to posts
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP DEFAULT NULL;

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
