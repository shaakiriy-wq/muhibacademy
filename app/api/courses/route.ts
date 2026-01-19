import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Fallback courses data for when database table doesn't exist yet
const FALLBACK_COURSES = [
  {
    id: "fallback-1",
    slug: "quran-oqish",
    title: "Qur'on o'qish",
    subtitle: "2 oyda Qur'on o'qishni 0 dan o'rganing",
    description: "Qur'on o'qishni professional ustozlar bilan o'rganing. 3 ta dars BEPUL!",
    fullDescription:
      "Bizning kursimizda siz arab alifbosidan boshlab, tajvid qoidalari bilan Qur'on o'qishni to'liq o'rganasiz.",
    price: 500000,
    discount_price: 350000,
    duration: "2 oy",
    level: "Boshlang'ich",
    lessons: "48 ta dars",
    students: "500+",
    rating: 4.9,
    reviews: 156,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    redirect_url: "https://t.me/MuhibAcademyBot",
    male_redirect_url: "https://t.me/MuhibAcademyBot",
    female_redirect_url: "https://t.me/MuhibAcademyBot",
    instructor: {
      name: "Shayx Muhammad Ali",
      image: "/islamic-scholar-beard-1.jpg",
      title: "Qori, 10+ yil tajriba",
      experience: "10+ yil tajriba",
      students: "500+ o'quvchi",
    },
    features: [
      "24 ta video dars",
      "Jonli Zoom darslari",
      "Tajvid qoidalari",
      "Amaliy mashg'ulotlar",
      "Sertifikat",
      "Umrbod kirish",
    ],
    roadmap: [
      {
        week: "1-2 hafta",
        title: "Arab alifbosi",
        description: "Harflarni o'rganish va to'g'ri talaffuz",
        lessons: "12 dars",
      },
      { week: "3-4 hafta", title: "Tajvid asoslari", description: "Qiroat qoidalarini o'rganish", lessons: "12 dars" },
      { week: "5-6 hafta", title: "Qisqa suralar", description: "Namoz suralarini yod olish", lessons: "12 dars" },
      { week: "7-8 hafta", title: "Mustaqil o'qish", description: "Qur'onni mustaqil o'qish", lessons: "12 dars" },
    ],
    testimonials: [
      { name: "Aziza K.", age: "25", rating: 5, text: "2 oyda Qur'on o'qishni o'rgandim! Juda yaxshi kurs." },
      { name: "Muhammad R.", age: "32", rating: 5, text: "Ustozlar juda professional. Tavsiya qilaman!" },
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    slug: "arab-tili",
    title: "Arab tili",
    subtitle: "Arab tilini grammatika va so'zlashuvdan o'rganing",
    description: "Arab tilini professional ustozlar bilan o'rganing. 3 ta dars BEPUL!",
    fullDescription: "Arab tili kursi sizga arabcha o'qish, yozish va so'zlashishni o'rgatadi.",
    price: 600000,
    discount_price: 420000,
    duration: "3 oy",
    level: "Boshlang'ich",
    lessons: "64 ta dars",
    students: "350+",
    rating: 4.8,
    reviews: 98,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    redirect_url: "https://t.me/MuhibAcademyBot",
    male_redirect_url: "https://t.me/MuhibAcademyBot",
    female_redirect_url: "https://t.me/MuhibAcademyBot",
    instructor: {
      name: "Ustoz Ahmad Karimov",
      image: "/islamic-scholar-beard-2.jpg",
      title: "Arab tili mutaxassisi",
      experience: "8+ yil tajriba",
      students: "350+ o'quvchi",
    },
    features: ["36 ta video dars", "Jonli Zoom darslari", "Grammatika darslari", "So'zlashuv amaliyoti", "Sertifikat"],
    roadmap: [
      {
        week: "1-4 hafta",
        title: "Alifbo va asoslar",
        description: "Arab harflari va asosiy so'zlar",
        lessons: "16 dars",
      },
      { week: "5-8 hafta", title: "Grammatika", description: "Ism, fe'l va gap tuzilishi", lessons: "24 dars" },
      { week: "9-12 hafta", title: "So'zlashuv", description: "Jonli muloqot va dialog", lessons: "24 dars" },
    ],
    testimonials: [{ name: "Bekzod T.", age: "22", rating: 5, text: "3 oyda arab tilida gaplasha boshladim!" }],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    slug: "islom-asoslari",
    title: "Islom asoslari",
    subtitle: "Islom dinining asosiy tushunchalari va amaliyotlari",
    description: "Islom asoslarini professional ustozlar bilan o'rganing. 3 ta dars BEPUL!",
    fullDescription:
      "Bu kursda siz Islom dinining asosiy tushunchalari - iymon, namoz, ro'za, zakot va boshqa ibodat turlarini o'rganasiz.",
    price: 400000,
    discount_price: 280000,
    duration: "1.5 oy",
    level: "Boshlang'ich",
    lessons: "32 ta dars",
    students: "420+",
    rating: 4.9,
    reviews: 134,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    redirect_url: "https://t.me/MuhibAcademyBot",
    male_redirect_url: "https://t.me/MuhibAcademyBot",
    female_redirect_url: "https://t.me/MuhibAcademyBot",
    instructor: {
      name: "Shayx Abdulloh Rahimov",
      image: "/islamic-scholar-beard-3.jpg",
      title: "Islom olimi, 15+ yil tajriba",
      experience: "15+ yil tajriba",
      students: "420+ o'quvchi",
    },
    features: ["18 ta video dars", "Jonli Zoom darslari", "Iymon asoslari", "Ibodat qoidalari", "Sertifikat"],
    roadmap: [
      {
        week: "1-2 hafta",
        title: "Iymon asoslari",
        description: "Allohga, farishtalar va kitoblarga iymon",
        lessons: "10 dars",
      },
      { week: "3-4 hafta", title: "Namoz", description: "Namoz qoidalari va amaliyoti", lessons: "12 dars" },
      { week: "5-6 hafta", title: "Boshqa ibodat", description: "Ro'za, zakot va haj", lessons: "10 dars" },
    ],
    testimonials: [{ name: "Javohir N.", age: "35", rating: 5, text: "Islomni to'g'ri tushunishni o'rgandim." }],
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

// GET all courses
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Database error, using fallback:", error.message)
      return NextResponse.json({ success: true, courses: FALLBACK_COURSES, isFallback: true })
    }

    if (!courses || courses.length === 0) {
      console.log("[v0] No courses in database, using fallback")
      return NextResponse.json({ success: true, courses: FALLBACK_COURSES, isFallback: true })
    }

    const transformedCourses = courses.map((course) => ({
      ...course,
      videoUrl: course.video_url,
      fullDescription: course.full_description,
      discountPrice: course.discount_price,
      redirect_url: course.redirect_url || "https://t.me/MuhibAcademyBot",
      male_redirect_url: course.male_redirect_url || course.redirect_url || "https://t.me/MuhibAcademyBot",
      female_redirect_url: course.female_redirect_url || course.redirect_url || "https://t.me/MuhibAcademyBot",
      instructor: typeof course.instructor === "string" ? JSON.parse(course.instructor) : course.instructor,
      features: typeof course.features === "string" ? JSON.parse(course.features) : course.features || [],
      roadmap: typeof course.roadmap === "string" ? JSON.parse(course.roadmap) : course.roadmap || [],
      testimonials:
        typeof course.testimonials === "string" ? JSON.parse(course.testimonials) : course.testimonials || [],
    }))

    return NextResponse.json({ success: true, courses: transformedCourses, isFallback: false })
  } catch (error) {
    console.error("[v0] Server error, using fallback:", error)
    return NextResponse.json({ success: true, courses: FALLBACK_COURSES, isFallback: true })
  }
}

