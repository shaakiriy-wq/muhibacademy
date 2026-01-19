import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: bloggers, error } = await supabase
      .from("blogger_payments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ bloggers: bloggers || [] })
  } catch (error) {
    console.error("Error fetching bloggers:", error)
    return NextResponse.json({ bloggers: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { error } = await supabase.from("blogger_payments").insert([body])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding payment:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
