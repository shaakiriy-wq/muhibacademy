import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const GEMINI_API_KEY = "AIzaSyDhX0FGr3SW4izUwj7maqnJstxitW8uBbQ"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

async function getGeminiInsights(analyticsData: any) {
  const prompt = `
Sizga marketing analytics ma'lumotlari berilgan. Quyidagi ma'lumotlarni tahlil qiling va o'zbek tilida qisqa va aniq insights (tavsiyalar) bering:

Ma'lumotlar:
- Umumiy tashrif: ${analyticsData.totalPageViews}
- Short URL kliklar: ${analyticsData.totalShortUrlClicks}
- Lidlar: ${analyticsData.totalLeads}
- Bot bosmalar: ${analyticsData.totalBotClicks}
- Konversiya foizi: ${analyticsData.conversionRate}%
- Eng yaxshi UTM source: ${analyticsData.topUtmSource}
- Eng ko'p tashrif kelgan davlat: ${analyticsData.topCountry}

3 ta konkret tavsiya bering:
1. Qaysi kampaniyani kuchaytirish kerak
2. Qaysi geografiyaga e'tibor berish kerak
3. Konversiyani oshirish uchun nimalar qilish mumkin

Javobni JSON formatida bering: { "insights": ["tavsiya1", "tavsiya2", "tavsiya3"] }
`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error("Gemini API error")
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return { insights: ["AI tavsiya olishda xatolik yuz berdi"] }
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return { insights: ["AI tavsiya olishda xatolik yuz berdi"] }
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)

    // Get analytics data
    const { data: events } = await supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", dateFrom.toISOString())

    const { data: leads } = await supabase
      .from("form_submissions")
      .select("*")
      .gte("created_at", dateFrom.toISOString())

    const { data: shortUrlClicks } = await supabase
      .from("short_url_clicks")
      .select("*")
      .gte("clicked_at", dateFrom.toISOString())

    // Calculate analytics
    const totalPageViews = events?.length || 0
    const totalLeads = leads?.length || 0
    const totalBotClicks = leads?.filter((l) => l.clicked_bot).length || 0
    const totalShortUrlClicks = shortUrlClicks?.length || 0
    const conversionRate = totalPageViews > 0 ? ((totalLeads / totalPageViews) * 100).toFixed(2) : "0"

    // Top UTM source
    const utmSources: Record<string, number> = {}
    events?.forEach((e) => {
      if (e.utm_source) utmSources[e.utm_source] = (utmSources[e.utm_source] || 0) + 1
    })
    const topUtmSource = Object.entries(utmSources).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    // Top country
    const countries: Record<string, number> = {}
    events?.forEach((e) => {
      if (e.country) countries[e.country] = (countries[e.country] || 0) + 1
    })
    const topCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    const analyticsData = {
      totalPageViews,
      totalShortUrlClicks,
      totalLeads,
      totalBotClicks,
      conversionRate,
      topUtmSource,
      topCountry,
    }

    // Get AI insights
    const aiInsights = await getGeminiInsights(analyticsData)

    return NextResponse.json({
      ...analyticsData,
      aiInsights: aiInsights.insights,
    })
  } catch (error) {
    console.error("[v0] AI insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
