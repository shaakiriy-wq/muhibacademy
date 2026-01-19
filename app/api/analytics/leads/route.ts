import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")
    const sourceFilter = searchParams.get("source")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch all leads
    let leadsQuery = supabase
      .from("form_submissions")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })

    if (sourceFilter) {
      leadsQuery = leadsQuery.eq("utm_source", sourceFilter)
    }

    const { data: leads, error: leadsError } = await leadsQuery

    if (leadsError) throw leadsError

    // Fetch analytics events for funnel analysis
    let analyticsQuery = supabase.from("analytics_events").select("*").gte("created_at", startDate.toISOString())

    if (sourceFilter) {
      analyticsQuery = analyticsQuery.eq("utm_source", sourceFilter)
    }

    const { data: analytics, error: analyticsError } = await analyticsQuery

    if (analyticsError) throw analyticsError

    // Calculate funnel metrics
    const totalPageViews = analytics?.length || 0
    const uniqueVisitors = new Set(analytics?.map((a) => a.session_id)).size
    const totalLeads = leads?.length || 0
    const completeLeads = leads?.filter((l) => l.step_completed === 5)?.length || 0
    const incompleteLeads = totalLeads - completeLeads
    const botClicks = leads?.filter((l) => l.clicked_bot)?.length || 0

    // Source performance
    const sourcePerformance = new Map()
    analytics?.forEach((event) => {
      const source = event.utm_source || "Direct"
      if (!sourcePerformance.has(source)) {
        sourcePerformance.set(source, { views: 0, leads: 0, conversions: 0, blogger: event.metadata?.blogger || "-" })
      }
      sourcePerformance.get(source).views++
    })

    leads?.forEach((lead) => {
      const source = lead.utm_source || "Direct"
      if (sourcePerformance.has(source)) {
        sourcePerformance.get(source).leads++
        if (lead.clicked_bot) {
          sourcePerformance.get(source).conversions++
        }
      }
    })

    const sourceStats = Array.from(sourcePerformance.entries())
      .map(([source, data]) => ({
        source,
        ...data,
        conversionRate: data.views > 0 ? ((data.leads / data.views) * 100).toFixed(2) : "0",
        closeRate: data.leads > 0 ? ((data.conversions / data.leads) * 100).toFixed(2) : "0",
      }))
      .sort((a, b) => b.leads - a.leads)

    // Top bloggers
    const bloggerPerformance = new Map()
    leads?.forEach((lead) => {
      const blogger = lead.form_data?.blogger || "-"
      if (!bloggerPerformance.has(blogger)) {
        bloggerPerformance.set(blogger, { leads: 0, conversions: 0 })
      }
      bloggerPerformance.get(blogger).leads++
      if (lead.clicked_bot) {
        bloggerPerformance.get(blogger).conversions++
      }
    })

    const topBloggers = Array.from(bloggerPerformance.entries())
      .map(([blogger, data]) => ({
        blogger,
        ...data,
        closeRate: data.leads > 0 ? ((data.conversions / data.leads) * 100).toFixed(2) : "0",
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 10)

    // Top services
    const servicePerformance = new Map()
    leads?.forEach((lead) => {
      const service = lead.service_type || "Unknown"
      if (!servicePerformance.has(service)) {
        servicePerformance.set(service, { count: 0 })
      }
      servicePerformance.get(service).count++
    })

    const topServices = Array.from(servicePerformance.entries())
      .map(([service, data]) => ({ service, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Demographics
    const ageGroups = new Map()
    const genderDist = new Map()
    const countries = new Map()

    leads?.forEach((lead) => {
      // Age groups
      if (lead.age) {
        const ageGroup =
          lead.age < 20 ? "18-19" : lead.age < 25 ? "20-24" : lead.age < 30 ? "25-29" : lead.age < 35 ? "30-34" : "35+"
        ageGroups.set(ageGroup, (ageGroups.get(ageGroup) || 0) + 1)
      }

      // Gender
      if (lead.gender) {
        genderDist.set(lead.gender, (genderDist.get(lead.gender) || 0) + 1)
      }

      // Countries
      if (lead.country) {
        countries.set(lead.country, (countries.get(lead.country) || 0) + 1)
      }
    })

    return NextResponse.json({
      leads: leads || [],
      funnel: {
        pageViews: totalPageViews,
        visitors: uniqueVisitors,
        leads: totalLeads,
        completeLeads,
        incompleteLeads,
        botClicks,
        viewToLeadRate: totalPageViews > 0 ? ((totalLeads / totalPageViews) * 100).toFixed(2) : "0",
        completionRate: totalLeads > 0 ? ((completeLeads / totalLeads) * 100).toFixed(2) : "0",
        botConversionRate: completeLeads > 0 ? ((botClicks / completeLeads) * 100).toFixed(2) : "0",
      },
      sourcePerformance: sourceStats,
      topBloggers,
      topServices,
      demographics: {
        ageGroups: Array.from(ageGroups.entries()).map(([age, count]) => ({ age, count })),
        gender: Array.from(genderDist.entries()).map(([gender, count]) => ({ gender, count })),
        countries: Array.from(countries.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching leads analytics:", error)
    return NextResponse.json({ leads: [], funnel: null }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { leadId, ...updates } = body

    const { error } = await supabase
      .from("form_submissions")
      .update({ ...updates, last_updated: new Date().toISOString() })
      .eq("id", leadId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
