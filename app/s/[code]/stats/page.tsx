"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  Users,
  MousePointerClick,
  Calendar,
  Globe,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

interface ShortUrlStats {
  shortUrl: {
    short_code: string
    target_url: string
    clicks: number
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    blogger?: string
    created_at: string
  }
  clicksByDate: { date: string; count: number }[]
  clicksByCountry: { country: string; count: number }[]
  clicksByDevice: { device: string; count: number }[]
  clicksByReferrer: { referrer: string; count: number }[]
  totalClicks: number
  uniqueVisitors: number
}

export default function ShortUrlStatsPage() {
  const params = useParams()
  const code = params.code as string
  const [stats, setStats] = useState<ShortUrlStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadStats()
  }, [code])

  const loadStats = async () => {
    try {
      const res = await fetch(`/api/short-urls/${code}/stats`)
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.error || "Ma'lumot topilmadi")
      }
    } catch (err) {
      setError("Xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`https://muhibacademy.uz/s/${code}`)
    alert("Link nusxalandi!")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-red-600">{error}</p>
            <Link href="/admin">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Admin panelga qaytish
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </Button>
          </Link>
          <Button onClick={copyLink} variant="outline" size="sm" className="gap-2 bg-transparent">
            <ExternalLink className="h-4 w-4" />
            Linkni nusxalash
          </Button>
        </div>

        {/* Short URL Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-6 w-6 text-emerald-600" />
              Short URL Statistikasi
            </CardTitle>
            <CardDescription>/{code}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Target URL</p>
              <a
                href={stats.shortUrl.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {stats.shortUrl.target_url}
              </a>
            </div>
            {stats.shortUrl.utm_source && (
              <div className="flex gap-4">
                {stats.shortUrl.utm_source && (
                  <div>
                    <p className="text-sm text-gray-500">UTM Source</p>
                    <p className="font-medium">{stats.shortUrl.utm_source}</p>
                  </div>
                )}
                {stats.shortUrl.utm_medium && (
                  <div>
                    <p className="text-sm text-gray-500">UTM Medium</p>
                    <p className="font-medium">{stats.shortUrl.utm_medium}</p>
                  </div>
                )}
                {stats.shortUrl.utm_campaign && (
                  <div>
                    <p className="text-sm text-gray-500">Campaign</p>
                    <p className="font-medium">{stats.shortUrl.utm_campaign}</p>
                  </div>
                )}
              </div>
            )}
            {stats.shortUrl.blogger && (
              <div>
                <p className="text-sm text-gray-500">Blogger</p>
                <p className="font-medium">{stats.shortUrl.blogger}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Yaratilgan sana</p>
              <p className="font-medium">{new Date(stats.shortUrl.created_at).toLocaleDateString("uz-UZ")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <MousePointerClick className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jami Kliklar</p>
                  <p className="text-2xl font-bold">{stats.totalClicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Noyob Tashrif</p>
                  <p className="text-2xl font-bold">{stats.uniqueVisitors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">O'rtacha CR</p>
                  <p className="text-2xl font-bold">
                    {stats.uniqueVisitors > 0 ? Math.round((stats.totalClicks / stats.uniqueVisitors) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Clicks by Date */}
          {stats.clicksByDate.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Kunlik Kliklar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.clicksByDate.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString("uz-UZ")}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-emerald-600"
                            style={{
                              width: `${(item.count / Math.max(...stats.clicksByDate.map((d) => d.count))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clicks by Country */}
          {stats.clicksByCountry.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Davlatlar bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.clicksByCountry.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.country || "Noma'lum"}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-600"
                            style={{
                              width: `${(item.count / Math.max(...stats.clicksByCountry.map((d) => d.count))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clicks by Device */}
          {stats.clicksByDevice.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  Qurilmalar bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.clicksByDevice.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.device || "Desktop"}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-purple-600"
                            style={{
                              width: `${(item.count / Math.max(...stats.clicksByDevice.map((d) => d.count))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clicks by Referrer */}
          {stats.clicksByReferrer.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-orange-600" />
                  Referrer bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.clicksByReferrer.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="truncate text-sm text-gray-600">{item.referrer || "To'g'ridan-to'g'ri"}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-orange-600"
                            style={{
                              width: `${(item.count / Math.max(...stats.clicksByReferrer.map((d) => d.count))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
