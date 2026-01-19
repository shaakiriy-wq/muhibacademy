-- Analytics events tracking table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  ip_address VARCHAR(45),
  session_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Short URLs table with enhanced tracking
CREATE TABLE IF NOT EXISTS short_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Short URL clicks tracking
CREATE TABLE IF NOT EXISTS short_url_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_url_id UUID REFERENCES short_urls(id) ON DELETE CASCADE,
  short_code VARCHAR(20) NOT NULL,
  user_agent TEXT,
  device_type VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  ip_address VARCHAR(45),
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form submissions tracking
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  service_type VARCHAR(100),
  full_name VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  country VARCHAR(100),
  step_completed INTEGER DEFAULT 4,
  form_data JSONB,
  clicked_bot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign budgets table
CREATE TABLE IF NOT EXISTS campaign_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name VARCHAR(255) UNIQUE NOT NULL,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  daily_budget DECIMAL(10, 2),
  total_budget DECIMAL(10, 2),
  spent DECIMAL(10, 2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_source ON analytics_events(utm_source);
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_campaign ON analytics_events(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_short_urls_short_code ON short_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_short_urls_created_at ON short_urls(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_short_url_clicks_short_url_id ON short_url_clicks(short_url_id);
CREATE INDEX IF NOT EXISTS idx_short_url_clicks_clicked_at ON short_url_clicks(clicked_at DESC);

CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_utm_campaign ON form_submissions(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON form_submissions(session_id);
