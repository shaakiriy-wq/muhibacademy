import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Simple AI scoring algorithm based on lead quality indicators
function calculateLeadScore(lead: any): number {
  let score = 50 // Base score

  // Demographics bonus
  if (lead.age && lead.age >= 18 && lead.age <= 30) score += 15
  if (lead.gender) score += 5

  // Engagement bonus
  if (lead.utm_campaign) score += 10
  if (lead.clicked_bot) score += 10

  // Service type bonus (some services convert better)
  if (lead.service_type?.includes("Magistr") || lead.service_type?.includes("Master")) score += 10

  // Lead quality
  if (lead.lead_quality === "qualified") score += 20
  if (lead.contact_status === "contacted") score += 10

  return Math.min(score, 100)
}

function generateAINote(lead: any, score: number): string {
  if (score >= 80) {
    return "Yuqori sifatli lead. Tezda aloqaga chiqing va maxsus chegirma taklif qiling."
  }
  if (score >= 60) {
    return "Yaxshi potensial. Uchrashuv belgilang va batafsil ma'lumot bering."
  }
  return "Follow-up qiling. Qo'shimcha savollar bering va ehtiyojlarini aniqlang."
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch recent leads
    const { data: leads, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error

    // Calculate AI scores and add notes
    const scoredLeads = leads?.map((lead) => {
      const score = calculateLeadScore(lead)
      return {
        ...lead,
        score,
        notes_ai: generateAINote(lead, score),
      }
    })

    // Get top leads
    const topLeads = scoredLeads?.sort((a, b) => b.score - a.score).slice(0, 10) || []

    // Generate insights
    const insights: any[] = []

    const highScoreCount = scoredLeads?.filter((l) => l.score >= 80).length || 0
    if (highScoreCount > 0) {
      insights.push({
        type: "success",
        title: `${highScoreCount} ta yuqori sifatli lead topildi!`,
        description:
          "Bu leadlar tez konversiya qilish ehtimoli yuqori. Ularni birinchi navbatda qarab chiqishni tavsiya qilamiz.",
        action: "Darhol aloqaga chiqing va maxsus taklif taqdim eting",
      })
    }

    const unansweredCount = scoredLeads?.filter((l) => l.contact_status === "no_answer").length || 0
    if (unansweredCount > 5) {
      insights.push({
        type: "warning",
        title: `${unansweredCount} ta lead javobsiz`,
        description:
          "Ko'p leadlar aloqaga javob bermayapti. Boshqa aloqa kanallari (WhatsApp, Telegram) orqali urinib ko'ring.",
        action: "WhatsApp orqali xabar yuboring yoki boshqa vaqtda qo'ng'iroq qiling",
      })
    }

    const campaignPerformance = leads?.reduce((acc: any, lead) => {
      const campaign = lead.utm_campaign || "Unknown"
      if (!acc[campaign]) acc[campaign] = { leads: 0, contracts: 0 }
      acc[campaign].leads++
      if (lead.contract_signed) acc[campaign].contracts++
      return acc
    }, {})

    const bestCampaign = Object.entries(campaignPerformance || {})
      .map(([name, data]: [string, any]) => ({
        name,
        conversionRate: data.leads > 0 ? (data.contracts / data.leads) * 100 : 0,
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)[0]

    if (bestCampaign && bestCampaign.conversionRate > 20) {
      insights.push({
        type: "info",
        title: `"${bestCampaign.name}" kampaniyasi eng yaxshi ishlayapti`,
        description: `${bestCampaign.conversionRate.toFixed(1)}% konversiya darajasi bilan bu kampaniya boshqalardan ustun. Budget ni shu kampaniyaga ko'paytirish tavsiya etiladi.`,
        action: "Budget ni 50% oshiring va A/B test o'tkazing",
      })
    }

    return NextResponse.json({ insights, topLeads })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ insights: [], topLeads: [] }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = await createClient()

    const { data: leads } = await supabase.from("form_submissions").select("*")

    // Update AI scores and notes for all leads
    for (const lead of leads || []) {
      const score = calculateLeadScore(lead)
      const notes_ai = generateAINote(lead, score)

      await supabase.from("form_submissions").update({ notes_ai }).eq("id", lead.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error running AI analysis:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
