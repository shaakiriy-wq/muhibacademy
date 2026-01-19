"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, UserCheck } from "lucide-react"

interface BloggerStat {
  id: string
  blogger_name: string
  total_clicks: number
  total_leads: number
  qualified_leads: number
  contracts: number
  deposits: number
  cpl: number
  payment_amount: number
  payment_status: string
}

export default function BloggersPage() {
  const [bloggers, setBloggers] = useState<BloggerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [newPayment, setNewPayment] = useState({
    blogger_name: "",
    campaign_name: "",
    payment_amount: 0,
    cpl: 0,
  })

  useEffect(() => {
    fetchBloggers()
  }, [])

  const fetchBloggers = async () => {
    try {
      const res = await fetch("/api/analytics/bloggers")
      const data = await res.json()
      setBloggers(data.bloggers || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async () => {
    try {
      await fetch("/api/analytics/bloggers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment),
      })
      fetchBloggers()
      setNewPayment({ blogger_name: "", campaign_name: "", payment_amount: 0, cpl: 0 })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const totalStats = {
    totalClicks: bloggers.reduce((sum, b) => sum + b.total_clicks, 0),
    totalLeads: bloggers.reduce((sum, b) => sum + b.total_leads, 0),
    totalPaid: bloggers.reduce((sum, b) => sum + b.payment_amount, 0),
    avgCPL: bloggers.length > 0 ? bloggers.reduce((sum, b) => sum + b.cpl, 0) / bloggers.length : 0,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Blogerlar va To'lovlar</h1>
        <p className="text-slate-400">Influencerlar bilan ishlash va to'lovlarni boshqarish</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <TrendingUp className="h-8 w-8 text-blue-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{totalStats.totalClicks.toLocaleString()}</div>
          <div className="text-slate-400">Jami Kliklar</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
          <UserCheck className="h-8 w-8 text-emerald-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{totalStats.totalLeads}</div>
          <div className="text-slate-400">Jami Leadlar</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <DollarSign className="h-8 w-8 text-purple-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${totalStats.avgCPL.toFixed(2)}</div>
          <div className="text-slate-400">O'rtacha CPL</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
          <DollarSign className="h-8 w-8 text-orange-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${totalStats.totalPaid.toLocaleString()}</div>
          <div className="text-slate-400">Jami To'langan</div>
        </div>
      </div>

      {/* Add New Payment Form */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Yangi To'lov Qo'shish</h3>
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Bloger nomi"
            value={newPayment.blogger_name}
            onChange={(e) => setNewPayment({ ...newPayment, blogger_name: e.target.value })}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400"
          />
          <input
            type="text"
            placeholder="Kampaniya nomi"
            value={newPayment.campaign_name}
            onChange={(e) => setNewPayment({ ...newPayment, campaign_name: e.target.value })}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400"
          />
          <input
            type="number"
            placeholder="To'lov miqdori"
            value={newPayment.payment_amount}
            onChange={(e) => setNewPayment({ ...newPayment, payment_amount: Number.parseFloat(e.target.value) })}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400"
          />
          <button
            onClick={addPayment}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Qo'shish
          </button>
        </div>
      </div>

      {/* Bloggers Table */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Bloger</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kliklar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Leadlar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Sifatli</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Shartnomalar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">CPL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">To'lov</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {bloggers.map((blogger) => (
                <tr key={blogger.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-white">{blogger.blogger_name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{blogger.total_clicks}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{blogger.total_leads}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{blogger.qualified_leads}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{blogger.contracts}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">${blogger.cpl.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-400">
                    ${blogger.payment_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        blogger.payment_status === "paid"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {blogger.payment_status === "paid" ? "To'langan" : "Kutilmoqda"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
