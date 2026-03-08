# MuhibAcademy - To'liq Backend Dokumentatsiyasi

## 📋 Mundarija
1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Bitrix24 Integratsiyasi](#bitrix24-integratsiyasi)
4. [Supabase Konfiguratsiya](#supabase-konfiguratsiya)
5. [Gender-based Redirect Logic](#gender-based-redirect-logic)
6. [UTM Tracking](#utm-tracking)
7. [Environment Variables](#environment-variables)

---

## 🗄️ Database Schema

### 1. `courses` Table
\`\`\`sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  full_description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  discount_price DECIMAL(10,2),
  duration TEXT,
  level TEXT DEFAULT 'Boshlangich',
  lessons TEXT,
  students TEXT,
  rating DECIMAL(3,2),
  reviews INTEGER,
  video_url TEXT,
  redirect_url TEXT DEFAULT 'https://t.me/MuhibAcademyBot',
  male_redirect_url TEXT DEFAULT 'https://t.me/MuhibAcademyBot',
  female_redirect_url TEXT DEFAULT 'https://t.me/MuhibAcademyBot',
  instructor JSONB,
  features JSONB,
  roadmap JSONB,
  testimonials JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Maydonlar:**
- `slug`: Unique URL identifier (masalan: "quran-oqish")
- `title`: Kurs nomi
- `subtitle`: Qisqa tavsif
- `description`: Umumiy tavsif
- `full_description`: To'liq batafsil tavsif
- `price`: Asl narx (so'm)
- `discount_price`: Chegirmali narx
- `male_redirect_url`: Erkaklar uchun Telegram bot linki
- `female_redirect_url`: Ayollar uchun Telegram bot linki
- `instructor`: JSON - ustoz ma'lumotlari
- `features`: JSON array - kurs xususiyatlari
- `roadmap`: JSON array - o'quv rejasi
- `testimonials`: JSON array - sharhlar

### 2. `course_registrations` Table
\`\`\`sql
CREATE TABLE course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  course_slug TEXT,
  course_title TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  country TEXT,
  level TEXT,
  contact_method TEXT,
  whatsapp TEXT,
  telegram TEXT,
  bitrix_contact_id INTEGER,
  bitrix_deal_id INTEGER,
  status TEXT DEFAULT 'new',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  short_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Maydonlar:**
- `full_name`: To'liq ism
- `phone`: Telefon raqam (format: +998XXXXXXXXX)
- `age`: Yosh
- `gender`: Jins (Bitrix ID: "54" erkak, "56" ayol)
- `country`: Mamlakat
- `level`: Bilim darajasi
- `contact_method`: Bog'lanish usuli (WhatsApp/Telegram)
- `bitrix_contact_id`: Bitrix24 Contact ID
- `bitrix_deal_id`: Bitrix24 Deal ID
- `utm_*`: Marketing trackinglar

---

## 🔌 API Endpoints

### 1. Courses API
**File:** `app/api/courses/route.ts`

#### GET `/api/courses`
Barcha kurslarni olish

**Response:**
\`\`\`json
{
  "success": true,
  "courses": [
    {
      "id": "uuid",
      "slug": "quran-oqish",
      "title": "Qur'on o'qish",
      "price": 500000,
      "discount_price": 350000,
      "male_redirect_url": "https://t.me/bot1",
      "female_redirect_url": "https://t.me/bot2",
      "instructor": {
        "name": "Shayx Muhammad",
        "image": "/path.jpg",
        "title": "Qori",
        "experience": "10+ yil",
        "students": "500+"
      },
      "features": ["24 ta dars", "Zoom", "Sertifikat"],
      "roadmap": [
        {
          "week": "1-2 hafta",
          "title": "Alifbo",
          "description": "Harflar",
          "lessons": "12 dars"
        }
      ]
    }
  ],
  "isFallback": false
}
\`\`\`

#### POST `/api/courses`
Yangi kurs yaratish (Admin)

**Request Body:**
\`\`\`json
{
  "slug": "yangi-kurs",
  "title": "Yangi Kurs",
  "subtitle": "Qisqa tavsif",
  "description": "Umumiy tavsif",
  "fullDescription": "To'liq tavsif",
  "price": 500000,
  "discount_price": 350000,
  "duration": "2 oy",
  "level": "Boshlang'ich",
  "lessons": "48 ta dars",
  "students": "500+",
  "rating": 4.9,
  "reviews": 156,
  "videoUrl": "https://youtube.com/embed/...",
  "male_redirect_url": "https://t.me/bot_erkak",
  "female_redirect_url": "https://t.me/bot_ayol",
  "instructor": {
    "name": "Ustoz",
    "image": "/path.jpg",
    "title": "Mutaxassis",
    "experience": "10+ yil",
    "students": "500+"
  },
  "features": ["Feature 1", "Feature 2"],
  "roadmap": [...],
  "testimonials": [...],
  "is_active": true
}
\`\`\`

#### PUT `/api/courses`
Kursni yangilash

**Request Body:** (POST bilan bir xil + `id` field)

#### DELETE `/api/courses?id={uuid}`
Kursni o'chirish

---

### 2. Course Registration API
**File:** `app/api/course-registration/route.ts`

#### POST `/api/course-registration`
Kursga ro'yxatdan o'tish

**Request Body:**
\`\`\`json
{
  "courseSlug": "quran-oqish",
  "courseTitle": "Qur'on o'qish",
  "fullName": "Ali Valiyev",
  "phone": "+998901234567",
  "age": "25",
  "country": "O'zbekiston",
  "level": "Boshlang'ich",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "summer2024"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "registration": {
    "id": "uuid",
    "full_name": "Ali Valiyev",
    "phone": "+998901234567",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

#### GET `/api/course-registration`
Barcha ro'yxatlarni olish (Admin)

**Response:**
\`\`\`json
{
  "success": true,
  "registrations": [...],
  "courseStats": {
    "quran-oqish": {
      "count": 150,
      "title": "Qur'on o'qish"
    }
  },
  "totalRegistrations": 450
}
\`\`\`

---

### 3. Bitrix24 Integration API
**File:** `app/api/bitrix-lead/route.ts`

#### POST `/api/bitrix-lead`
Bitrix24'ga Contact va Deal yaratish

**Bitrix24 Endpoints:**
- **Contact:** `https://muhibacademy.bitrix24.kz/rest/1/c6llyvjpjzj7h78z/crm.contact.add.json`
- **Deal:** `https://muhibacademy.bitrix24.kz/rest/1/eu84ey6vrebqa3t2/crm.deal.add.json`

**Request Body:**
\`\`\`json
{
  "name": "Ali Valiyev",
  "phone": "+998901234567",
  "phoneCountry": "UZ",
  "age": "25",
  "gender": "54",
  "country": "O'zbekiston",
  "level": "138",
  "contactMethod": "146",
  "whatsapp": "+998901234567",
  "telegram": "@alibekuz",
  "course": "Qur'on o'qish",
  "courseId": "uuid",
  "shortCode": "abc123"
}
\`\`\`

**Bitrix Field Mapping:**

| Field | Bitrix ID | Description |
|-------|-----------|-------------|
| Age | `UF_CRM_1762609797890` | Yosh (number) |
| Gender | `UF_CRM_1762609867288` | Jins (54=erkak, 56=ayol) |
| Country | `UF_CRM_1768500113` | Mamlakat |
| Level | `UF_CRM_1762609680665` | Bilim darajasi |
| Contact Method | `UF_CRM_1768499381897` | Bog'lanish (146=WhatsApp, 148=Telegram) |
| WhatsApp | `UF_CRM_1768499301767` | WhatsApp link |
| Telegram | `UF_CRM_1768499273042` | Telegram link |
| ShortURL Stats | `UF_CRM_1768501957987` | Short URL statistika linki |

**Gender Codes:**
- `54` - Erkak (Male)
- `56` - Ayol (Female)

**Level Codes:**
- `138` - Boshlang'ich
- `140` - O'rta
- `142` - Yuqori

**Contact Method Codes:**
- `146` - WhatsApp
- `148` - Telegram

**Process Flow:**
1. Telefon validatsiya (+998 format)
2. Telegram (@username → t.me link + email)
3. WhatsApp (wa.me link)
4. Bitrix24'ga Contact yaratish
5. Contact ID bilan Deal yaratish
6. Supabase'ga saqlash
7. Response qaytarish

**Response:**
\`\`\`json
{
  "success": true,
  "contactId": 12345,
  "dealId": 67890,
  "message": "Contact va Deal muvaffaqiyatli yaratildi"
}
\`\`\`

**Error Handling:**
- 400: Validatsiya xatosi
- 500: Bitrix24 yoki Server xatosi

---

### 4. Registrations API
**File:** `app/api/registrations/route.ts`

#### GET `/api/registrations?days=7`
So'nggi N kundagi ro'yxatlarni olish

**Query Parameters:**
- `days`: Kunlar soni (default: 7)

**Response:**
\`\`\`json
{
  "success": true,
  "registrations": [...],
  "total": 45
}
\`\`\`

---

## 🔗 Bitrix24 Integratsiyasi

### Webhook URLs
\`\`\`
Contact API: https://muhibacademy.bitrix24.kz/rest/1/c6llyvjpjzj7h78z/crm.contact.add.json
Deal API: https://muhibacademy.bitrix24.kz/rest/1/eu84ey6vrebqa3t2/crm.deal.add.json
\`\`\`

### Contact Fields
\`\`\`json
{
  "NAME": "Ali",
  "LAST_NAME": "Valiyev",
  "PHONE": [{"VALUE": "+998901234567", "VALUE_TYPE": "WORK"}],
  "EMAIL": [{"VALUE": "username@telegram.chatapp.online", "VALUE_TYPE": "WORK"}]
}
\`\`\`

### Deal Fields
\`\`\`json
{
  "TITLE": "Ali Valiyev - Qur'on o'qish",
  "CONTACT_ID": 12345,
  "UF_CRM_1762609797890": 25,
  "UF_CRM_1762609867288": 54,
  "UF_CRM_1768500113": "O'zbekiston",
  "UF_CRM_1762609680665": 138,
  "UF_CRM_1768499381897": 146,
  "UF_CRM_1768499301767": "https://wa.me/998901234567",
  "UF_CRM_1768499273042": "https://t.me/username",
  "UF_CRM_1768501957987": "https://muhibacademy.uz/s/abc123/stats",
  "COMMENTS": "Kurs: Qur'on o'qish\nKurs ID: uuid\nShortURL: muhibacademy.uz/s/abc123"
}
\`\`\`

---

## 🎯 Gender-based Redirect Logic

### Frontend Logic
**File:** `app/darsliklar/page.tsx` (line 254-260)

\`\`\`typescript
// Gender check: "56" = female, else male
const redirectUrl = formData.gender === "56" 
  ? selectedCourseData.female_redirect_url 
  : selectedCourseData.male_redirect_url

// Fallback to default
const finalRedirectUrl = redirectUrl || "https://t.me/MuhibAcademyBot"

// Redirect after 3 seconds or instant button click
window.location.href = finalRedirectUrl
\`\`\`

### Form Gender Values
\`\`\`typescript
// Line 927-945
<button 
  onClick={() => setFormData({...formData, gender: "54"})}
>
  Erkak
</button>

<button 
  onClick={() => setFormData({...formData, gender: "56"})}
>
  Ayol
</button>
\`\`\`

### Course Data Structure
\`\`\`typescript
{
  male_redirect_url: "https://t.me/MuhibAcademyBot?start=w49362090", // Erkaklar uchun
  female_redirect_url: "https://t.me/MuhibAcademyBot?start=w49362088" // Ayollar uchun
}
\`\`\`

---

## 📊 UTM Tracking

### UTM Parameters
- `utm_source`: Traffic manbai (google, facebook, telegram)
- `utm_medium`: Marketing kanali (cpc, social, organic)
- `utm_campaign`: Kampaniya nomi (summer2024, ramadan)
- `utm_content`: Kontent identifikatori
- `utm_term`: Kalit so'zlar

### Tracking Flow
1. URL parametrlarni olish
2. localStorage'ga saqlash
3. Forma yuborishda qo'shish
4. Supabase'ga saqlash
5. Bitrix24 Comments'ga qo'shish

### Example URL
\`\`\`
https://muhibacademy.uz/darsliklar?
  utm_source=google&
  utm_medium=cpc&
  utm_campaign=quran2024&
  utm_content=homepage_banner
\`\`\`

---

## 🗃️ Supabase Konfiguratsiya

### Client Setup
**File:** `lib/supabase/client.ts`

\`\`\`typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

### Server Setup
**File:** `lib/supabase/server.ts`

\`\`\`typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          )
        }
      }
    }
  )
}
\`\`\`

### Row Level Security (RLS)

\`\`\`sql
-- Courses (Public Read, Service Role Write)
CREATE POLICY "Courses are viewable by everyone" 
ON courses FOR SELECT USING (true);

CREATE POLICY "Service role can manage courses" 
ON courses FOR ALL USING (auth.role() = 'service_role');

-- Registrations (Public Insert, Service Role Read)
CREATE POLICY "Anyone can register for courses" 
ON course_registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view registrations" 
ON course_registrations FOR SELECT 
USING (auth.role() = 'service_role');
\`\`\`

---

## 🔐 Environment Variables

### Required Variables
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel Blob (Image upload)
BLOB_READ_WRITE_TOKEN=your-blob-token

# Vercel Analytics (Automatic)
# No env vars needed - works automatically after deploy
\`\`\`

### Bitrix24 URLs (Hardcoded)
\`\`\`typescript
const BITRIX_CONTACT_URL = "https://muhibacademy.bitrix24.kz/rest/1/c6llyvjpjzj7h78z/crm.contact.add.json"
const BITRIX_DEAL_URL = "https://muhibacademy.bitrix24.kz/rest/1/eu84ey6vrebqa3t2/crm.deal.add.json"
\`\`\`

---

## 🚀 Deployment Checklist

### 1. Database Setup
\`\`\`bash
# Run migrations in Supabase SQL Editor
- scripts/create_muhib_academy_tables.sql
\`\`\`

### 2. Environment Variables
- Set all Supabase credentials in Vercel
- Set BLOB_READ_WRITE_TOKEN for image uploads

### 3. Bitrix24 Setup
- Verify webhook URLs are active
- Test Contact creation
- Test Deal creation with custom fields

### 4. Testing
\`\`\`bash
# Test course creation
POST /api/courses

# Test registration
POST /api/course-registration

# Test Bitrix integration
POST /api/bitrix-lead

# Test gender redirect
- Select Male → Check male_redirect_url
- Select Female → Check female_redirect_url
\`\`\`

### 5. Vercel Analytics
- Auto-enabled after first deploy
- Check Dashboard → Analytics tab

---

## 📝 API Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Validatsiya xatosi | Form ma'lumotlarini tekshiring |
| 401 | Autentifikatsiya xatosi | API keylarni tekshiring |
| 404 | Topilmadi | URL yoki ID'ni tekshiring |
| 500 | Server xatosi | Logs'ni tekshiring |

---

## 🔧 Debug Tips

### Enable Debug Logs
\`\`\`typescript
console.log("[v0] Variable:", variable)
console.log("[v0] API Response:", response)
console.log("[v0] Bitrix Data:", bitrixData)
\`\`\`

### Check Database
\`\`\`sql
-- Recent registrations
SELECT * FROM course_registrations 
ORDER BY created_at DESC LIMIT 10;

-- Course stats
SELECT course_slug, COUNT(*) as total
FROM course_registrations
GROUP BY course_slug;
\`\`\`

### Check Bitrix24
1. Login to Bitrix24: https://muhibacademy.bitrix24.kz
2. CRM → Contacts → Check recent contacts
3. CRM → Deals → Check recent deals
4. Check custom field values

---

## 📞 Contact & Support

**Project:** MuhibAcademy
**Tech Stack:** Next.js 15, Supabase, Bitrix24, Vercel
**Database:** PostgreSQL (Supabase)
**Deployment:** Vercel

Bu dokumentatsiya MuhibAcademy backend'ining to'liq texnik tuzilishini, API endpoints, Bitrix24 integratsiyasi va barcha business logikalarini qamrab oladi.
