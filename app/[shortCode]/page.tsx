import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers, cookies } from "next/headers"

async function getLocationFromIP(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "talimci-analytics" },
    })
    if (response.ok) {
      const data = await response.json()
      return {
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
      }
    }
  } catch (error) {
    console.error("[v0] IP geolocation error:", error)
  }
  return { country: "Unknown", city: "Unknown" }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export default async function ShortUrlRedirect({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params

  const reservedPaths = ["admin", "admin-panel", "dashboard-admin", "talimci-admin", "api", "_next", "favicon.ico"]
  if (reservedPaths.includes(shortCode) || shortCode.startsWith("_")) {
    return null
  }

  const supabase = await createClient()
  const headersList = await headers()
  const cookieStore = await cookies()

  const userAgent = headersList.get("user-agent") || ""
  const referer = headersList.get("referer") || ""
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || ""
  const cleanIP = ip.split(",")[0].trim()

  const deviceType = /mobile/i.test(userAgent) ? "mobile" : /tablet/i.test(userAgent) ? "tablet" : "desktop"

  let sessionId = cookieStore.get("talimci_session")?.value
  if (!sessionId) {
    sessionId = generateSessionId()
  }

  try {
    const { data, error } = await supabase.from("short_urls").select("*").eq("short_code", shortCode).maybeSingle()

    if (error || !data) {
      redirect("/")
    }

    const location = await getLocationFromIP(cleanIP)

    await Promise.all([
      supabase.from("short_url_clicks").insert({
        short_url_id: data.id,
        short_code: shortCode,
        user_agent: userAgent,
        device_type: deviceType,
        ip_address: cleanIP,
        country: location.country,
        city: location.city,
        referrer: referer,
      }),
      supabase
        .from("short_urls")
        .update({
          total_clicks: (data.total_clicks || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("short_code", shortCode),
      supabase.from("analytics_events").insert({
        event_type: "short_url_click",
        event_name: "Short URL Clicked",
        session_id: sessionId,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        utm_term: data.utm_term,
        page_url: data.long_url,
        referrer: referer,
        user_agent: userAgent,
        device_type: deviceType,
        ip_address: cleanIP,
        country: location.country,
        city: location.city,
        metadata: {
          short_code: shortCode,
          blogger: data.blogger,
          language: data.language,
          target_id: data.target_id,
        },
      }),
    ])

    redirect(data.long_url)
  } catch (e) {
    redirect("/")
  }
}
