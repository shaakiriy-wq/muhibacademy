import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: registrations, error } = await supabase
      .from("course_registrations")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error fetching registrations:", error)
      return NextResponse.json({
        success: true,
        registrations: [],
        total: 0,
      })
    }

    return NextResponse.json({
      success: true,
      registrations: registrations || [],
      total: registrations?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error in registrations API:", error)
    return NextResponse.json({
      success: true,
      registrations: [],
      total: 0,
    })
  }
}
