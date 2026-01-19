"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react"

interface FinanceData {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  roi: number
  campaigns: Array<{
    campaign_name: string
    revenue: number
    cost: number
    profit: number
    roi: number
    leads: number
    contracts: number
  }>
}

export default function FinancePage() {
  const [finance, setFinance] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30")

  useEffect(() => {
    fetchFinance()
  }, [dateRange])

  const fetchFinance = async () => {
    try {
      const res = await fetch(`/api/analytics/finance?days=${dateRange}`)
      const data = await res.json()
      setFinance(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !finance) {
    return <div className="flex items-center justify-center h-screen text-white">Yuklanmoqda...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Moliyaviy Tahlil</h1>
          <p className="text-slate-400">Daromad, xarajat va ROI tahlili</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          <option value="7">7 kun</option>
          <option value="30">30 kun</option>
          <option value="90">90 kun</option>
          <option value="365">1 yil</option>
        </select>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
          <DollarSign className="h-10 w-10 text-emerald-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">${finance.totalRevenue.toLocaleString()}</div>
          <div className="text-slate-400">Jami Daromad</div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
          <TrendingDown className="h-10 w-10 text-red-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">${finance.totalCost.toLocaleString()}</div>
          <div className="text-slate-400">Jami Xarajat</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <TrendingUp className="h-10 w-10 text-blue-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">${finance.totalProfit.toLocaleString()}</div>
          <div className="text-slate-400">Sof Foyda</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <PieChart className="h-10 w-10 text-purple-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{finance.roi.toFixed(1)}%</div>
          <div className="text-slate-400">ROI</div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Kampaniya bo'yicha Moliyaviy Ko'rsatkichlar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kampaniya</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Daromad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Xarajat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Foyda</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">ROI</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Leadlar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Shartnomalar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {finance.campaigns.map((campaign, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-white">{campaign.campaign_name}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400">${campaign.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-400">${campaign.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">${campaign.profit.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        campaign.roi > 100
                          ? "bg-emerald-500/20 text-emerald-400"
                          : campaign.roi > 0
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {campaign.roi.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{campaign.leads}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{campaign.contracts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