// POST create new course
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          slug: body.slug,
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          full_description: body.fullDescription,
          price: body.price,
          discount_price: body.discount_price || body.discountPrice,
          duration: body.duration,
          level: body.level || "Boshlang'ich",
          lessons: body.lessons,
          students: body.students,
          rating: body.rating,
          reviews: body.reviews,
          video_url: body.videoUrl,
          redirect_url: body.redirect_url || "https://t.me/MuhibAcademyBot",
          male_redirect_url: body.male_redirect_url || body.redirect_url || "https://t.me/MuhibAcademyBot",
          female_redirect_url: body.female_redirect_url || body.redirect_url || "https://t.me/MuhibAcademyBot",
          instructor: body.instructor,
          features: body.features,
          roadmap: body.roadmap,
          testimonials: body.testimonials,
          is_active: body.is_active !== undefined ? body.is_active : true,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating course:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, course: data?.[0] })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

// PUT update course
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("courses")
      .update({
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        full_description: body.fullDescription,
        price: body.price,
        discount_price: body.discount_price || body.discountPrice,
        duration: body.duration,
        level: body.level,
        lessons: body.lessons,
        students: body.students,
        rating: body.rating,
        reviews: body.reviews,
        video_url: body.videoUrl,
        redirect_url: body.redirect_url,
        male_redirect_url: body.male_redirect_url,
        female_redirect_url: body.female_redirect_url,
        instructor: body.instructor,
        features: body.features,
        roadmap: body.roadmap,
        testimonials: body.testimonials,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()

    if (error) {
      console.error("Error updating course:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, course: data?.[0] })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

// DELETE course
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Course ID required" }, { status: 400 })
    }

    if (id.startsWith("fallback-")) {
      return NextResponse.json(
        { success: false, error: "Bu demo darslik. O'chirish uchun avval yangi darslik qo'shing." },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const { error: deleteError } = await supabase.from("courses").delete().eq("id", id)

    if (deleteError) {
      console.error("[v0] Error deleting course:", deleteError)
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Darslik o'chirildi" })
  } catch (error) {
    console.error("[v0] Server error in DELETE:", error)
    return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 })
  }
}
