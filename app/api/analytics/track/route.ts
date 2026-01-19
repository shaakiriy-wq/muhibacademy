import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      event_type = "page_view",
      event_name, // Added event_name support
      page_url,
      page_title,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      short_code,
      session_id,
      course_slug, // Added course tracking fields
      course_title,
      gender, // Added gender tracking
      age, // Added age tracking
      metadata, // Added metadata support
    } = body

    // Get user agent info
    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"

    // Detect device type
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
    const isTablet = /Tablet|iPad/i.test(userAgent)
    const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop"

    // Detect browser
    let browser = "unknown"
    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Edge")) browser = "Edge"
    else if (userAgent.includes("Opera")) browser = "Opera"

    // Detect OS
    let os = "unknown"
    if (userAgent.includes("Windows")) os = "Windows"
    else if (userAgent.includes("Mac")) os = "macOS"
    else if (userAgent.includes("Linux")) os = "Linux"
    else if (userAgent.includes("Android")) os = "Android"
    else if (userAgent.includes("iOS") || userAgent.includes("iPhone")) os = "iOS"

    // Try to get country from IP (simple approach - could use a geo IP service)
    let country = "Unknown"
    let city = "Unknown"

    // Use ip-api.com for geolocation (free tier)
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
        signal: AbortSignal.timeout(2000),
      })
      if (geoRes.ok) {
        const geoData = await geoRes.json()
        country = geoData.country || "Unknown"
        city = geoData.city || "Unknown"
      }
    } catch {
      // Ignore geo errors
    }

    const finalSessionId = session_id || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`

    console.log("[v0] Analytics track:", {
      event_type,
      event_name,
      gender,
      age,
      country,
      city,
      utm_source,
      short_code,
    })

    // Insert into analytics_events
    const { error } = await supabase.from("analytics_events").insert({
      event_type,
      event_name, // Store event name
      page_url,
      page_title,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      short_code,
      session_id: finalSessionId,
      ip_address: ip,
      user_agent: userAgent,
      device,
      browser,
      os,
      country,
      city,
      course_slug, // Included course tracking fields
      course_title,
      gender, // Track gender
      age, // Track age
      metadata: metadata ? JSON.stringify(metadata) : null, // Store additional metadata
    })

    if (error) {
      console.error("[v0] Analytics insert error:", error)
      // Don't fail silently - log to console but return success
    } else {
      console.log("[v0] Analytics tracked successfully:", event_type, event_name)
    }

    // If short_code is provided, increment clicks
    if (short_code) {
      await supabase.rpc("increment_short_url_clicks", { code: short_code }).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      session_id: finalSessionId,
      location: { country, city },
    })
  } catch (error) {
    console.error("[v0] Analytics track error:", error)
    return NextResponse.json({ success: true, location: { country: "Unknown", city: "Unknown" } })
  }
}
