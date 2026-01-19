import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role for server-side operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { courseSlug, courseTitle, fullName, phone, age, country, level, utmSource, utmMedium, utmCampaign } = body

    // Validation
    if (!fullName || !phone) {
      return NextResponse.json({ success: false, error: "Ism va telefon raqam majburiy" }, { status: 400 })
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("course_registrations")
      .insert({
        course_slug: courseSlug,
        course_title: courseTitle,
        full_name: fullName,
        phone: phone,
        age: age ? Number.parseInt(age) : null,
        country: country,
        level: level,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: "Ma'lumotlarni saqlashda xatolik" }, { status: 500 })
    }

    return NextResponse.json({ success: true, registration: data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get all registrations with course stats
    const { data: registrations, error } = await supabase
      .from("course_registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: "Ma'lumotlarni olishda xatolik" }, { status: 500 })
    }

    // Calculate stats per course
    const courseStats: Record<string, { count: number; title: string }> = {}

    registrations?.forEach((reg: any) => {
      const slug = reg.course_slug || "unknown"
      if (!courseStats[slug]) {
        courseStats[slug] = { count: 0, title: reg.course_title || slug }
      }
      courseStats[slug].count++
    })

    return NextResponse.json({
      success: true,
      registrations,
      courseStats,
      totalRegistrations: registrations?.length || 0,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 })
  }
}
