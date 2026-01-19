import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "7"

    const supabase = await createClient()

    const startDate = new Date()
    if (days === "today") {
      startDate.setHours(0, 0, 0, 0)
    } else if (days === "yesterday") {
      startDate.setDate(startDate.getDate() - 1)
      startDate.setHours(0, 0, 0, 0)
    } else {
      startDate.setDate(startDate.getDate() - Number.parseInt(days))
    }

    const { data: sourcesData } = await supabase
      .from("analytics_events")
      .select("utm_source")
      .not("utm_source", "is", null)

    const { data: bloggersData } = await supabase.from("short_urls").select("blogger").not("blogger", "is", null)

    const { data: campaignsData } = await supabase
      .from("short_urls")
      .select("utm_campaign, created_at")
      .not("utm_campaign", "is", null)
      .gte("created_at", startDate.toISOString())

    const { data: countriesData } = await supabase.from("analytics_events").select("country").not("country", "is", null)

    const { data: devicesData } = await supabase
      .from("analytics_events")
      .select("device_type")
      .not("device_type", "is", null)

    const { data: languagesData } = await supabase.from("short_urls").select("language").not("language", "is", null)

    // Extract unique values
    const sources = [...new Set(sourcesData?.map((d) => d.utm_source).filter(Boolean) || [])]
    const bloggers = [...new Set(bloggersData?.map((d) => d.blogger).filter(Boolean) || [])]

    const campaignMap = new Map<string, string>()
    campaignsData?.forEach((d) => {
      if (d.utm_campaign) {
        const existing = campaignMap.get(d.utm_campaign)
        if (!existing || new Date(d.created_at) < new Date(existing)) {
          campaignMap.set(d.utm_campaign, d.created_at)
        }
      }
    })

    const campaigns = Array.from(campaignMap.entries()).map(([name, date]) => ({
      name,
      createdAt: date,
    }))

    const countries = [...new Set(countriesData?.map((d) => d.country).filter(Boolean) || [])]
    const devices = [...new Set(devicesData?.map((d) => d.device_type).filter(Boolean) || [])]
    const languages = [...new Set(languagesData?.map((d) => d.language).filter(Boolean) || [])]

    // Extract OS from user_agent
    const { data: eventsData } = await supabase.from("analytics_events").select("user_agent")

    const osSet = new Set<string>()
    eventsData?.forEach((e) => {
      const ua = e.user_agent?.toLowerCase() || ""
      if (ua.includes("windows")) osSet.add("Windows")
      else if (ua.includes("mac")) osSet.add("Mac")
      else if (ua.includes("iphone") || ua.includes("ipad")) osSet.add("iOS")
      else if (ua.includes("android")) osSet.add("Android")
      else if (ua.includes("linux")) osSet.add("Linux")
    })

    const os = Array.from(osSet)

    console.log(`[v0] Filter options for time range: ${days}, campaigns found: ${campaigns.length}`)

    return NextResponse.json({
      sources,
      bloggers,
      campaigns,
      countries,
      devices,
      os,
      languages,
    })
  } catch (error) {
    console.error("[v0] Filter options API error:", error)
    return NextResponse.json(
      {
        sources: [],
        bloggers: [],
        campaigns: [],
        countries: [],
        devices: [],
        os: [],
        languages: [],
        error: "Failed to fetch filter options",
      },
      { status: 500 },
    )
  }
}
