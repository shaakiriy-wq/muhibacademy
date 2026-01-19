"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, MousePointerClick, FileText, Bot } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ShortUrlAnalyticsModalProps {
  shortCode: string | null
  onClose: () => void
}

export function ShortUrlAnalyticsModal({ shortCode, onClose }: ShortUrlAnalyticsModalProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7")

  useEffect(() => {
    if (shortCode) {
      fetchData()
    }
  }, [shortCode, timeRange])

  const fetchData = async () => {
    if (!shortCode) return

    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/shorturl-details?shortCode=${shortCode}&days=${timeRange}`)
      const result = await response.json()
      setData(result)
      console.log("[v0] Short URL Analytics Modal data:", result)
    } catch (error) {
      console.error("[v0] Failed to fetch short URL analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!shortCode) return null

  const getCountryFlag = (countryName: string) => {
    const flagMap: Record<string, string> = {
      // Central Asia
      Uzbekistan: "🇺🇿",
      "O'zbekiston": "🇺🇿",
      Kazakhstan: "🇰🇿",
      Kyrgyzstan: "🇰🇬",
      Tajikistan: "🇹🇯",
      Turkmenistan: "🇹🇲",

      // Middle East
      Turkey: "🇹🇷",
      Turkiya: "🇹🇷",
      "Saudi Arabia": "🇸🇦",
      UAE: "🇦🇪",
      Qatar: "🇶🇦",
      Kuwait: "🇰🇼",
      Bahrain: "🇧🇭",
      Oman: "🇴🇲",
      Iran: "🇮🇷",
      Iraq: "🇮🇶",
      Jordan: "🇯🇴",
      Lebanon: "🇱🇧",
      Syria: "🇸🇾",
      Yemen: "🇾🇪",
      Palestine: "🇵🇸",
      Israel: "🇮🇱",

      // Europe
      Russia: "🇷🇺",
      "United Kingdom": "🇬🇧",
      UK: "🇬🇧",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Italy: "🇮🇹",
      Spain: "🇪🇸",
      Netherlands: "🇳🇱",
      Poland: "🇵🇱",
      Ukraine: "🇺🇦",
      Romania: "🇷🇴",
      Belgium: "🇧🇪",
      Greece: "🇬🇷",
      Portugal: "🇵🇹",
      Sweden: "🇸🇪",
      Austria: "🇦🇹",
      Switzerland: "🇨🇭",
      Norway: "🇳🇴",
      Denmark: "🇩🇰",
      Finland: "🇫🇮",

      // Americas
      "United States": "🇺🇸",
      USA: "🇺🇸",
      Canada: "🇨🇦",
      Mexico: "🇲🇽",
      Brazil: "🇧🇷",
      Argentina: "🇦🇷",
      Chile: "🇨🇱",
      Colombia: "🇨🇴",
      Peru: "🇵🇪",
      Venezuela: "🇻🇪",

      // Asia
      China: "🇨🇳",
      Japan: "🇯🇵",
      "South Korea": "🇰🇷",
      India: "🇮🇳",
      Pakistan: "🇵🇰",
      Bangladesh: "🇧🇩",
      Indonesia: "🇮🇩",
      Malaysia: "🇲🇾",
      Singapore: "🇸🇬",
      Thailand: "🇹🇭",
      Vietnam: "🇻🇳",
      Philippines: "🇵🇭",

      // Africa
      Egypt: "🇪🇬",
      "South Africa": "🇿🇦",
      Nigeria: "🇳🇬",
      Kenya: "🇰🇪",
      Morocco: "🇲🇦",
      Algeria: "🇩🇿",
      Tunisia: "🇹🇳",

      // Oceania
      Australia: "🇦🇺",
      "New Zealand": "🇳🇿",

      Unknown: "🌍",
    }
    return flagMap[countryName] || "🌍"
  }

  return (
    <Dialog open={!!shortCode} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            <span>Short URL Analytics - /{shortCode}</span>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Bugun</SelectItem>
                  <SelectItem value="yesterday">Kecha</SelectItem>
                  <SelectItem value="1">1 kun</SelectItem>
                  <SelectItem value="7">7 kun</SelectItem>
                  <SelectItem value="30">30 kun</SelectItem>
                  <SelectItem value="90">90 kun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Yuklanmoqda...</div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* URL Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-500">Long URL:</span>
                    <span className="text-sm text-gray-900">{data.shortUrl.longUrl}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.shortUrl.utmSource && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        Source: {data.shortUrl.utmSource}
                      </span>
                    )}
                    {data.shortUrl.utmCampaign && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">
                        Campaign: {data.shortUrl.utmCampaign}
                      </span>
                    )}
                    {data.shortUrl.blogger && (
                      <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700">
                        Blogger: {data.shortUrl.blogger}
                      </span>
                    )}
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      Yaratildi:{" "}
                      {new Date(data.shortUrl.createdAt).toLocaleDateString("uz-UZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jami Kliklar</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.metrics.totalClicks}</div>
                  <p className="text-xs text-muted-foreground">Barcha kliklar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.metrics.uniqueVisitors}</div>
                  <p className="text-xs text-muted-foreground">Takrorlanmas foydalanuvchilar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bot Kliklar</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.metrics.totalBotClicks}</div>
                  <p className="text-xs text-muted-foreground">{data.metrics.botClickRate}% bot koeffitsienti</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lidlar</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.metrics.totalLeads}</div>
                  <p className="text-xs text-muted-foreground">{data.metrics.leadConversionRate}% konversiya</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Konversiya Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.metrics.leadConversionRate}%</div>
                  <p className="text-xs text-muted-foreground">Klik → Lid</p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Kliklar, bot va lidlar o'zgarishi</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    clicks: { label: "Kliklar", color: "hsl(var(--chart-1))" },
                    botClicks: { label: "Bot Kliklar", color: "hsl(var(--chart-2))" },
                    leads: { label: "Lidlar", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <AreaChart data={data.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                    />
                    <Area
                      type="monotone"
                      dataKey="botClicks"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                    />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stackId="3"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Services Breakdown */}
            {data.services && data.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Xizmatlar Bo'yicha</CardTitle>
                  <CardDescription>Qaysi xizmatlar ko'proq so'ralgan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.services.map((service: any) => (
                      <div key={service.service} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service.service}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                              style={{ width: `${service.percentage}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-sm font-medium">{service.count}</span>
                          <span className="w-12 text-right text-xs text-gray-500">{service.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Countries and Devices */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Davlatlar Bo'yicha</CardTitle>
                  <CardDescription>Geografik taqsimot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.countries.slice(0, 5).map((country: any) => (
                      <div key={country.country} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{getCountryFlag(country.country)}</span>
                          {country.country}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div className="h-full bg-blue-500" style={{ width: `${country.percentage}%` }} />
                          </div>
                          <span className="w-10 text-right font-medium">{country.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Qurilmalar Bo'yicha</CardTitle>
                  <CardDescription>Desktop vs Mobile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.devices.map((device: any) => (
                      <div key={device.device} className="flex items-center justify-between text-sm">
                        <span>{device.device}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div className="h-full bg-purple-500" style={{ width: `${device.percentage}%` }} />
                          </div>
                          <span className="w-10 text-right font-medium">{device.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Ma'lumot topilmadi</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
