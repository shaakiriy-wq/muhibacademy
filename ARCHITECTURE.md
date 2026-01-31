# MuhibAcademy - To'liq Texnik Arxitektura

## 📋 Loyiha Umumiy Ma'lumot

**Loyiha nomi:** MuhibAcademy (Islomiy Ta'lim Platformasi)  
**Texnologiya Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Supabase PostgreSQL  
**Deployment:** Vercel (Production)  
**Domain:** muhibacademy.uz (yoki Vercel auto-generated URL)

---

## 🏗️ ARXITEKTURA TUZILISHI

### 1. FRONTEND ARXITEKTURASI

```
MuhibAcademy/
├── app/                          # Next.js 15 App Router
│   ├── page.tsx                  # Bosh sahifa (Landing)
│   ├── darsliklar/               # Kurslar ro'yxati va registratsiya
│   │   └── page.tsx              # Gender-based redirect form
│   ├── turkiye-burslari/         # Turkiya grantlari sahifasi
│   ├── admin/                    # Admin paneli
│   │   ├── page.tsx              # Kurslar boshqaruvi (CRUD)
│   │   ├── leads/                # Ariza berganlar ro'yxati
│   │   ├── demographics/         # Demografik statistika
│   │   ├── bloggers/             # Bloger tahlili
│   │   ├── finance/              # Moliyaviy hisobotlar
│   │   └── ai-consultant/        # AI tahlil va maslahatlar
│   ├── talimci-admin/            # URL shortener admin
│   └── api/                      # Backend API routes
│       ├── courses/              # Kurslar CRUD
│       ├── course-registration/  # Registratsiya
│       ├── bitrix-lead/          # Bitrix24 integratsiyasi
│       ├── analytics/            # Analytics API
│       └── short-urls/           # URL shortener
│
├── components/                   # React komponentlar
│   ├── sections/                 # Sahifa bo'limlari
│   │   ├── universities-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── faq-section.tsx
│   │   └── contact-section.tsx
│   ├── ui/                       # Shadcn UI komponentlar
│   ├── success-modal.tsx         # Muvaffaqiyatli yuborildi popup
│   └── short-url-analytics-modal.tsx
│
├── lib/                          # Utility funksiyalar
│   ├── supabase/
│   │   ├── client.ts            # Client-side Supabase
│   │   └── server.ts            # Server-side Supabase
│   └── utm-tracker.ts           # UTM tracking
│
└── scripts/                      # Database migrations
    ├── 001_create_tables.sql     # Courses & registrations
    ├── 01-create-analytics-tables.sql
    ├── create-short-urls-table.sql
    └── create_muhib_academy_tables.sql
```

---

## 🗄️ DATABASE SCHEMA (Supabase PostgreSQL)

### **Tables:**

#### 1. `courses` - Kurslar ma'lumotlari
```sql
- id (TEXT, PRIMARY KEY)
- title (TEXT)
- subtitle (TEXT)
- description (TEXT)
- duration (TEXT)
- price, old_price (TEXT)
- students_count, rating, reviews_count (INTEGER/DECIMAL)
- image (TEXT)
- instructor_name, instructor_title, instructor_image (TEXT)
- male_redirect_url, female_redirect_url (TEXT) -- Gender-based redirect
- created_at, updated_at (TIMESTAMP)
```

**Default kurslar:**
- `quran` - Qur'on o'qish
- `arabic` - Arab tili
- `islamic-studies` - Islom asoslari

#### 2. `course_registrations` - Ariza berganlar
```sql
- id (UUID, PRIMARY KEY)
- course_id, course_title (TEXT)
- name, phone, age, country, city (TEXT)
- gender (TEXT) -- "54" (Erkak) yoki "56" (Ayol) - Bitrix ID
- level (TEXT)
- contact_preference, whatsapp, telegram (TEXT)
- status (TEXT) -- 'new', 'contacted', 'enrolled', 'cancelled'
- utm_source, utm_medium, utm_campaign (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### 3. `short_urls` - URL Shortener
```sql
- id (UUID)
- code (TEXT, UNIQUE)
- long_url (TEXT)
- short_url (TEXT)
- clicks (INTEGER)
- utm_source, utm_medium, utm_campaign (TEXT)
- created_at (TIMESTAMP)
```

#### 4. `page_visits` - Sahifa tashriflari (Analytics)
```sql
- id (UUID)
- page_url (TEXT)
- referrer, utm_source, utm_medium, utm_campaign (TEXT)
- device_type, browser, os, country, city (TEXT)
- visited_at (TIMESTAMP)
```

#### 5. `form_submissions` - Forma yuborilishlari
```sql
- id (UUID)
- form_type (TEXT) -- 'course_registration', 'contact'
- data (JSONB)
- page_url, utm_source, utm_medium, utm_campaign (TEXT)
- submitted_at (TIMESTAMP)
```

---

## 🔐 AUTHENTICATION & SECURITY

### Row Level Security (RLS) Policies:
- **Public:** Courses o'qish, registratsiya yozish
- **Authenticated:** Admin paneli, barcha ma'lumotlarni o'qish/yangilash

### Environment Variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (server-side only)

# Vercel Blob (fayl yuklash)
BLOB_READ_WRITE_TOKEN=...

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=... (auto)
```

---

## 🔄 KEY FEATURES & LOGIC

### 1. **KURSLAR RO'YXATI VA REGISTRATSIYA**

**Flow:**
1. Foydalanuvchi `/darsliklar` sahifasiga kiradi
2. Kurslar ro'yxati `courses` tabledan yuklanadi (GET `/api/courses`)
3. Kursni tanlaydi va forma to'ldiradi:
   - Ism, telefon, yosh, mamlakat, shahar
   - **Jinsi tanlanadi:** Erkak (54) yoki Ayol (56)
4. Forma submit bo'lganda:
   - `POST /api/course-registration` - Supabase'ga saqlanadi
   - `POST /api/bitrix-lead` - Bitrix24'ga yuboriladi (CRM integratsiya)
5. **Gender-based redirect:**
   - Erkak tanlagan bo'lsa → `male_redirect_url` (Telegram guruh)
   - Ayol tanlagan bo'lsa → `female_redirect_url` (Telegram guruh)
6. Success modal 3 sekund ko'rsatiladi + "Hoziroq o'tish" tugmasi
7. 3 sekunddan keyin popup yopiladi, forma joyida "Muvaffaqiyatli yuborildi" + "Guruhga o'tish" button
8. Refresh qilsa forma o'z holiga qaytadi

**Kod joylashuvi:**
- Form: `app/darsliklar/page.tsx` (line 800-1100)
- API: `app/api/course-registration/route.ts`
- Bitrix: `app/api/bitrix-lead/route.ts`

---

### 2. **ADMIN PANELI (Course Management)**

**Sahifa:** `/admin` (parolsiz kirish mumkin - production'da auth kerak!)

**Funksiyalar:**
1. **Kurslar CRUD:**
   - Yangi kurs qo'shish
   - Mavjud kurslarni tahrirlash (title, price, image, instructor, etc.)
   - **Gender-based redirect URL'lar o'zgartirish** (male/female)
   - Kurslarni o'chirish
2. **Real-time ma'lumotlar:**
   - Jami talabalar, to'lovlar, konversiya
   - Demografik ma'lumotlar (country, city, age distribution)
3. **Tahlillar:**
   - Lead timeline (so'nggi 7 kunlik arizalar)
   - Top mamlakatlar/shaharlar
   - Kurs bo'yicha statistika

**Kod:** `app/admin/page.tsx` (1400+ lines)

---

### 3. **BITRIX24 CRM INTEGRATSIYA**

**Maqsad:** Barcha registratsiyalarni avtomatik Bitrix24 CRM'ga yuborish

**API Endpoint:** `POST /api/bitrix-lead`

**Yuborilgan ma'lumotlar:**
```javascript
{
  NAME: formData.name,
  PHONE: [{ VALUE: formData.phone, VALUE_TYPE: "WORK" }],
  UF_CRM_1234567890: formData.age,        // Custom field
  UF_CRM_COUNTRY: formData.country,
  UF_CRM_CITY: formData.city,
  ASSIGNED_BY_ID: formData.gender,        // "54" yoki "56"
  SOURCE_ID: "FORM",
  UTM_SOURCE: formData.utm_source,
  // ... va boshqalar
}
```

**Webhook URL:** Bitrix webhook endpointi (environment variable)

---

### 4. **UTM TRACKING & ANALYTICS**

**Maqsad:** Marketing kampaniyalarini kuzatish

**Tracking parametrlari:**
- `utm_source` - Manba (telegram, instagram, facebook)
- `utm_medium` - Medium (social, cpc, email)
- `utm_campaign` - Kampaniya nomi

**Implementation:**
1. UTM parametrlar URL'dan olinadi (`lib/utm-tracker.ts`)
2. localStorage'ga saqlanadi (client-side)
3. Forma submit bo'lganda yuboriladi
4. `page_visits` va `form_submissions` tablelariga yoziladi
5. Admin panelda tahlil qilinadi (`/admin/demographics`, `/admin/bloggers`)

---

### 5. **URL SHORTENER**

**Sahifa:** `/talimci-admin/shortener`

**Funksiyalar:**
1. Uzun URL'ni qisqartirish
2. UTM parametrlar qo'shish
3. Clicks tracking
4. Analytics: clicklar, geografiya, device type
5. QR code generatsiya (frontend)

**API Endpoints:**
- `POST /api/shorten` - URL yaratish
- `GET /api/short-urls` - Ro'yxat
- `GET /api/short-urls/[code]/stats` - Statistika
- `GET /[shortCode]` - Redirect (clicks++)

**Database:** `short_urls` table

---

### 6. **AI ANALYTICS (Experimental)**

**Sahifa:** `/admin/ai-consultant`

**Funksiyalar:**
- Lead ma'lumotlarini tahlil qilish
- Konversiya tavsiyalari
- Demografik insights
- AI-powered marketing maslahatlari

**API:** `POST /api/analytics/ai-insights`

**Note:** AI integration keyinchalik to'liq ishga tushiriladi (Vercel AI SDK bilan)

---

## 🎨 FRONTEND COMPONENTS

### **Landing Page Sections:**
1. **Hero Section** - Bosh banner
2. **Universities Section** - Hamkor universitetlar (`components/sections/universities-section.tsx`)
3. **Testimonials** - Talaba sharhlari (`components/sections/testimonials-section.tsx`)
4. **FAQ** - Tez-tez so'raladigan savollar (`components/sections/faq-section.tsx`)
5. **Contact** - Bog'lanish forma (`components/sections/contact-section.tsx`)

### **Custom Components:**
- `success-modal.tsx` - Muvaffaqiyatli yuborish popup
- `magnetic-button.tsx` - Interactive button
- `custom-cursor.tsx` - Custom cursor effect
- `grain-overlay.tsx` - Texture overlay

### **UI Library:** Shadcn UI (60+ komponentlar)

---

## 📊 ANALYTICS DASHBOARD

### **Metrics Tracked:**
1. **Overview:**
   - Jami registratsiyalar
   - Conversion rate
   - Jami daromad (hisoblangan)
   - Top kurslar
2. **Demographics:**
   - Country/City distribution
   - Age groups
   - Gender distribution
3. **Blogger Performance:**
   - UTM source analysis
   - Best performing channels
   - Campaign ROI
4. **Finance:**
   - Revenue by course
   - Monthly trends
   - Student lifetime value

**API Endpoints:**
- `/api/analytics/overview`
- `/api/analytics/demographics`
- `/api/analytics/bloggers`
- `/api/analytics/finance`
- `/api/analytics/geography`

---

## 🚀 DEPLOYMENT WORKFLOW

### **Development:**
```bash
npm run dev          # localhost:3000
```

### **Production (Vercel):**
1. GitHub'ga push
2. Vercel auto-deploy
3. Environment variables Vercel dashboard'dan qo'shiladi
4. Custom domain: muhibacademy.uz → Vercel project'ga ulash

### **Database Migrations:**
1. Supabase SQL Editor'da script run qilish
2. yoki `scripts/` folder'dagi .sql fayllarni copy-paste

---

## 🔧 CONFIGURATION

### **Tailwind CSS v4:**
- `app/globals.css` - Theme variables, fonts
- Design tokens: `--primary`, `--secondary`, `--accent`, etc.
- Fonts: Poppins (sans), Noto Nastaliq Urdu (Islomiy matn uchun)

### **Next.js Config:**
- `next.config.mjs` - Image optimization, external domains

### **TypeScript:**
- Strict mode
- Path aliases: `@/*` → project root

---

## 📱 RESPONSIVE DESIGN

- **Mobile-first approach**
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Adaptive forms and tables
- Touch-friendly UI

---

## 🐛 DEBUGGING

### **Console Logs:**
- `[v0]` prefixi bilan debug messages
- Example: `console.log("[v0] REDIRECT DEBUG:", formData.gender)`

### **Error Handling:**
- Try-catch blocks in API routes
- User-friendly error messages
- Sentry integration (keyinchalik)

---

## 🔮 FUTURE ENHANCEMENTS

1. **Authentication:**
   - Admin panel uchun Supabase Auth
   - Role-based access control
2. **Payment Gateway:**
   - Online to'lov integratsiyasi
   - Stripe yoki Click/Payme
3. **Student Portal:**
   - Personal dashboard
   - Course progress tracking
   - Certificates
4. **Video Lessons:**
   - Video hosting (Bunny.net, Cloudflare Stream)
   - DRM protection
5. **Mobile App:**
   - React Native
   - Push notifications
6. **Email Automation:**
   - Welcome emails (Resend, SendGrid)
   - Course reminders

---

## 📞 SUPPORT & CONTACTS

- **Telegram:** @MuhibAcademy
- **Phone:** +998 XX XXX XX XX
- **Email:** info@muhibacademy.uz

---

## ⚙️ TECHNICAL STACK SUMMARY

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Component Library** | Shadcn UI |
| **Database** | Supabase (PostgreSQL 15) |
| **Storage** | Vercel Blob |
| **Analytics** | Vercel Analytics, Custom Analytics |
| **Deployment** | Vercel |
| **Version Control** | Git, GitHub |
| **CRM Integration** | Bitrix24 Webhook |

---

## 📄 LICENSE & OWNERSHIP

© 2026 MuhibAcademy. Barcha huquqlar himoyalangan.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Maintained By:** Development Team
