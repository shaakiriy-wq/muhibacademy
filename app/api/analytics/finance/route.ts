import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const days = Number.parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: submissions, error } = await supabase
      .from("form_submissions")
      .select("*")
      .gte("created_at", startDate.toISOString())

    if (error) throw error

    // Calculate financial metrics
    const totalRevenue = submissions?.reduce((sum, s) => sum + (s.revenue || 0), 0) || 0
    const totalCost = 5000 // Mock data - would come from campaign_budgets
    const totalProfit = totalRevenue - totalCost
    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0

    // Group by campaign
    const campaignMap = new Map()
    submissions?.forEach((sub) => {
      const campaign = sub.utm_campaign || "Unknown"
      if (!campaignMap.has(campaign)) {
        campaignMap.set(campaign, {
          campaign_name: campaign,
          revenue: 0,
          cost: 0,
          profit: 0,
          roi: 0,
          leads: 0,
          contracts: 0,
        })
      }
      const c = campaignMap.get(campaign)
      c.revenue += sub.revenue || 0
      c.leads += 1
      if (sub.contract_signed) c.contracts += 1
    })

    const campaigns = Array.from(campaignMap.values()).map((c) => ({
      ...c,
      cost: 1000, // Mock
      profit: c.revenue - 1000,
      roi: ((c.revenue - 1000) / 1000) * 100,
    }))

    return NextResponse.json({
      totalRevenue,
      totalCost,
      totalProfit,
      roi,
      campaigns,
    })
  } catch (error) {
    console.error("Error fetching finance data:", error)
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 })
  }
}
