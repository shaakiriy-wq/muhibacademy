import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""
    const cleanIP = ip.split(",")[0].trim()
    const location = cleanIP
      ? await getLocationFromIP(cleanIP)
      : { country: body.country || "Unknown", city: "Unknown" }

    const { error } = await supabase.from("form_submissions").insert({
      session_id: body.session_id || body.sessionId,
      utm_source: body.utm_source || body.utmSource,
      utm_medium: body.utm_medium || body.utmMedium,
      utm_campaign: body.utm_campaign || body.utmCampaign,
      utm_content: body.utm_content || body.utmContent,
      utm_term: body.utm_term || body.utmTerm,
      service_type: body.service_type || body.serviceType,
      full_name: body.full_name || body.fullName,
      phone: body.phone,
      whatsapp: body.whatsapp,
      country: location.country,
      step_completed: body.step_completed || body.stepCompleted || 4,
      form_data: body.form_data || body.formData,
      clicked_bot: body.clicked_bot || body.clickedBot || false,
      age: body.age,
      gender: body.gender,
    })

    if (error) {
      console.error("[v0] Form submission error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await supabase.from("analytics_events").insert({
      event_type: "form_submission",
      event_name: "Form Submitted",
      utm_source: body.utm_source || body.utmSource,
      utm_medium: body.utm_medium || body.utmMedium,
      utm_campaign: body.utm_campaign || body.utmCampaign,
      utm_content: body.utm_content || body.utmContent,
      utm_term: body.utm_term || body.utmTerm,
      user_agent: request.headers.get("user-agent") || "",
      device_type: /mobile/i.test(request.headers.get("user-agent") || "") ? "mobile" : "desktop",
      ip_address: cleanIP,
      country: location.country,
      city: location.city,
      metadata: {
        service_type: body.service_type || body.serviceType,
        clicked_bot: body.clicked_bot || body.clickedBot || false,
      },
    })

    return NextResponse.json({ success: true, location })
  } catch (error) {
    console.error("[v0] Form API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
