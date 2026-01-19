import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    const filter = searchParams.get("filter") || "7" // today, yesterday, 7, 14, 30, custom
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")
    const source = searchParams.get("source") || "all"
    const country = searchParams.get("country") || "all"
    const device = searchParams.get("device") || "all"

    // Calculate date range based on filter
    let startDate = new Date()
    let endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const yesterdayEnd = new Date(todayStart)
    yesterdayEnd.setMilliseconds(-1)

    if (filter === "today") {
      startDate = todayStart
    } else if (filter === "yesterday") {
      startDate = yesterdayStart
      endDate = yesterdayEnd
    } else if (filter === "custom" && startDateParam && endDateParam) {
      startDate = new Date(startDateParam)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(endDateParam)
      endDate.setHours(23, 59, 59, 999)
    } else {
      const days = Number.parseInt(filter) || 7
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)
    }

    // Fetch analytics events
    let eventsQuery = supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    // Fetch course registrations
    let registrationsQuery = supabase
      .from("course_registrations")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    // Fetch short URLs with clicks
    const shortUrlsQuery = supabase.from("short_urls").select("*")

    // Apply filters
    if (source !== "all") {
      eventsQuery = eventsQuery.eq("utm_source", source)
      registrationsQuery = registrationsQuery.eq("utm_source", source)
    }

    if (country !== "all") {
      eventsQuery = eventsQuery.ilike("country", `%${country}%`)
      registrationsQuery = registrationsQuery.ilike("country", `%${country}%`)
    }

    if (device !== "all") {
      eventsQuery = eventsQuery.eq("device", device)
    }

    const [eventsResult, registrationsResult, shortUrlsResult] = await Promise.all([
      eventsQuery,
      registrationsQuery,
      shortUrlsQuery,
    ])

    const events = eventsResult.data || []
    const registrations = registrationsResult.data || []
    const shortUrls = shortUrlsResult.data || []

    // Calculate overview metrics
    const totalPageViews = events.filter((e) => e.event_type === "page_view").length
    const todayPageViews = events.filter(
      (e) => e.event_type === "page_view" && new Date(e.created_at) >= todayStart,
    ).length

    const uniqueVisitors = new Set(events.map((e) => e.session_id || e.ip_address)).size
    const todayVisitors = new Set(
      events.filter((e) => new Date(e.created_at) >= todayStart).map((e) => e.session_id || e.ip_address),
    ).size

    const totalRegistrations = registrations.length
    const todayRegistrations = registrations.filter((r) => new Date(r.created_at) >= todayStart).length
    const newRegistrations = registrations.filter((r) => r.status === "new").length

    const totalShortUrlClicks = shortUrls.reduce((sum, url) => sum + (url.clicks || 0), 0)
    const totalShortUrls = shortUrls.length

    const conversionRate = totalPageViews > 0 ? ((totalRegistrations / totalPageViews) * 100).toFixed(1) : "0.0"

    // Bot clicks (Telegram bot opens)
    const botClicks = events.filter((e) => e.event_type === "bot_click").length
    const todayBotClicks = events.filter(
      (e) => e.event_type === "bot_click" && new Date(e.created_at) >= todayStart,
    ).length

    const leads = events.filter((e) => e.event_type === "lead_generated").length
    const todayLeads = events.filter(
      (e) => e.event_type === "lead_generated" && new Date(e.created_at) >= todayStart,
    ).length

    const periodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const prevStartDate = new Date(startDate)
    prevStartDate.setDate(prevStartDate.getDate() - periodLength)
    const prevEndDate = new Date(startDate)
    prevEndDate.setMilliseconds(-1)

    const { data: prevEvents } = await supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", prevStartDate.toISOString())
      .lte("created_at", prevEndDate.toISOString())

    const prevPageViews = (prevEvents || []).filter((e) => e.event_type === "page_view").length
    const prevVisitors = new Set((prevEvents || []).map((e) => e.session_id || e.ip_address)).size
    const prevLeads = (prevEvents || []).filter((e) => e.event_type === "lead_generated").length
    const prevBotClicks = (prevEvents || []).filter((e) => e.event_type === "bot_click").length

    const pageViewsChange = prevPageViews > 0 ? Math.round(((totalPageViews - prevPageViews) / prevPageViews) * 100) : 0
    const visitorsChange = prevVisitors > 0 ? Math.round(((uniqueVisitors - prevVisitors) / prevVisitors) * 100) : 0
    const leadsChange = prevLeads > 0 ? Math.round(((leads - prevLeads) / prevLeads) * 100) : 0
    const botClicksChange = prevBotClicks > 0 ? Math.round(((botClicks - prevBotClicks) / prevBotClicks) * 100) : 0

    const trendsMap = new Map()
    const daysToShow = Math.min(periodLength, 30)
    const trendDates = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    trendDates.forEach((date) => {
      trendsMap.set(date, { date, views: 0, visitors: 0, registrations: 0 })
    })

    // Track unique visitors per day
    const dailyVisitors = new Map<string, Set<string>>()
    trendDates.forEach((date) => dailyVisitors.set(date, new Set()))

    events.forEach((event) => {
      const date = new Date(event.created_at).toISOString().split("T")[0]
      if (trendsMap.has(date)) {
        if (event.event_type === "page_view") {
          trendsMap.get(date).views++
        }
        const visitorId = event.session_id || event.ip_address
        if (dailyVisitors.has(date)) {
          dailyVisitors.get(date)!.add(visitorId)
        }
      }
    })

    // Set visitor counts
    trendDates.forEach((date) => {
      if (trendsMap.has(date) && dailyVisitors.has(date)) {
        trendsMap.get(date).visitors = dailyVisitors.get(date)!.size
      }
    })

    registrations.forEach((reg) => {
      const date = new Date(reg.created_at).toISOString().split("T")[0]
      if (trendsMap.has(date)) {
        trendsMap.get(date).registrations++
      }
    })

    // Calculate UTM sources
    const sourcesMap = new Map()
    events.forEach((event) => {
      const source = event.utm_source || "Direct"
      sourcesMap.set(source, (sourcesMap.get(source) || 0) + 1)
    })

    const sources = Array.from(sourcesMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)

    // Calculate countries from events (not just registrations)
    const countriesMap = new Map()
    events.forEach((event) => {
      const country = event.country || "Noma'lum"
      countriesMap.set(country, (countriesMap.get(country) || 0) + 1)
    })

    const countries = Array.from(countriesMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate device stats
    const devicesMap = new Map()
    events.forEach((event) => {
      const device = event.device || "unknown"
      devicesMap.set(device, (devicesMap.get(device) || 0) + 1)
    })

    const devices = Array.from(devicesMap.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)

    // Calculate browser stats
    const browsersMap = new Map()
    events.forEach((event) => {
      const browser = event.browser || "unknown"
      browsersMap.set(browser, (browsersMap.get(browser) || 0) + 1)
    })

    const browsers = Array.from(browsersMap.entries())
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)

    // Calculate course stats - now includes bot clicks
    const courseStatsMap = new Map()
    registrations.forEach((reg) => {
      const course = reg.course_title || reg.course_slug || "Noma'lum"
      if (!courseStatsMap.has(course)) {
        courseStatsMap.set(course, { title: course, registrations: 0, botClicks: 0 })
      }
      courseStatsMap.get(course).registrations++
    })

    const courseBotClicksMap = new Map()
    events.forEach((event) => {
      if (event.event_type === "bot_click" && event.page_title) {
        // Extract course name from page_title "Bot Redirect - Course Name"
        const match = event.page_title.match(/Bot Redirect - (.+)/)
        if (match) {
          const course = match[1]
          courseBotClicksMap.set(course, (courseBotClicksMap.get(course) || 0) + 1)
        }
      }
    })

    courseBotClicksMap.forEach((clicks, course) => {
      if (!courseStatsMap.has(course)) {
        courseStatsMap.set(course, { title: course, registrations: 0, botClicks: 0 })
      }
      courseStatsMap.get(course).botClicks = clicks
    })

    const courseStats = Array.from(courseStatsMap.values())
      .map((stat) => ({
        ...stat,
        conversionRate: stat.botClicks > 0 ? ((stat.registrations / stat.botClicks) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.registrations - a.registrations)

    // Top Short URLs
    const topShortUrls = shortUrls
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 10)
      .map((url) => ({
        id: url.id,
        shortCode: url.short_code,
        targetUrl: url.target_url,
        clicks: url.clicks || 0,
        utm_source: url.utm_source,
        utm_medium: url.utm_medium,
        utm_campaign: url.utm_campaign,
        blogger: url.blogger,
        language: url.language,
        created_at: url.created_at,
      }))

    const gendersMap = new Map()
    const agesMap = new Map()
    const referrerMap = new Map()

    events.forEach((event) => {
      const gender = event.gender || "Noma'lum"
      gendersMap.set(gender, (gendersMap.get(gender) || 0) + 1)

      const age = event.age || "Noma'lum"
      agesMap.set(age, (agesMap.get(age) || 0) + 1)

      const referrer = event.referrer || "Direct"
      referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1)
    })

    const genders = Array.from(gendersMap.entries())
      .map(([gender, count]) => ({ gender, count }))
      .sort((a, b) => b.count - a.count)

    const ages = Array.from(agesMap.entries())
      .map(([age, count]) => ({ age, count }))
      .sort((a, b) => b.count - a.count)

    const referrers = Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      overview: {
        totalPageViews,
        todayPageViews,
        uniqueVisitors,
        todayVisitors,
        totalRegistrations,
        todayRegistrations,
        newRegistrations,
        totalShortUrls,
        totalShortUrlClicks,
        conversionRate: Number(conversionRate),
        leads,
        todayLeads,
        botClicks,
        todayBotClicks,
        pageViewsChange,
        visitorsChange,
        leadsChange,
        botClicksChange,
      },
      trends: Array.from(trendsMap.values()),
      sources,
      countries,
      devices,
      browsers,
      courseStats,
      shortUrls: topShortUrls,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        filter,
      },
      demographics: {
        genders,
        ages,
      },
      referrers,
    })
  } catch (error) {
    console.error("[v0] Overview API error:", error)
    return NextResponse.json({
      success: true,
      overview: {
        totalPageViews: 0,
        todayPageViews: 0,
        uniqueVisitors: 0,
        todayVisitors: 0,
        totalRegistrations: 0,
        todayRegistrations: 0,
        newRegistrations: 0,
        totalShortUrls: 0,
        totalShortUrlClicks: 0,
        conversionRate: 0,
        leads: 0,
        todayLeads: 0,
        botClicks: 0,
        todayBotClicks: 0,
        pageViewsChange: 0,
        visitorsChange: 0,
        leadsChange: 0,
        botClicksChange: 0,
      },
      trends: [],
      sources: [],
      countries: [],
      devices: [],
      browsers: [],
      courseStats: [],
      shortUrls: [],
      dateRange: {
        start: "",
        end: "",
        filter: "",
      },
      demographics: {
        genders: [],
        ages: [],
      },
      referrers: [],
    })
  }
}
