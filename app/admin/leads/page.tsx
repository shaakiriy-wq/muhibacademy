"use client"

import { useState, useEffect } from "react"
import { Search, Edit } from "lucide-react"

interface Lead {
  id: string
  full_name: string
  phone: string
  whatsapp: string
  service_type: string
  age?: number
  gender?: string
  country: string
  utm_source?: string
  utm_campaign?: string
  lead_quality: string
  contact_status: string
  meeting_scheduled: boolean
  meeting_date?: string
  contract_signed: boolean
  deposit_paid: boolean
  deposit_amount?: number
  assigned_operator?: string
  university_name?: string
  created_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/analytics/leads")
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      await fetch("/api/analytics/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, ...updates }),
      })
      fetchLeads()
      setEditingLead(null)
    } catch (error) {
      console.error("Error updating lead:", error)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "new" && lead.lead_quality === "new") ||
      (filter === "contacted" && lead.contact_status === "contacted") ||
      (filter === "meeting" && lead.meeting_scheduled) ||
      (filter === "contract" && lead.contract_signed) ||
      (filter === "deposit" && lead.deposit_paid)

    const matchesSearch = lead.full_name.toLowerCase().includes(search.toLowerCase()) || lead.phone.includes(search)

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.lead_quality === "new").length,
    contacted: leads.filter((l) => l.contact_status === "contacted").length,
    meetings: leads.filter((l) => l.meeting_scheduled).length,
    contracts: leads.filter((l) => l.contract_signed).length,
    deposits: leads.filter((l) => l.deposit_paid).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leadlar Boshqaruvi</h1>
        <p className="text-slate-400">Barcha arizalarni boshqaring va kuzatib boring</p>
      </div>

      {/* Funnel Stats */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: "Jami", value: stats.total, color: "bg-blue-500" },
          { label: "Yangi", value: stats.new, color: "bg-yellow-500" },
          { label: "Aloqa", value: stats.contacted, color: "bg-purple-500" },
          { label: "Uchrashuv", value: stats.meetings, color: "bg-orange-500" },
          { label: "Shartnoma", value: stats.contracts, color: "bg-teal-500" },
          { label: "Depozit", value: stats.deposits, color: "bg-emerald-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Ism yoki telefon raqami bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">Barchasi</option>
          <option value="new">Yangi</option>
          <option value="contacted">Aloqada</option>
          <option value="meeting">Uchrashuv</option>
          <option value="contract">Shartnoma</option>
          <option value="deposit">Depozit</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ism</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Telefon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Xizmat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Holat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kampaniya</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Operator</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-white">{lead.full_name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{lead.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{lead.service_type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        lead.deposit_paid
                          ? "bg-emerald-500/20 text-emerald-400"
                          : lead.contract_signed
                            ? "bg-teal-500/20 text-teal-400"
                            : lead.meeting_scheduled
                              ? "bg-orange-500/20 text-orange-400"
                              : lead.contact_status === "contacted"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {lead.deposit_paid
                        ? "Depozit"
                        : lead.contract_signed
                          ? "Shartnoma"
                          : lead.meeting_scheduled
                            ? "Uchrashuv"
                            : lead.contact_status === "contacted"
                              ? "Aloqada"
                              : "Yangi"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{lead.utm_campaign || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{lead.assigned_operator || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Lead Tahrirlash</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Holat</label>
                <select
                  value={editingLead.lead_quality}
                  onChange={(e) => setEditingLead({ ...editingLead, lead_quality: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="new">Yangi</option>
                  <option value="qualified">Kvalifikatsiya</option>
                  <option value="unqualified">Yaroqsiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Aloqa Holati</label>
                <select
                  value={editingLead.contact_status}
                  onChange={(e) => setEditingLead({ ...editingLead, contact_status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="contacted">Aloqada</option>
                  <option value="no_answer">Javob yo'q</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingLead.meeting_scheduled}
                    onChange={(e) => setEditingLead({ ...editingLead, meeting_scheduled: e.target.checked })}
                    className="rounded"
                  />
                  Uchrashuv Belgilandi
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingLead.contract_signed}
                    onChange={(e) => setEditingLead({ ...editingLead, contract_signed: e.target.checked })}
                    className="rounded"
                  />
                  Shartnoma Imzolandi
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingLead.deposit_paid}
                    onChange={(e) => setEditingLead({ ...editingLead, deposit_paid: e.target.checked })}
                    className="rounded"
                  />
                  Depozit To'landi
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Depozit Miqdori</label>
                <input
                  type="number"
                  value={editingLead.deposit_amount || ""}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, deposit_amount: Number.parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Operator</label>
                <input
                  type="text"
                  value={editingLead.assigned_operator || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, assigned_operator: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Universitet</label>
                <input
                  type="text"
                  value={editingLead.university_name || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, university_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingLead(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => updateLead(editingLead.id, editingLead)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
