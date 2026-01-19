-- Muhib Academy Database Schema
-- Course registrations table

-- Drop existing tables if they exist (for fresh start)
DROP TABLE IF EXISTS course_registrations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Create courses table
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  duration TEXT,
  price TEXT,
  old_price TEXT,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  image TEXT,
  start_date TEXT,
  lessons TEXT,
  level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_registrations table (leads/applications)
CREATE TABLE course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
  course_title TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age TEXT,
  country TEXT,
  city TEXT,
  level TEXT,
  contact_preference TEXT,
  whatsapp TEXT,
  telegram TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'cancelled')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default courses
INSERT INTO courses (id, title, subtitle, description, duration, price, old_price, students_count, rating, reviews_count, image, start_date, lessons, level) VALUES
('quran', 'Qur''on o''qish', '0 dan professional darajagacha', 'Qur''on o''qishni 0 dan boshlab professional darajada o''rganing.', '6 oy', '500,000 so''m/oy', '700,000 so''m/oy', 200, 4.9, 156, '/quran-reading-islamic-education.jpg', '15 Yanvar 2026', '48 ta dars', 'Boshlang''ich'),
('arabic', 'Arab tili', 'Amaliy va nazariy chuqur bilim', 'Arab tilini amaliy va nazariy jihatdan chuqur o''rganing.', '8 oy', '600,000 so''m/oy', '850,000 so''m/oy', 150, 4.8, 128, '/arabic-language-learning-islamic-calligraphy.jpg', '20 Yanvar 2026', '64 ta dars', 'Boshlang''ich - O''rta'),
('islamic-studies', 'Islom asoslari', 'Din asoslari va amaliy bilimlar', 'Islom dinining asoslari, tarixi va amaliy bilimlarni o''rganing.', '4 oy', '400,000 so''m/oy', '550,000 so''m/oy', 180, 5.0, 142, '/islamic-studies-mosque-education.jpg', '25 Yanvar 2026', '32 ta dars', 'Barcha darajalar');

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to courses
CREATE POLICY "Allow public read access to courses" ON courses FOR SELECT TO anon USING (true);

-- Create policies for course_registrations (public can insert, only authenticated can read/update)
CREATE POLICY "Allow public insert to registrations" ON course_registrations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated read registrations" ON course_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update registrations" ON course_registrations FOR UPDATE TO authenticated USING (true);

-- Create index for faster queries
CREATE INDEX idx_registrations_course_id ON course_registrations(course_id);
CREATE INDEX idx_registrations_status ON course_registrations(status);
CREATE INDEX idx_registrations_created_at ON course_registrations(created_at DESC);
