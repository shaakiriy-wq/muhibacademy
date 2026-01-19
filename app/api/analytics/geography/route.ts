import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all events with country data
    const { data: events, error } = await supabase
      .from("analytics_events")
      .select("country, event_type")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching geography data:", error)
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }

    // Get form submissions with country data
    const { data: forms, error: formsError } = await supabase.from("form_submissions").select("country, clicked_bot")

    if (formsError) {
      console.error("Error fetching forms:", formsError)
    }

    // Aggregate by country
    const countryMap = new Map()

    events?.forEach((event: any) => {
      const country = event.country || "Noma'lum"
      if (!countryMap.has(country)) {
        countryMap.set(country, { country, visits: 0, forms: 0, botClicks: 0 })
      }
      if (event.event_type === "page_view") {
        countryMap.get(country).visits++
      }
    })

    forms?.forEach((form: any) => {
      const country = form.country || "Noma'lum"
      if (!countryMap.has(country)) {
        countryMap.set(country, { country, visits: 0, forms: 0, botClicks: 0 })
      }
      countryMap.get(country).forms++
      if (form.clicked_bot) {
        countryMap.get(country).botClicks++
      }
    })

    // Convert to array and calculate conversion rates
    const countries = Array.from(countryMap.values())
      .map((item: any) => ({
        ...item,
        conversionRate: item.visits > 0 ? ((item.forms / item.visits) * 100).toFixed(1) : "0.0",
      }))
      .sort((a: any, b: any) => b.visits - a.visits)

    const totalVisits = countries.reduce((sum: number, item: any) => sum + item.visits, 0)
    const topCountry = countries[0] || null

    return NextResponse.json({
      countries,
      totalVisits,
      topCountry: topCountry ? { country: topCountry.country, count: topCountry.visits } : null,
    })
  } catch (error) {
    console.error("Error in geography API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
