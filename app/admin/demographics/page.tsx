"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, Globe } from "lucide-react"

export default function DemographicsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDemographics()
  }, [])

  const fetchDemographics = async () => {
    try {
      const res = await fetch("/api/analytics/demographics")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching demographics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Yuklanmoqda...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Demografiya va Xizmatlar Tahlili</h1>
        <p className="text-slate-400">Foydalanuvchilar demografiyasi va xizmat turlari bo'yicha tahlil</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <Users className="h-10 w-10 text-blue-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats?.totalUsers || 0}</div>
          <div className="text-slate-400">Jami Foydalanuvchilar</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 rounded-xl p-6">
          <Globe className="h-10 w-10 text-pink-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats?.countries || 0}</div>
          <div className="text-slate-400">Davlatlar</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <TrendingUp className="h-10 w-10 text-purple-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats?.avgAge || 0}</div>
          <div className="text-slate-400">O'rtacha Yosh</div>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Jins Bo'yicha</h3>
          <div className="space-y-3">
            {stats?.genderStats?.map((item: any) => (
              <div key={item.gender} className="flex items-center justify-between">
                <span className="text-slate-300 capitalize">{item.gender || "Noma'lum"}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${(item.count / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Yosh Guruhlari</h3>
          <div className="space-y-3">
            {stats?.ageGroups?.map((item: any) => (
              <div key={item.group} className="flex items-center justify-between">
                <span className="text-slate-300">{item.group}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${(item.count / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Xizmat Turlari</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.serviceStats?.map((item: any) => (
            <div key={item.service} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-300">{item.service}</span>
                <span className="text-2xl font-bold text-white">{item.count}</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${(item.count / stats.totalUsers) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
