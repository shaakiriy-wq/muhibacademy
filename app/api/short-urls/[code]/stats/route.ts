import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { code: string } }) {
  try {
    const { code } = params
    const supabase = await createClient()

    // Get short URL info
    const { data: shortUrl, error: urlError } = await supabase
      .from("short_urls")
      .select("*")
      .eq("short_code", code)
      .single()

    if (urlError || !shortUrl) {
      return NextResponse.json({ success: false, error: "Short URL topilmadi" }, { status: 404 })
    }

    // Get analytics events for this short URL
    const { data: events, error: eventsError } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("utm_source", "shorturl")
      .eq("utm_content", code)
      .order("created_at", { ascending: false })

    if (eventsError) {
      console.error("Error fetching analytics:", eventsError)
    }

    const analyticsEvents = events || []

    // Calculate stats
    const totalClicks = shortUrl.clicks || 0
    const uniqueVisitors = new Set(analyticsEvents.map((e) => e.session_id)).size

    // Group by date
    const clicksByDate: { [key: string]: number } = {}
    analyticsEvents.forEach((event) => {
      const date = new Date(event.created_at).toISOString().split("T")[0]
      clicksByDate[date] = (clicksByDate[date] || 0) + 1
    })

    // Group by country
    const clicksByCountry: { [key: string]: number } = {}
    analyticsEvents.forEach((event) => {
      const country = event.country || "Unknown"
      clicksByCountry[country] = (clicksByCountry[country] || 0) + 1
    })

    // Group by device
    const clicksByDevice: { [key: string]: number } = {}
    analyticsEvents.forEach((event) => {
      const device = event.device || "Desktop"
      clicksByDevice[device] = (clicksByDevice[device] || 0) + 1
    })

    // Group by referrer
    const clicksByReferrer: { [key: string]: number } = {}
    analyticsEvents.forEach((event) => {
      const referrer = event.referrer || "Direct"
      clicksByReferrer[referrer] = (clicksByReferrer[referrer] || 0) + 1
    })

    const stats = {
      shortUrl,
      clicksByDate: Object.entries(clicksByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30),
      clicksByCountry: Object.entries(clicksByCountry)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      clicksByDevice: Object.entries(clicksByDevice)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count),
      clicksByReferrer: Object.entries(clicksByReferrer)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      totalClicks,
      uniqueVisitors,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server xatolik" }, { status: 500 })
  }
}
