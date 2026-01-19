import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const daysParam = searchParams.get("days") || "7"
    const utmSource = searchParams.get("utm_source")
    const utmCampaign = searchParams.get("utm_campaign")
    const countryFilter = searchParams.get("country")
    const deviceFilter = searchParams.get("device")
    const osFilter = searchParams.get("os")
    const languageFilter = searchParams.get("language")

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

    const previousStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000)

    let currentQuery = supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    let previousQuery = supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString())

    let currentLeadsQuery = supabase
      .from("form_submissions")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    let previousLeadsQuery = supabase
      .from("form_submissions")
      .select("*")
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString())

    if (utmSource) {
      currentQuery = currentQuery.eq("utm_source", utmSource)
      previousQuery = previousQuery.eq("utm_source", utmSource)
      currentLeadsQuery = currentLeadsQuery.eq("utm_source", utmSource)
      previousLeadsQuery = previousLeadsQuery.eq("utm_source", utmSource)
    }

    if (utmCampaign) {
      currentQuery = currentQuery.eq("utm_campaign", utmCampaign)
      previousQuery = previousQuery.eq("utm_campaign", utmCampaign)
      currentLeadsQuery = currentLeadsQuery.eq("utm_campaign", utmCampaign)
      previousLeadsQuery = previousLeadsQuery.eq("utm_campaign", utmCampaign)
    }

    if (countryFilter) {
      currentQuery = currentQuery.eq("country", countryFilter)
      previousQuery = previousQuery.eq("country", countryFilter)
    }

    if (deviceFilter) {
      currentQuery = currentQuery.eq("device_type", deviceFilter)
      previousQuery = previousQuery.eq("device_type", deviceFilter)
    }

    const [currentResult, previousResult, currentLeadsResult, previousLeadsResult] = await Promise.all([
      currentQuery,
      previousQuery,
      currentLeadsQuery,
      previousLeadsQuery,
    ])

    const currentEvents = currentResult.data || []
    const previousEvents = previousResult.data || []
    const currentLeads = currentLeadsResult.data || []
    const previousLeads = previousLeadsResult.data || []

    const botClicks = currentEvents.filter((e) => e.event_type === "bot_click").length
    const previousBotClicks = previousEvents.filter((e) => e.event_type === "bot_click").length
    const botClicksChange =
      previousBotClicks > 0 ? Math.round(((botClicks - previousBotClicks) / previousBotClicks) * 100) : 0

    const formStarts = currentEvents.filter((e) => e.event_type === "form_start").length
    const formCompletions = currentLeads.filter((lead) => lead.step_completed === "completed").length
    const formAbandonments = currentLeads.filter((lead) => lead.step_completed !== "completed").length
    const formCompletionRate = formStarts > 0 ? ((formCompletions / formStarts) * 100).toFixed(1) : "0.0"

    const currentVisitors = new Set(currentEvents.map((e) => e.session_id)).size
    const previousVisitors = new Set(previousEvents.map((e) => e.session_id)).size
    const visitorsChange =
      previousVisitors > 0 ? Math.round(((currentVisitors - previousVisitors) / previousVisitors) * 100) : 0

    const currentPageViews = currentEvents.filter((e) => e.event_type === "page_view").length
    const previousPageViews = previousEvents.filter((e) => e.event_type === "page_view").length
    const pageViewsChange =
      previousPageViews > 0 ? Math.round(((currentPageViews - previousPageViews) / previousPageViews) * 100) : 0

    const leads = currentLeads.length
    const previousLeadsCount = previousLeads.length
    const leadsChange =
      previousLeadsCount > 0 ? Math.round(((leads - previousLeadsCount) / previousLeadsCount) * 100) : 0
    const leadConversionRate = currentPageViews > 0 ? ((leads / currentPageViews) * 100).toFixed(1) : "0.0"

    const contracts = currentLeads.filter((lead) => lead.contract_signed === true).length
    const previousContracts = previousLeads.filter((lead) => lead.contract_signed === true).length
    const contractsChange =
      previousContracts > 0 ? Math.round(((contracts - previousContracts) / previousContracts) * 100) : 0
    const closeRate = leads > 0 ? ((contracts / leads) * 100).toFixed(1) : "0.0"

    const currentSessionPages = new Map()
    currentEvents.forEach((e) => {
      if (e.event_type === "page_view") {
        currentSessionPages.set(e.session_id, (currentSessionPages.get(e.session_id) || 0) + 1)
      }
    })
    const currentBounces = Array.from(currentSessionPages.values()).filter((count) => count === 1).length
    const currentBounceRate = currentVisitors > 0 ? Math.round((currentBounces / currentVisitors) * 100) : 0

    const previousSessionPages = new Map()
    previousEvents.forEach((e) => {
      if (e.event_type === "page_view") {
        previousSessionPages.set(e.session_id, (previousSessionPages.get(e.session_id) || 0) + 1)
      }
    })
    const previousBounces = Array.from(previousSessionPages.values()).filter((count) => count === 1).length
    const previousBounceRate = previousVisitors > 0 ? Math.round((previousBounces / previousVisitors) * 100) : 0
    const bounceRateChange =
      previousBounceRate > 0 ? Math.round(((currentBounceRate - previousBounceRate) / previousBounceRate) * 100) : 0

    const timelineMap = new Map()
    const actualDays = daysParam === "today" || daysParam === "yesterday" ? 1 : days

    for (let i = 0; i < actualDays; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]
      timelineMap.set(dateStr, { date: dateStr, visitors: 0, pageViews: 0 })
    }

    currentEvents.forEach((event) => {
      const dateStr = event.created_at.split("T")[0]
      if (timelineMap.has(dateStr)) {
        const data = timelineMap.get(dateStr)
        if (event.event_type === "page_view") {
          data.pageViews++
        }
      }
    })

    const dailySessionsMap = new Map()
    currentEvents.forEach((event) => {
      const dateStr = event.created_at.split("T")[0]
      if (!dailySessionsMap.has(dateStr)) {
        dailySessionsMap.set(dateStr, new Set())
      }
      dailySessionsMap.get(dateStr).add(event.session_id)
    })

    dailySessionsMap.forEach((sessions, dateStr) => {
      if (timelineMap.has(dateStr)) {
        timelineMap.get(dateStr).visitors = sessions.size
      }
    })

    const timeline = Array.from(timelineMap.values()).map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visitors: item.visitors,
      pageViews: item.pageViews,
    }))

    const pagesMap = new Map()
    currentEvents.forEach((e) => {
      if (e.event_type === "page_view") {
        const path = e.page_url || "/"
        const sessions = pagesMap.get(path) || new Set()
        sessions.add(e.session_id)
        pagesMap.set(path, sessions)
      }
    })

    const pages = Array.from(pagesMap.entries())
      .map(([path, sessions]) => ({
        path,
        visitors: sessions.size,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10)

    const referrersMap = new Map()
    currentEvents.forEach((e) => {
      const referrer = e.referrer || "Direct"
      const sessions = referrersMap.get(referrer) || new Set()
      sessions.add(e.session_id)
      referrersMap.set(referrer, sessions)
    })

    const referrers = Array.from(referrersMap.entries())
      .map(([referrer, sessions]) => ({
        referrer,
        visitors: sessions.size,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10)

    const utmSourcesMap = new Map()
    const utmMediumsMap = new Map()
    const utmCampaignsMap = new Map()
    const utmContentsMap = new Map()
    const utmTermsMap = new Map()

    currentEvents.forEach((e) => {
      if (e.utm_source) {
        const sessions = utmSourcesMap.get(e.utm_source) || new Set()
        sessions.add(e.session_id)
        utmSourcesMap.set(e.utm_source, sessions)
      }
      if (e.utm_medium) {
        const sessions = utmMediumsMap.get(e.utm_medium) || new Set()
        sessions.add(e.session_id)
        utmMediumsMap.set(e.utm_medium, sessions)
      }
      if (e.utm_campaign) {
        const sessions = utmCampaignsMap.get(e.utm_campaign) || new Set()
        sessions.add(e.session_id)
        utmCampaignsMap.set(e.utm_campaign, sessions)
      }
      if (e.utm_content) {
        const sessions = utmContentsMap.get(e.utm_content) || new Set()
        sessions.add(e.session_id)
        utmContentsMap.set(e.utm_content, sessions)
      }
      if (e.utm_term) {
        const sessions = utmTermsMap.get(e.utm_term) || new Set()
        sessions.add(e.session_id)
        utmTermsMap.set(e.utm_term, sessions)
      }
    })

    const utmSources = Array.from(utmSourcesMap.entries())
      .map(([value, sessions]) => ({ value, visitors: sessions.size }))
      .sort((a, b) => b.visitors - a.visitors)

    const utmMediums = Array.from(utmMediumsMap.entries())
      .map(([value, sessions]) => ({ value, visitors: sessions.size }))
      .sort((a, b) => b.visitors - a.visitors)

    const utmCampaigns = Array.from(utmCampaignsMap.entries())
      .map(([value, sessions]) => ({ value, visitors: sessions.size }))
      .sort((a, b) => b.visitors - a.visitors)

    const utmContents = Array.from(utmContentsMap.entries())
      .map(([value, sessions]) => ({ value, visitors: sessions.size }))
      .sort((a, b) => b.visitors - a.visitors)

    const utmTerms = Array.from(utmTermsMap.entries())
      .map(([value, sessions]) => ({ value, visitors: sessions.size }))
      .sort((a, b) => b.visitors - a.visitors)

    const countriesMap = new Map()
    currentEvents.forEach((e) => {
      const country = e.country || "Unknown"
      const sessions = countriesMap.get(country) || new Set()
      sessions.add(e.session_id)
      countriesMap.set(country, sessions)
    })

    const totalCountryVisitors = currentVisitors
    const countries = Array.from(countriesMap.entries())
      .map(([country, sessions]) => ({
        country,
        visitors: sessions.size,
        percentage: totalCountryVisitors > 0 ? Math.round((sessions.size / totalCountryVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5)

    const devicesMap = new Map()
    currentEvents.forEach((e) => {
      const device = e.device_type || "Unknown"
      const sessions = devicesMap.get(device) || new Set()
      sessions.add(e.session_id)
      devicesMap.set(device, sessions)
    })

    const devices = Array.from(devicesMap.entries())
      .map(([device, sessions]) => ({
        device: device.charAt(0).toUpperCase() + device.slice(1),
        visitors: sessions.size,
        percentage: totalCountryVisitors > 0 ? Math.round((sessions.size / totalCountryVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)

    const osMap = new Map()
    currentEvents.forEach((e) => {
      let os = "Unknown"
      const ua = e.user_agent?.toLowerCase() || ""
      if (ua.includes("windows")) os = "Windows"
      else if (ua.includes("mac")) os = "Mac"
      else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS"
      else if (ua.includes("android")) os = "Android"
      else if (ua.includes("linux")) os = "Linux"

      const sessions = osMap.get(os) || new Set()
      sessions.add(e.session_id)
      osMap.set(os, sessions)
    })

    const operatingSystems = Array.from(osMap.entries())
      .map(([os, sessions]) => ({
        os,
        visitors: sessions.size,
        percentage: totalCountryVisitors > 0 ? Math.round((sessions.size / totalCountryVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)

    const { data: shortUrls } = await supabase
      .from("short_urls")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    let shortUrlsQuery = supabase.from("short_urls").select("*")

    if (languageFilter) {
      shortUrlsQuery = shortUrlsQuery.eq("language", languageFilter)
    }

    const { data: allShortUrls } = await shortUrlsQuery

    const { data: shortUrlClickEvents } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("event_type", "short_url_click")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    const { data: botClickEvents } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("event_type", "bot_click")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    const shortUrlClicksMap = new Map()
    const shortUrlBotClicksMap = new Map()
    const shortUrlFormSubmissionsMap = new Map()

    shortUrlClickEvents?.forEach((event) => {
      const shortCode = event.metadata?.short_code
      if (shortCode) {
        shortUrlClicksMap.set(shortCode, (shortUrlClicksMap.get(shortCode) || 0) + 1)
      }
    })

    botClickEvents?.forEach((event) => {
      const shortCode = event.metadata?.short_code
      if (shortCode) {
        shortUrlBotClicksMap.set(shortCode, (shortUrlBotClicksMap.get(shortCode) || 0) + 1)
      }
    })

    currentLeads.forEach((lead) => {
      allShortUrls?.forEach((url) => {
        if (
          (lead.utm_source && url.utm_source === lead.utm_source) ||
          (lead.utm_campaign && url.utm_campaign === lead.utm_campaign)
        ) {
          shortUrlFormSubmissionsMap.set(url.short_code, (shortUrlFormSubmissionsMap.get(url.short_code) || 0) + 1)
        }
      })
    })

    const topShortUrls = (allShortUrls || [])
      .map((url) => ({
        shortCode: url.short_code,
        longUrl: url.long_url,
        clicks: shortUrlClicksMap.get(url.short_code) || url.total_clicks || 0,
        botClicks: shortUrlBotClicksMap.get(url.short_code) || 0,
        formSubmissions: shortUrlFormSubmissionsMap.get(url.short_code) || 0,
        utmSource: url.utm_source,
        utmCampaign: url.utm_campaign,
        blogger: url.blogger,
        language: url.language,
        targetId: url.target_id,
        createdAt: url.created_at,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    const bloggerStatsMap = new Map()
    allShortUrls?.forEach((url) => {
      if (url.blogger) {
        const stats = bloggerStatsMap.get(url.blogger) || { clicks: 0, urls: 0, leads: 0 }
        stats.clicks += shortUrlClicksMap.get(url.short_code) || 0
        stats.urls += 1
        bloggerStatsMap.set(url.blogger, stats)
      }
    })

    currentLeads.forEach((lead) => {
      allShortUrls?.forEach((url) => {
        if (
          url.blogger &&
          ((lead.utm_source && url.utm_source === lead.utm_source) ||
            (lead.utm_campaign && url.utm_campaign === lead.utm_campaign))
        ) {
          const stats = bloggerStatsMap.get(url.blogger)
          if (stats) {
            stats.leads = (stats.leads || 0) + 1
          }
        }
      })
    })

    const topBloggers = Array.from(bloggerStatsMap.entries())
      .map(([blogger, stats]) => ({
        blogger,
        clicks: stats.clicks,
        urls: stats.urls,
        leads: stats.leads,
        conversionRate: stats.clicks > 0 ? ((stats.leads / stats.clicks) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    const campaignStatsMap = new Map()
    allShortUrls?.forEach((url) => {
      if (url.utm_campaign) {
        const stats = campaignStatsMap.get(url.utm_campaign) || { clicks: 0, urls: 0, leads: 0 }
        stats.clicks += shortUrlClicksMap.get(url.short_code) || 0
        stats.urls += 1
        campaignStatsMap.set(url.utm_campaign, stats)
      }
    })

    currentLeads.forEach((lead) => {
      if (lead.utm_campaign && campaignStatsMap.has(lead.utm_campaign)) {
        const stats = campaignStatsMap.get(lead.utm_campaign)
        stats.leads = (stats.leads || 0) + 1
      }
    })

    const topCampaigns = Array.from(campaignStatsMap.entries())
      .map(([campaign, stats]) => {
        // Find earliest creation date for this campaign
        const campaignUrls = allShortUrls?.filter((url) => url.utm_campaign === campaign) || []
        const earliestDate =
          campaignUrls.length > 0
            ? campaignUrls.reduce((earliest, url) => {
                const urlDate = new Date(url.created_at)
                return urlDate < new Date(earliest) ? url.created_at : earliest
              }, campaignUrls[0].created_at)
            : null

        return {
          campaign,
          clicks: stats.clicks,
          urls: stats.urls,
          leads: stats.leads,
          conversionRate: stats.clicks > 0 ? ((stats.leads / stats.clicks) * 100).toFixed(1) : "0.0",
          createdAt: earliestDate, // Added creation date
        }
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    const serviceStatsMap = new Map()
    currentLeads.forEach((lead) => {
      if (lead.service_type) {
        serviceStatsMap.set(lead.service_type, (serviceStatsMap.get(lead.service_type) || 0) + 1)
      }
    })

    const topServices = Array.from(serviceStatsMap.entries())
      .map(([service, count]) => ({
        service,
        count,
        percentage: leads > 0 ? ((count / leads) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    const totalShortUrls = allShortUrls?.length || 0
    const newShortUrls = shortUrls?.length || 0
    const totalShortUrlClicks = Array.from(shortUrlClicksMap.values()).reduce((sum, clicks) => sum + clicks, 0)

    console.log("[v0] API Response - Short URLs:", {
      totalShortUrls,
      newShortUrls,
      totalShortUrlClicks,
      topShortUrlsCount: topShortUrls.length,
      topBloggersCount: topBloggers.length,
      topCampaignsCount: topCampaigns.length,
    })

    return NextResponse.json({
      visitors: currentVisitors,
      visitorsChange,
      pageViews: currentPageViews,
      pageViewsChange,
      leads,
      leadsChange,
      leadConversionRate: Number(leadConversionRate),
      contracts,
      contractsChange,
      closeRate: Number(closeRate),
      bounceRate: currentBounceRate,
      bounceRateChange,
      botClicks,
      botClicksChange,
      formStarts,
      formCompletions,
      formAbandonments,
      formCompletionRate: Number(formCompletionRate),
      timeline,
      pages,
      referrers,
      utmSources,
      utmMediums,
      utmCampaigns,
      utmContents,
      utmTerms,
      countries,
      devices,
      operatingSystems,
      totalShortUrls,
      newShortUrls,
      totalShortUrlClicks,
      topShortUrls,
      topBloggers,
      topCampaigns,
      topServices, // Added top services to response
    })
  } catch (error) {
    console.error("[v0] Vercel-style API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
