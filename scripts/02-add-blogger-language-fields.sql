-- Add blogger and language fields to short_urls table
ALTER TABLE short_urls 
ADD COLUMN IF NOT EXISTS blogger VARCHAR(255),
ADD COLUMN IF NOT EXISTS language VARCHAR(10);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_short_urls_blogger ON short_urls(blogger);
CREATE INDEX IF NOT EXISTS idx_short_urls_language ON short_urls(language);
