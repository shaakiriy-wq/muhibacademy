import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Generate random short code
function generateShortCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// GET all short URLs
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: shortUrls, error } = await supabase
      .from("short_urls")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching short URLs:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, shortUrls: shortUrls || [] })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

// POST create new short URL
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const shortCode = body.shortCode || generateShortCode()

    // Build target URL with UTM parameters
    let targetUrl = body.targetUrl || "https://muhibacademy.uz"
    const utmParams = new URLSearchParams()
    if (body.utm_source) utmParams.append("utm_source", body.utm_source)
    if (body.utm_medium) utmParams.append("utm_medium", body.utm_medium)
    if (body.utm_campaign) utmParams.append("utm_campaign", body.utm_campaign)
    if (body.utm_content) utmParams.append("utm_content", body.utm_content)
    if (body.utm_term) utmParams.append("utm_term", body.utm_term)

    if (utmParams.toString()) {
      targetUrl += (targetUrl.includes("?") ? "&" : "?") + utmParams.toString()
    }

    const { data, error } = await supabase
      .from("short_urls")
      .insert([
        {
          short_code: shortCode,
          target_url: targetUrl,
          utm_source: body.utm_source,
          utm_medium: body.utm_medium,
          utm_campaign: body.utm_campaign,
          utm_content: body.utm_content,
          utm_term: body.utm_term,
          blogger: body.blogger,
          language: body.language || "UZ",
          target_id: body.target_id,
          notes: body.notes,
          clicks: 0,
          is_active: true,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating short URL:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, shortUrl: data?.[0] })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

// DELETE short URL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Short URL ID required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("short_urls").delete().eq("id", id)

    if (error) {
      console.error("Error deleting short URL:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
