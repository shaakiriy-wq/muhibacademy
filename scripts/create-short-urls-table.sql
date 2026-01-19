-- Create short_urls table for URL shortener
CREATE TABLE IF NOT EXISTS short_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_short_code ON short_urls(short_code);

-- Enable Row Level Security
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we'll handle auth in the app)
CREATE POLICY "Allow all operations on short_urls" ON short_urls
  FOR ALL
  USING (true)
  WITH CHECK (true);
