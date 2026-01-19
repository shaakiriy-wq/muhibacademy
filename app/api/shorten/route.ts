import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Generate random short code
function generateShortCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const {
      longUrl,
      password,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      blogger,
      language,
      targetId,
      notes,
      id,
    } = await request.json()

    console.log("[v0] POST request received:", { longUrl, password: password ? "***" : "missing", id })

    if (password !== "talimci2026") {
      console.log("[v0] Password check failed")
      return NextResponse.json({ error: "Noto'g'ri parol" }, { status: 401 })
    }

    if (!longUrl || !longUrl.startsWith("http")) {
      return NextResponse.json({ error: "Noto'g'ri URL format" }, { status: 400 })
    }

    if (id) {
      const { data, error } = await supabase
        .from("short_urls")
        .update({
          long_url: longUrl,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          blogger: blogger || null,
          language: language || null,
          target_id: targetId || null,
          notes: notes || null,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Supabase update error:", error)
        return NextResponse.json({ error: "Database xatosi" }, { status: 500 })
      }

      const host = request.headers.get("host") || "talimci.uz"
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      const baseUrl = `${protocol}://${host}`

      console.log("[v0] URL updated successfully:", data.short_code)
      return NextResponse.json({
        shortUrl: `${baseUrl}/${data.short_code}`,
        shortCode: data.short_code,
        longUrl,
      })
    }

    // Generate unique short code
    let shortCode = generateShortCode()
    let attempts = 0

    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("short_urls")
        .select("short_code")
        .eq("short_code", shortCode)
        .single()

      if (!existing) break
      shortCode = generateShortCode()
      attempts++
    }

    console.log("[v0] Generated short code:", shortCode)

    const { data, error } = await supabase
      .from("short_urls")
      .insert([
        {
          short_code: shortCode,
          long_url: longUrl,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          blogger: blogger || null,
          language: language || null,
          target_id: targetId || null,
          notes: notes || null,
          // created_at auto-set by database
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase insert error:", error)
      return NextResponse.json({ error: "Database xatosi: " + error.message }, { status: 500 })
    }

    console.log("[v0] URL created successfully:", data)

    const host = request.headers.get("host") || "talimci.uz"
    const protocol = request.headers.get("x-forwarded-proto") || "https"
    const baseUrl = `${protocol}://${host}`

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    try {
      await supabase.from("analytics_events").insert([
        {
          event_type: "short_url_created",
          event_name: "Short URL Created",
          session_id: sessionId,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          metadata: {
            short_code: shortCode,
            blogger: blogger,
            language: language,
            target_id: targetId,
            created_at: data.created_at, // Store creation timestamp
          },
        },
      ])
      console.log("[v0] Analytics event logged with creation date")
    } catch (analyticsError) {
      console.error("[v0] Analytics logging failed (non-critical):", analyticsError)
    }

    return NextResponse.json({
      shortUrl: `${baseUrl}/${shortCode}`,
      shortCode,
      longUrl,
      createdAt: data.created_at, // Return creation timestamp
    })
  } catch (error) {
    console.error("[v0] Shorten API error:", error)
    return NextResponse.json({ error: "Server xatosi: " + (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json()

    if (password !== "talimci2026") {
      return NextResponse.json({ error: "Noto'g'ri parol" }, { status: 401 })
    }

    const { error } = await supabase.from("short_urls").delete().eq("id", id)

    if (error) {
      console.error("[v0] Supabase delete error:", error)
      return NextResponse.json({ error: "Database xatosi" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete API error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}

// Get all short URLs
export async function GET(request: NextRequest) {
  try {
    const password = request.nextUrl.searchParams.get("password")

    if (password !== "talimci2026") {
      return NextResponse.json({ error: "Noto'g'ri parol" }, { status: 401 })
    }

    const { data, error } = await supabase.from("short_urls").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase select error:", error)
      return NextResponse.json({ error: "Database xatosi" }, { status: 500 })
    }

    return NextResponse.json({ urls: data })
  } catch (error) {
    console.error("[v0] Get URLs API error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
