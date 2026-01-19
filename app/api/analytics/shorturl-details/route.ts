import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const shortCode = searchParams.get("shortCode")
    const daysParam = searchParams.get("days") || "7"

    if (!shortCode) {
      return NextResponse.json({ error: "Short code is required" }, { status: 400 })
    }

    // Get short URL details
    const { data: shortUrl } = await supabase.from("short_urls").select("*").eq("short_code", shortCode).single()

    if (!shortUrl) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 })
    }

    const now = new Date()
    let startDate: Date
    let days: number

    if (daysParam === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      days = 1
    } else if (daysParam === "yesterday") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      now.setDate(now.getDate() - 1)
      now.setHours(23, 59, 59, 999)
      days = 1
    } else {
      days = Number.parseInt(daysParam)
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    }

    // Get all click events for this short URL
    const { data: clickEvents } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("event_type", "short_url_click")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    const shortUrlClicks = (clickEvents || []).filter((e) => e.metadata?.short_code === shortCode)

    // Get bot clicks for this short URL
    const { data: botEvents } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("event_type", "bot_click")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    const botClicks = (botEvents || []).filter((e) => e.metadata?.short_code === shortCode)

    // Get form submissions from this short URL
    const { data: formSubmissions } = await supabase
      .from("form_submissions")
      .select("*")
      .or(`utm_source.eq.${shortUrl.utm_source},utm_campaign.eq.${shortUrl.utm_campaign}`)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    // Calculate metrics
    const totalClicks = shortUrlClicks.length
    const uniqueVisitors = new Set(shortUrlClicks.map((e) => e.session_id)).size
    const totalBotClicks = botClicks.length
    const botClickRate = totalClicks > 0 ? ((totalBotClicks / totalClicks) * 100).toFixed(1) : "0.0"
    const totalLeads = formSubmissions?.length || 0
    const leadConversionRate = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) : "0.0"

    // Get services breakdown
    const servicesMap = new Map()
    formSubmissions?.forEach((lead) => {
      if (lead.service_type) {
        servicesMap.set(lead.service_type, (servicesMap.get(lead.service_type) || 0) + 1)
      }
    })

    const services = Array.from(servicesMap.entries())
      .map(([service, count]) => ({
        service,
        count,
        percentage: totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.count - a.count)

    // Timeline data
    const timelineMap = new Map()
    const actualDays = daysParam === "today" || daysParam === "yesterday" ? 1 : days

    for (let i = 0; i < actualDays; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]
      timelineMap.set(dateStr, { date: dateStr, clicks: 0, leads: 0, botClicks: 0 })
    }

    shortUrlClicks.forEach((event) => {
      const dateStr = event.created_at.split("T")[0]
      if (timelineMap.has(dateStr)) {
        timelineMap.get(dateStr).clicks++
      }
    })

    botClicks.forEach((event) => {
      const dateStr = event.created_at.split("T")[0]
      if (timelineMap.has(dateStr)) {
        timelineMap.get(dateStr).botClicks++
      }
    })

    formSubmissions?.forEach((lead) => {
      const dateStr = lead.created_at.split("T")[0]
      if (timelineMap.has(dateStr)) {
        timelineMap.get(dateStr).leads++
      }
    })

    const timeline = Array.from(timelineMap.values()).map((item) => ({
      date: new Date(item.date).toLocaleDateString("uz-UZ", { month: "short", day: "numeric" }),
      clicks: item.clicks,
      leads: item.leads,
      botClicks: item.botClicks,
    }))

    // Countries breakdown
    const countriesMap = new Map()
    shortUrlClicks.forEach((e) => {
      const country = e.country || "Unknown"
      countriesMap.set(country, (countriesMap.get(country) || 0) + 1)
    })

    const countries = Array.from(countriesMap.entries())
      .map(([country, count]) => ({
        country,
        count,
        percentage: totalClicks > 0 ? ((count / totalClicks) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.count - a.count)

    // Devices breakdown
    const devicesMap = new Map()
    shortUrlClicks.forEach((e) => {
      const device = e.device_type || "Unknown"
      devicesMap.set(device, (devicesMap.get(device) || 0) + 1)
    })

    const devices = Array.from(devicesMap.entries())
      .map(([device, count]) => ({
        device: device.charAt(0).toUpperCase() + device.slice(1),
        count,
        percentage: totalClicks > 0 ? ((count / totalClicks) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.count - a.count)

    console.log("[v0] Short URL Details API:", {
      shortCode,
      totalClicks,
      uniqueVisitors,
      totalBotClicks,
      totalLeads,
    })

    return NextResponse.json({
      shortUrl: {
        shortCode: shortUrl.short_code,
        longUrl: shortUrl.long_url,
        utmSource: shortUrl.utm_source,
        utmCampaign: shortUrl.utm_campaign,
        blogger: shortUrl.blogger,
        createdAt: shortUrl.created_at,
      },
      metrics: {
        totalClicks,
        uniqueVisitors,
        totalBotClicks,
        botClickRate: Number(botClickRate),
        totalLeads,
        leadConversionRate: Number(leadConversionRate),
      },
      services,
      timeline,
      countries,
      devices,
    })
  } catch (error) {
    console.error("[v0] Short URL Details API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
