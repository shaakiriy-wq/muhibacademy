"use client"

import { useState, useEffect } from "react"
import { Brain, Sparkles, TrendingUp, AlertCircle } from "lucide-react"

interface AIInsight {
  type: "success" | "warning" | "info"
  title: string
  description: string
  action?: string
}

interface LeadWithAI {
  id: string
  full_name: string
  service_type: string
  lead_quality: string
  contact_status: string
  utm_campaign?: string
  age?: number
  gender?: string
  notes_ai?: string
  score: number
}

export default function AIConsultantPage() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [topLeads, setTopLeads] = useState<LeadWithAI[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    fetchAIInsights()
  }, [])

  const fetchAIInsights = async () => {
    try {
      const res = await fetch("/api/analytics/ai-insights")
      const data = await res.json()
      setInsights(data.insights || [])
      setTopLeads(data.topLeads || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeLeads = async () => {
    setAnalyzing(true)
    try {
      await fetch("/api/analytics/ai-insights", { method: "POST" })
      await fetchAIInsights()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Yuklanmoqda...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            AI Marketing Maslahatchi
          </h1>
          <p className="text-slate-400">Sun'iy intellekt tahlili va tavsiyalari</p>
        </div>
        <button
          onClick={analyzeLeads}
          disabled={analyzing}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="h-5 w-5" />
          {analyzing ? "Tahlil qilinmoqda..." : "AI Tahlil Qilish"}
        </button>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`bg-slate-800/30 backdrop-blur-sm rounded-xl border p-6 ${
              insight.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/5"
                : insight.type === "warning"
                  ? "border-yellow-500/30 bg-yellow-500/5"
                  : "border-blue-500/30 bg-blue-500/5"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  insight.type === "success"
                    ? "bg-emerald-500/20"
                    : insight.type === "warning"
                      ? "bg-yellow-500/20"
                      : "bg-blue-500/20"
                }`}
              >
                {insight.type === "success" ? (
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                ) : insight.type === "warning" ? (
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                ) : (
                  <Brain className="h-6 w-6 text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                <p className="text-slate-300 mb-3">{insight.description}</p>
                {insight.action && (
                  <div className="inline-block px-3 py-1 bg-slate-700/50 rounded text-sm text-slate-300">
                    💡 {insight.action}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Priority Leads */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Eng Istiqbolli Leadlar (AI Bahosi)
          </h3>
          <p className="text-slate-400 text-sm mt-1">AI tomonidan baholangan eng sifatli leadlar</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">AI Ball</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ism</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Xizmat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kampaniya</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Demografiya</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">AI Tavsiya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {topLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`text-2xl font-bold ${
                          lead.score >= 80
                            ? "text-emerald-400"
                            : lead.score >= 60
                              ? "text-yellow-400"
                              : "text-slate-400"
                        }`}
                      >
                        {lead.score}
                      </div>
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            lead.score >= 80
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : lead.score >= 60
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{lead.full_name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{lead.service_type}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{lead.utm_campaign || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {lead.age && lead.gender ? `${lead.age} yosh, ${lead.gender}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-purple-400 max-w-xs truncate">{lead.notes_ai || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Eng Yaxshi Strategiyalar</h3>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              18-24 yosh guruhi eng ko'p konversiya bermoqda
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              Instagram Stories kampaniyalari eng yuqori ROI ko'rsatmoqda
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              Hafta oxiri arizalari 2x ko'proq shartnomaga aylanmoqda
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">⚠️ E'tibor Talab Qiladi</h3>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">!</span>
              15 ta lead 48 soatdan beri javobsiz
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">!</span>
              Facebook Ads CPL o'rtachadan 30% yuqori
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">!</span>8 ta uchrashuv belgilandi, ammo tasdiqlanmadi
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
