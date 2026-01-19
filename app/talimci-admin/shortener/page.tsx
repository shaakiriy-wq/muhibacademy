"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, ExternalLink, ArrowLeft, Trash2, Edit } from "lucide-react"
import Link from "next/link"

const UTM_SOURCES = [
  "Instagram",
  "Facebook",
  "Telegram",
  "TikTok",
  "YouTube",
  "Twitter",
  "LinkedIn",
  "Google",
  "Boshqa",
]

const UTM_MEDIUMS = ["Post", "Story", "Reklama", "Video", "Link", "Bio", "Kanal", "Guruh", "Boshqa"]

const LANGUAGES = ["uz", "ru", "en"]

export default function Shortener() {
  const [longUrl, setLongUrl] = useState("")
  const [utmSource, setUtmSource] = useState("instagram")
  const [utmMedium, setUtmMedium] = useState("post")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmContent, setUtmContent] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [blogger, setBlogger] = useState("")
  const [language, setLanguage] = useState("uz")
  const [targetId, setTargetId] = useState("")
  const [notes, setNotes] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [urls, setUrls] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [campaignFilter, setCampaignFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await fetch(`/api/shorten?password=talimci2026`)
      const data = await response.json()
      console.log(
        "[v0] Fetched URLs with dates:",
        data.urls?.map((u: any) => ({
          campaign: u.utm_campaign,
          created_at: u.created_at,
          hasDate: !!u.created_at,
        })),
      )
      setUrls(data.urls || [])
    } catch (error) {
      console.error("Error fetching URLs:", error)
    }
  }

  const handleSubmit = async () => {
    if (!longUrl) {
      alert("URL kiriting!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl,
          password: "talimci2026", // Password authentication
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          blogger,
          language,
          targetId,
          notes,
          ...(editingId && { id: editingId }),
        }),
      })

      const data = await res.json()

      if (data.error) {
        alert("Xatolik: " + data.error)
      } else {
        setShortUrl(data.shortUrl)
        fetchUrls()
        if (editingId) {
          setEditingId(null)
        }
      }
    } catch (err) {
      alert("Xatolik yuz berdi: " + err)
    }
    setLoading(false)
  }

  const handleEdit = (url: any) => {
    setEditingId(url.id)
    setLongUrl(url.long_url)
    setUtmSource(url.utm_source || "instagram")
    setUtmMedium(url.utm_medium || "post")
    setUtmCampaign(url.utm_campaign || "")
    setUtmContent(url.utm_content || "")
    setUtmTerm(url.utm_term || "")
    setBlogger(url.blogger || "")
    setLanguage(url.language || "uz")
    setTargetId(url.target_id || "")
    setNotes(url.notes || "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return

    try {
      await fetch("/api/shorten", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: "talimci2026" }),
      })
      fetchUrls()
    } catch (err) {
      alert("O'chirishda xatolik: " + err)
    }
  }

  const handleReset = () => {
    setEditingId(null)
    setLongUrl("")
    setUtmSource("instagram")
    setUtmMedium("post")
    setUtmCampaign("")
    setUtmContent("")
    setUtmTerm("")
    setBlogger("")
    setLanguage("uz")
    setTargetId("")
    setNotes("")
    setShortUrl("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const viewStats = (url: any) => {
    const params = new URLSearchParams({
      shortCode: url.short_code,
      source: url.utm_source || "",
      campaign: url.utm_campaign || "",
    })
    window.location.href = `/talimci-admin?${params.toString()}`
  }

  const handleCampaignClick = (campaign: string) => {
    setCampaignFilter(campaign)
    // No scroll to top - filter stays inline
  }

  const filteredUrls = urls.filter((url) => {
    let matches = true

    if (campaignFilter && campaignFilter !== "all" && url.utm_campaign !== campaignFilter) {
      matches = false
    }

    if (dateFilter) {
      const urlDate = new Date(url.created_at).toLocaleDateString("uz-UZ")
      const filterDate = new Date(dateFilter).toLocaleDateString("uz-UZ")
      if (urlDate !== filterDate) {
        matches = false
      }
    }

    return matches
  })

  console.log("[v0] Filtered URLs:", filteredUrls.length, "of", urls.length)
  console.log("[v0] Active filters:", { campaignFilter, dateFilter })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">URL Shortener</h1>
              <p className="text-sm text-gray-600">Qisqa linklar yaratish va tracking</p>
            </div>
            <Link href="/talimci-admin">
              <Button size="sm" variant="outline" className="border-gray-300 bg-white hover:bg-gray-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? "URL ni Tahrirlash" : "Yangi Short URL Yaratish"}</CardTitle>
                <CardDescription>UTM parametrlar bilan tracking linkini yarating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>URL manzil</Label>
                  <Input
                    placeholder="https://talimci.uz"
                    value={longUrl || "https://talimci.uz"}
                    onChange={(e) => setLongUrl(e.target.value)}
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500">Asl havola (automatik https://talimci.uz)</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>UTM Source (Manba) *</Label>
                    <Select value={utmSource} onValueChange={setUtmSource}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Ijtimoiy tarmoq tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {UTM_SOURCES.map((source) => (
                          <SelectItem key={source} value={source.toLowerCase()}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Traffic qayerdan kelayotgani (Instagram, Facebook, va h.k.)</p>
                  </div>

                  <div className="space-y-2">
                    <Label>UTM Medium (Tur) *</Label>
                    <Select value={utmMedium} onValueChange={setUtmMedium}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Turi tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {UTM_MEDIUMS.map((medium) => (
                          <SelectItem key={medium} value={medium.toLowerCase()}>
                            {medium}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Qanday turdagi kontent (Post, Story, Reklama, va h.k.)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>UTM Campaign (Kampaniya nomi) *</Label>
                  <Input
                    placeholder="2025_yanvar_aksiya"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500">Kampaniya nomi (masalan: 2025_yanvar_aksiya, grant_promo)</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>UTM Content (Kontent ID)</Label>
                    <Input
                      placeholder="video1, banner2"
                      value={utmContent}
                      onChange={(e) => setUtmContent(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-xs text-gray-500">Kontent identifikatori (masalan: video1, banner2)</p>
                  </div>

                  <div className="space-y-2">
                    <Label>UTM Term (Kalit so'z)</Label>
                    <Input
                      placeholder="turk, grant"
                      value={utmTerm}
                      onChange={(e) => setUtmTerm(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-xs text-gray-500">Kalit so'z yoki termo (masalan: turk, grant)</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Blogger / Influencer</Label>
                    <Input
                      placeholder="@username"
                      value={blogger}
                      onChange={(e) => setBlogger(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-xs text-gray-500">Influencer username</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Til</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Kontent tili</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Target ID</Label>
                    <Input
                      placeholder="12345"
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-xs text-gray-500">Maqsadli auditoriya ID</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Izohlar</Label>
                  <Textarea
                    placeholder="Qo'shimcha ma'lumotlar..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-gray-300"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Kampaniya haqida qo'shimcha izohlar</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? "Yuklanmoqda..." : editingId ? "Yangilash" : "Short URL Yaratish"}
                  </Button>
                  {editingId && (
                    <Button onClick={handleReset} variant="outline" className="border-gray-300 bg-transparent">
                      Bekor qilish
                    </Button>
                  )}
                </div>

                {shortUrl && (
                  <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-emerald-900">Qisqa URL tayyor!</p>
                    <div className="flex items-center gap-2">
                      <Input value={shortUrl} readOnly className="border-emerald-300 bg-white font-mono" />
                      <Button
                        onClick={() => copyToClipboard(shortUrl)}
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-emerald-300"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={() => window.open(shortUrl, "_blank")}
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-emerald-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Barcha Short URLlar</CardTitle>
                <CardDescription>Yaratilgan linklar va statistika</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Kampaniya bo'yicha filter</Label>
                    <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                      <SelectTrigger className="h-8 border-gray-300 text-sm">
                        <SelectValue placeholder="Barchasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barchasi</SelectItem>
                        {Array.from(new Set(urls.map((u) => u.utm_campaign).filter(Boolean))).map((campaign) => (
                          <SelectItem key={campaign} value={campaign}>
                            {campaign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Yaratilgan sana bo'yicha filter</Label>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="h-8 border-gray-300 text-sm"
                    />
                  </div>

                  {(campaignFilter !== "all" || dateFilter) && (
                    <Button
                      onClick={() => {
                        setCampaignFilter("all")
                        setDateFilter("")
                      }}
                      size="sm"
                      variant="outline"
                      className="h-7 w-full text-xs"
                    >
                      Filtrni tozalash
                    </Button>
                  )}
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredUrls.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      {campaignFilter !== "all" || dateFilter
                        ? "Filter bo'yicha natija topilmadi"
                        : "Hozircha linklar yo'q"}
                    </p>
                  ) : (
                    filteredUrls.map((url) => (
                      <div
                        key={url.id}
                        className="rounded-lg border border-gray-200 bg-white p-3 hover:border-emerald-300 transition-colors"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-emerald-600">/{url.short_code}</p>
                            <p className="mt-1 text-xs text-gray-500 truncate">{url.long_url}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button onClick={() => handleEdit(url)} size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(url.id)}
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {url.utm_source && (
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                              {url.utm_source}
                            </span>
                          )}
                          {url.utm_campaign && (
                            <button
                              onClick={() => handleCampaignClick(url.utm_campaign)}
                              className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer"
                            >
                              {url.utm_campaign}
                            </button>
                          )}
                          {url.created_at ? (
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                              📅{" "}
                              {new Date(url.created_at).toLocaleDateString("uz-UZ", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                              Sana mavjud emas
                            </span>
                          )}
                          {url.blogger && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                              {url.blogger}
                            </span>
                          )}
                          {url.language && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              {url.language.toUpperCase()}
                            </span>
                          )}
                          {url.target_id && (
                            <span className="rounded bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
                              ID: {url.target_id}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            Kliklar: <span className="font-semibold text-gray-900">{url.total_clicks || 0}</span>
                          </div>
                          <Button
                            onClick={() => viewStats(url)}
                            size="sm"
                            variant="outline"
                            className="h-7 border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs px-2"
                          >
                            Statistika
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
