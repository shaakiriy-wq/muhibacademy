import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: submissions, error } = await supabase.from("form_submissions").select("*")

    if (error) throw error

    const totalUsers = submissions?.length || 0

    // Gender stats
    const genderStats = submissions?.reduce((acc: any, sub) => {
      const gender = sub.gender || "Noma'lum"
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {})

    // Age groups
    const ageGroups = submissions?.reduce((acc: any, sub) => {
      if (!sub.age) return acc
      const group =
        sub.age < 20 ? "18-19" : sub.age < 25 ? "20-24" : sub.age < 30 ? "25-29" : sub.age < 35 ? "30-34" : "35+"
      acc[group] = (acc[group] || 0) + 1
      return acc
    }, {})

    // Service stats
    const serviceStats = submissions?.reduce((acc: any, sub) => {
      const service = sub.service_type || "Noma'lum"
      acc[service] = (acc[service] || 0) + 1
      return acc
    }, {})

    // Average age
    const avgAge = submissions?.reduce((sum, sub) => sum + (sub.age || 0), 0) / totalUsers

    // Countries
    const countries = new Set(submissions?.map((s) => s.country)).size

    return NextResponse.json({
      totalUsers,
      countries,
      avgAge: Math.round(avgAge),
      genderStats: Object.entries(genderStats || {}).map(([gender, count]) => ({ gender, count })),
      ageGroups: Object.entries(ageGroups || {}).map(([group, count]) => ({ group, count })),
      serviceStats: Object.entries(serviceStats || {}).map(([service, count]) => ({ service, count })),
    })
  } catch (error) {
    console.error("Error fetching demographics:", error)
    return NextResponse.json({ error: "Failed to fetch demographics" }, { status: 500 })
  }
}
