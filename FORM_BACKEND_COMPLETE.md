# MuhibAcademy - To'liq Forma va Backend Dokumentatsiyasi

## 📋 Mundarija
1. [Forma Dizayni va Tuzilishi](#forma-dizayni)
2. [Backend API'lar](#backend-apilar)
3. [Bitrix24 Integratsiyasi](#bitrix24-integratsiyasi)
4. [Database Schema](#database-schema)
5. [Gender-based Redirect](#gender-redirect)
6. [To'liq Kod Misollari](#kod-misollari)

---

## 🎨 Forma Dizayni va Tuzilishi

### Forma Joylashuvi
- **URL**: `/darsliklar`
- **Component**: `app/darsliklar/page.tsx`
- **Turi**: Multi-step forma (3 bosqich)

### Vizual Dizayn Elementlari

#### 1. **Kurs Tanlash Kartochkalari**
\`\`\`typescript
// Kurs kartochkasi dizayni:
- Gradient fon (bg-gradient-to-br)
- Glassmorphism effekti (backdrop-blur-sm)
- Hover animatsiyalari
- Kurs rasmi (instructor_image)
- Kurs ma'lumotlari:
  - Title
  - Description
  - Duration
  - Students count
  - Level
  - Price va chegirma
  - "3 ta dars BEPUL" badge
\`\`\`

#### 2. **Forma Bosqichlari Progressi**
\`\`\`typescript
// Step indicator:
Step 1/3: Shaxsiy ma'lumotlar
Step 2/3: Ta'lim ma'lumotlari  
Step 3/3: Bog'lanish
\`\`\`

### 3 Bosqichli Forma Strukturasi

#### **BOSQICH 1: Shaxsiy Ma'lumotlar**

**Fieldlar:**

1. **Ism Familiya** (`name`)
   - Placeholder: "Ismingizni kiriting"
   - Validation: majburiy
   - Type: text

2. **Telefon Raqam** (`phone`)
   - Format: Country selector + raqam
   - Default davlat: O'zbekiston (+998)
   - 122 ta davlat bilan dropdown
   - Har davlat uchun maxsus raqam uzunligi
   - Validation: davlatga qarab (UZ = 9 raqam, US = 10, va h.k.)
   
   \`\`\`typescript
   // Country selector struktura:
   {
     code: "UZ",
     name: "O'zbekiston", 
     flag: "🇺🇿",
     phoneCode: "+998"
   }
   \`\`\`

3. **Yosh** (`age`)
   - Type: number
   - Placeholder: "Yoshingiz"
   - Validation: majburiy

4. **Jinsi** (`gender`)
   - Radio buttons:
     - Erkak (value: "54" - Bitrix ID)
     - Ayol (value: "56" - Bitrix ID)
   - Vizual: Icon + rang (erkak - ko'k, ayol - pushti)

#### **BOSQICH 2: Ta'lim Ma'lumotlari**

1. **Davlat** (`country`)
   - Dropdown selector
   - 122 ta davlat ro'yxati
   - Qidiruv funksiyasi
   - Flag emoji + davlat nomi

2. **Arab tili darajasi** (`level`)
   - Radio buttons:
     - "Noldan boshlayman" (44)
     - "Kamdan-kam o'qiy olaman" (46)  
     - "O'rtacha o'qiyman" (48)
     - "Yaxshi o'qiyman" (50)
     - "A'lo darajada" (52)
   - Har bir level uchun emoji + tavsif

#### **BOSQICH 3: Bog'lanish**

1. **Bog'lanish usuli** (`contactMethod`)
   - Radio buttons:
     - Telefon orqali (58)
     - WhatsApp orqali (60)
     - Telegram orqali (62)

2. **WhatsApp** (`whatsapp`)
   - Conditional: agar foydalanuvchi WhatsApp'ga ega bo'lsa
   - Country selector + raqam
   - "Telefon raqamimni nusxalash" tugmasi
   - Format: +998XXXXXXXXX

3. **Telegram** (`telegram`)
   - Placeholder: "@username yoki username"
   - @ belgi avtomatik olib tashlanadi
   - Validation: majburiy

---

## 🔧 Backend API'lar

### 1. Courses API
**Endpoint**: `GET /api/courses`

**Response:**
\`\`\`json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "slug": "arab-tili-boshlangich",
      "title": "Arab tili boshlang'ich",
      "description": "Noldan arab tilini o'rganish",
      "instructor_name": "Ustoz Muhammad",
      "instructor_bio": "10 yillik tajriba",
      "instructor_image": "https://...",
      "duration": "3 oy",
      "students_count": 150,
      "level": "Boshlang'ich",
      "price": 500000,
      "discount_price": 350000,
      "is_active": true,
      "male_redirect_url": "https://t.me/MuhibAcademyBot?start=w49362090",
      "female_redirect_url": "https://t.me/MuhibAcademyBot?start=w49362088",
      "redirect_url": "https://t.me/MuhibAcademyBot",
      "features": ["3 dars bepul", "Jonli darslar", "Sertifikat"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

**Kod:**
\`\`\`typescript
// app/api/courses/route.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }

  // Transform data
  const transformed = courses.map(course => ({
    ...course,
    male_redirect_url: course.male_redirect_url || course.redirect_url,
    female_redirect_url: course.female_redirect_url || course.redirect_url,
  }))

  return NextResponse.json({ 
    success: true, 
    courses: transformed 
  })
}
\`\`\`

### 2. Bitrix24 Lead API
**Endpoint**: `POST /api/bitrix-lead`

**Request Body:**
\`\`\`json
{
  "name": "Alisher Karimov",
  "phone": "+998901234567",
  "phoneCountry": "UZ",
  "age": "25",
  "gender": "54",
  "country": "O'zbekiston",
  "level": "44",
  "contactMethod": "60",
  "whatsapp": "+998901234567",
  "telegram": "alisher_uz",
  "course": "Arab tili boshlang'ich",
  "courseId": "arab-tili-boshlangich",
  "shortCode": "abc123"
}
\`\`\`

**Bitrix24 Field Mapping:**

| Form Field | Bitrix Field | Type | Description |
|-----------|-------------|------|-------------|
| name | NAME + LAST_NAME | string | Ism/Familiya |
| phone | PHONE | array | [{VALUE: "+998...", VALUE_TYPE: "WORK"}] |
| telegram | EMAIL | array | [{VALUE: "user@telegram.chatapp.online"}] |
| age | UF_CRM_1762609797890 | number | Yosh |
| gender | UF_CRM_1762609867288 | number | 54=Erkak, 56=Ayol |
| country | UF_CRM_1768500113 | string | Davlat |
| level | UF_CRM_1762609680665 | number | Daraja kodi |
| contactMethod | UF_CRM_1768499381897 | number | Bog'lanish usuli |
| whatsapp | UF_CRM_1768499301767 | string | WhatsApp link |
| telegram | UF_CRM_1768499273042 | string | Telegram link |
| shortCode | UF_CRM_1768501957987 | string | Stats link |

**Bitrix Webhook URLs:**
\`\`\`typescript
const BITRIX_CONTACT_URL = 
  "https://muhibacademy.bitrix24.kz/rest/1/c6llyvjpjzj7h78z/crm.contact.add.json"
  
const BITRIX_DEAL_URL = 
  "https://muhibacademy.bitrix24.kz/rest/1/eu84ey6vrebqa3t2/crm.deal.add.json"
\`\`\`

**To'liq Bitrix Integration Kodi:**
\`\`\`typescript
// app/api/bitrix-lead/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, age, gender, country, level, 
          contactMethod, whatsapp, telegram, course } = body

  // 1. Ismni bo'lish
  const [firstName, ...lastNameParts] = name.trim().split(" ")
  const lastName = lastNameParts.join(" ")

  // 2. Telegram formatlash
  const cleanTelegram = telegram.replace(/^@/, "")
  const telegramLink = `https://t.me/${cleanTelegram}`
  const telegramEmail = `${cleanTelegram}@telegram.chatapp.online`

  // 3. WhatsApp formatlash
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`

  // 4. Contact yaratish
  const contactFields = {
    NAME: firstName,
    LAST_NAME: lastName,
    PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
    EMAIL: [{ VALUE: telegramEmail, VALUE_TYPE: "WORK" }]
  }

  const contactResponse = await fetch(BITRIX_CONTACT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: contactFields })
  })

  const { result: contactId } = await contactResponse.json()

  // 5. Deal yaratish
  const dealFields = {
    TITLE: `${name} - ${course}`,
    CONTACT_ID: contactId,
    UF_CRM_1762609797890: parseInt(age),
    UF_CRM_1762609867288: parseInt(gender),
    UF_CRM_1768500113: country,
    UF_CRM_1762609680665: parseInt(level),
    UF_CRM_1768499381897: parseInt(contactMethod),
    UF_CRM_1768499301767: whatsappLink,
    UF_CRM_1768499273042: telegramLink,
    COMMENTS: `Kurs: ${course}`
  }

  const dealResponse = await fetch(BITRIX_DEAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: dealFields })
  })

  const { result: dealId } = await dealResponse.json()

  return NextResponse.json({ 
    success: true, 
    contactId, 
    dealId 
  })
}
\`\`\`

### 3. Course Registration API
**Endpoint**: `POST /api/course-registration`

**Ma'lumotlarni Supabase'ga saqlash:**
\`\`\`typescript
const { data, error } = await supabase
  .from("course_registrations")
  .insert({
    course_slug: courseSlug,
    course_title: courseTitle,
    full_name: fullName,
    phone: phone,
    age: parseInt(age),
    country: country,
    level: level,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    status: "new"
  })
  .select()
  .single()
\`\`\`

---

## 🗄️ Database Schema

### courses jadval
\`\`\`sql
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  instructor_bio TEXT,
  instructor_image TEXT,
  duration TEXT,
  students_count INTEGER DEFAULT 0,
  level TEXT,
  price DECIMAL(10, 2),
  discount_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  
  -- Redirect URLs
  redirect_url TEXT DEFAULT 'https://t.me/MuhibAcademyBot',
  male_redirect_url TEXT DEFAULT 'https://t.me/MuhibAcademyBot',
  female_redirect_url TEXT DEFAULT 'https://t.me/MuhibAcademyBot',
  
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### course_registrations jadval
\`\`\`sql
CREATE TABLE course_registrations (
  id BIGSERIAL PRIMARY KEY,
  course_slug TEXT,
  course_title TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER,
  country TEXT,
  level TEXT,
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Bitrix integration
  bitrix_contact_id TEXT,
  bitrix_deal_id TEXT,
  
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

---

## 🚀 Gender-based Redirect Mexanizmi

### Redirect Logikasi

\`\`\`typescript
// Formada jins tanlanadi
const formData = {
  gender: "56" // 54=Erkak, 56=Ayol
}

// Submit muvaffaqiyatli bo'lgach
const redirectUrl = 
  formData.gender === "56"
    ? selectedCourseData?.female_redirect_url ||
      selectedCourseData?.redirect_url ||
      "https://t.me/MuhibAcademyBot"
    : selectedCourseData?.male_redirect_url ||
      selectedCourseData?.redirect_url ||
      "https://t.me/MuhibAcademyBot"

// 3 sekund countdown
setRedirectCountdown(3)

// Countdown tugagach redirect
useEffect(() => {
  if (redirectCountdown === 1) {
    window.location.href = redirectUrl
  }
}, [redirectCountdown])
\`\`\`

### Admin Panel - Redirect URL Sozlash

Admin panelda har bir kurs uchun:
1. **Erkaklar uchun Redirect URL** (ko'k rang)
2. **Ayollar uchun Redirect URL** (pushti rang)

\`\`\`typescript
// Admin formasi
<div className="space-y-4">
  {/* Erkaklar URL */}
  <div>
    <label className="text-sm font-medium text-blue-600">
      Erkaklar uchun Redirect URL
    </label>
    <input
      type="url"
      value={courseData.male_redirect_url}
      onChange={(e) => setCourseData({
        ...courseData,
        male_redirect_url: e.target.value
      })}
      placeholder="https://t.me/MuhibAcademyBot?start=..."
    />
  </div>

  {/* Ayollar URL */}
  <div>
    <label className="text-sm font-medium text-pink-600">
      Ayollar uchun Redirect URL
    </label>
    <input
      type="url"
      value={courseData.female_redirect_url}
      onChange={(e) => setCourseData({
        ...courseData,
        female_redirect_url: e.target.value
      })}
      placeholder="https://t.me/MuhibAcademyBot?start=..."
    />
  </div>
</div>
\`\`\`

---

## 📊 Analytics Tracking

### 1. Form Submit Tracking
\`\`\`typescript
// Lead generated event
track("lead_generated", {
  course: selectedCourseData?.title,
  gender: formData.gender,
  age: formData.age,
  utm_source: urlParams.get("utm_source"),
  short_code: shortCode
})

// Supabase analytics
fetch("/api/analytics/track", {
  method: "POST",
  body: JSON.stringify({
    event_type: "registration",
    course_slug: selectedCourseData?.slug,
    gender: formData.gender,
    age: parseInt(formData.age),
    utm_source: urlParams.get("utm_source"),
    session_id: localStorage.getItem("session_id")
  })
})
\`\`\`

### 2. Bot Click Tracking
\`\`\`typescript
fetch("/api/analytics/track", {
  method: "POST",
  body: JSON.stringify({
    event_type: "bot_click",
    course_slug: selectedCourseData?.slug,
    gender: formData.gender,
    age: parseInt(formData.age),
    redirect_url: redirectUrl
  })
})
\`\`\`

---

## 🎯 To'liq Form Submit Flow

\`\`\`
1. Foydalanuvchi kurs tanlaydi
   ↓
2. Forma ochiladi (Step 1)
   ↓
3. Shaxsiy ma'lumotlar kiritiladi
   - Ism, telefon, yosh, jins
   - Validation
   ↓
4. Step 2: Ta'lim ma'lumotlari
   - Davlat, daraja
   ↓
5. Step 3: Bog'lanish
   - Contact method, WhatsApp, Telegram
   ↓
6. Submit tugmasi bosiladi
   ↓
7. POST /api/bitrix-lead
   - Contact yaratiladi
   - Deal yaratiladi
   - Bitrix'ga yuboriladi
   ↓
8. Supabase'ga saqlanadi
   - course_registrations table
   ↓
9. Success modal ko'rsatiladi
   - 3 sekund countdown
   - "Hoziroq o'tish" tugmasi
   ↓
10. Jinsga qarab redirect
   - Erkak → male_redirect_url
   - Ayol → female_redirect_url
   ↓
11. Telegram bot ochiladi
\`\`\`

---

## 🔐 Environment Variables

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Bitrix24 - webhook'lar kodda hard-coded
# Contact: /rest/1/c6llyvjpjzj7h78z/crm.contact.add.json
# Deal: /rest/1/eu84ey6vrebqa3t2/crm.deal.add.json
\`\`\`

---

## 🎨 Forma Styling (Tailwind)

### Color Scheme
\`\`\`css
Primary: Gradient (blue-600 → purple-600)
Success: green-600
Error: red-500
Background: gray-50
Card: white + shadow-xl
\`\`\`

### Key Components
\`\`\`typescript
// Step indicator
<div className="flex items-center justify-between mb-8">
  {[1, 2, 3].map(step => (
    <div className={`
      flex items-center gap-2
      ${formStep >= step ? 'text-blue-600' : 'text-gray-400'}
    `}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${formStep >= step 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-600'}
      `}>
        {step}
      </div>
    </div>
  ))}
</div>

// Input field
<input 
  className="
    w-full px-4 py-3 rounded-xl
    border-2 border-gray-200
    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
    transition-all duration-200
  "
/>

// Submit button
<button className="
  w-full py-4 px-6 rounded-xl
  bg-gradient-to-r from-blue-600 to-purple-600
  text-white font-semibold
  hover:shadow-2xl hover:scale-105
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Ro'yxatdan o'tish
</button>
\`\`\`

---

## 🚨 Error Handling

### Validation Errors
\`\`\`typescript
const errors = {
  name: "Ismingizni kiriting",
  phone: "O'zbekiston uchun 9 ta raqam kiriting",
  age: "Yoshingizni kiriting",
  gender: "Jinsingizni tanlang",
  country: "Davlatni tanlang",
  level: "Darajangizni tanlang",
  contactMethod: "Bog'lanish usulini tanlang",
  whatsapp: "WhatsApp raqamini kiriting",
  telegram: "Telegram username kiriting"
}
\`\`\`

### API Error Handling
\`\`\`typescript
try {
  const response = await fetch("/api/bitrix-lead", {...})
  const data = await response.json()
  
  if (!data.success) {
    alert("Xatolik yuz berdi: " + data.error)
    return
  }
  
  // Success
} catch (error) {
  console.error("Network error:", error)
  alert("Internet aloqasini tekshiring")
}
\`\`\`

---

## 📱 Responsive Design

\`\`\`css
/* Mobile first approach */
.form-container {
  @apply px-4 py-6;
}

/* Tablet */
@media (min-width: 768px) {
  .form-container {
    @apply px-8 py-12;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .form-container {
    @apply px-16 py-16 max-w-2xl mx-auto;
  }
}
\`\`\`

---

## ✅ Testing Checklist

- [ ] Telefon raqam validatsiyasi ishlaydi
- [ ] Har bir davlat uchun to'g'ri raqam uzunligi
- [ ] Gender radio button ishlaydi
- [ ] Erkak uchun to'g'ri URL
- [ ] Ayol uchun to'g'ri URL
- [ ] Bitrix'ga Contact yaratiladi
- [ ] Bitrix'ga Deal yaratiladi
- [ ] Supabase'ga saqlanadi
- [ ] 3 sekund countdown ishlaydi
- [ ] Redirect to'g'ri ishlaydi
- [ ] Analytics track qilinadi
- [ ] Mobile responsive
- [ ] Error handling ishlaydi

---

## 🔗 Fayllar Ro'yxati

**Frontend:**
- `app/darsliklar/page.tsx` - Asosiy forma
- `components/success-modal.tsx` - Success popup

**Backend:**
- `app/api/courses/route.ts` - Kurslar API
- `app/api/bitrix-lead/route.ts` - Bitrix integratsiya
- `app/api/course-registration/route.ts` - Supabase save
- `app/api/analytics/track/route.ts` - Analytics

**Database:**
- `scripts/create_muhib_academy_tables.sql` - Schema
- `scripts/001_create_tables.sql` - Courses table

**Config:**
- `lib/supabase/client.ts` - Supabase client
- `lib/supabase/server.ts` - Supabase server

---

Bu dokumentatsiya MuhibAcademy loyihasining to'liq forma va backend tizimini qamrab oladi. Har bir qism batafsil yozilgan va amaliy kod misollari bilan ta'minlangan.
