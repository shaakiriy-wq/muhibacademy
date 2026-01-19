-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  discount_price DECIMAL(10,2),
  duration TEXT,
  level TEXT DEFAULT 'Boshlangich',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course registrations table
CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  course_slug TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER,
  country TEXT,
  level TEXT,
  status TEXT DEFAULT 'new',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default courses
INSERT INTO courses (slug, title, description, price, discount_price, duration, level) VALUES
('quran-oqish', 'Qur''on o''qish', '2 oyda Qur''on o''qishni 0 dan o''rganing. Professional ustozlar bilan o''qish tajribangizni oshiring.', 500000, 350000, '2 oy', 'Boshlangich'),
('arab-tili', 'Arab tili', 'Arab tilini grammatika va so''zlashuvdan o''rganing. To''liq dastur bilan chuqur bilimga ega bo''ling.', 600000, 420000, '3 oy', 'Boshlangich'),
('islom-asoslari', 'Islom asoslari', 'Islom dinining asosiy tushunchalari va amaliyotlarini puxta o''rganing.', 400000, 280000, '1.5 oy', 'Boshlangich')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (everyone can read)
CREATE POLICY "Courses are viewable by everyone" 
ON courses FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage courses" 
ON courses FOR ALL 
USING (auth.role() = 'service_role');

-- RLS Policies for registrations
CREATE POLICY "Anyone can register for courses" 
ON course_registrations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can view registrations" 
ON course_registrations FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage registrations" 
ON course_registrations FOR ALL 
USING (auth.role() = 'service_role');
