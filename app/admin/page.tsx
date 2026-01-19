"use client"

// import type React from "react" // Removed as it's a duplicate and potentially causing linting issues.
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  RefreshCw,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Link2,
  Trash2,
  Edit,
  Plus,
  Copy,
  ChevronDown,
  ChevronRight,
  X,
  BookOpen,
  MousePointerClick,
  FileText,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Bot,
  User,
} from "lucide-react"
import Link from "next/link"

const ADMIN_PASSWORD = "muhib2026"

interface Course {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  fullDescription?: string
  price: number
  discount_price?: number | null
  duration: string
  level: string
  lessons?: string
  students?: string
  rating?: number
  reviews?: number
  videoUrl?: string
  redirect_url?: string
  male_redirect_url?: string // Added
  female_redirect_url?: string // Added
  instructor?: {
    name?: string
    image?: string
    experience?: string
    title?: string // Added
  }
  features?: string[]
  roadmap?: { week: string; title: string; description: string }[]
  testimonials?: { name: string; age: string; rating: string; text: string }[]
  is_active: boolean
  created_at: string
}

interface Registration {
  id: string
  course_slug: string
  course_title: string
  full_name: string
  phone: string
  age: number
  country: string
  level: string
  status: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at: string
}

interface ShortUrl {
  id: string
  short_code: string
  target_url: string
  clicks: number
  unique_visitors?: number // Added for enhanced table
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  blogger?: string
  language?: string
  target_id?: string
  notes?: string
  created_at: string
}

interface Overview {
  totalPageViews: number
  todayPageViews: number
  uniqueVisitors: number
  todayVisitors: number
  totalRegistrations: number
  todayRegistrations: number
  newRegistrations: number
  totalShortUrls: number
  totalShortUrlClicks: number
  conversionRate: number
  botClicks: number
  pageViewsChange: number
  visitorsChange: number
  leads: number
  leadsChange: number
  botClicksChange: number
}

interface Demographics {
  total: number
  male: number
  female: number
  ageGroups: { label: string; count: number; percentage: number }[]
}

interface Referrers {
  referrer: string
  count: number
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([])
  const [overview, setOverview] = useState<Overview>({
    totalPageViews: 0,
    todayPageViews: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
    totalRegistrations: 0,
    todayRegistrations: 0,
    newRegistrations: 0,
    totalShortUrls: 0,
    totalShortUrlClicks: 0,
    conversionRate: 0,
    botClicks: 0,
    pageViewsChange: 0,
    visitorsChange: 0,
    leads: 0,
    leadsChange: 0,
    botClicksChange: 0,
  })
  const [utmStats, setUtmStats] = useState<{ source: string; count: number }[]>([])
  const [countryStats, setCountryStats] = useState<{ country: string; count: number; percentage: number }[]>([])
  const [deviceStats, setDeviceStats] = useState<{ device: string; count: number }[]>([])
  const [courseStats, setCourseStats] = useState<{ title: string; count: number }[]>([])
  const [demographics, setDemographics] = useState<Demographics>({
    total: 0,
    male: 0,
    female: 0,
    ageGroups: [],
  })
  const [referrers, setReferrers] = useState<Referrers[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "shorturl" | "courses" | "demographics" | "referrers">(
    "dashboard",
  )

  const [selectedShortUrl, setSelectedShortUrl] = useState<string | null>(null)
  const [shortUrlDetails, setShortUrlDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const [filters, setFilters] = useState({
    dateRange: "7", // today, yesterday, 7, 14, 30, custom
    customStartDate: "",
    customEndDate: "",
    utmSource: "all",
    campaign: "all",
    country: "all",
    device: "all",
    language: "all",
  })

  // Short URL form state
  const [shortUrlForm, setShortUrlForm] = useState({
    targetUrl: "https://muhibacademy.uz",
    utm_source: "instagram",
    utm_medium: "post",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    blogger: "",
    language: "UZ",
    target_id: "",
    notes: "",
  })

  // Course form state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [courseForm, setCourseForm] = useState({
    id: "", // Added for editing existing courses
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    fullDescription: "",
    price: "",
    discount_price: "",
    duration: "",
    level: "Boshlang'ich",
    lessons: "",
    students: "0+",
    rating: "4.9",
    reviews: "0",
    videoUrl: "",
    redirect_url: "https://t.me/MuhibAcademyBot",
    male_redirect_url: "https://t.me/MuhibAcademyBot",
    female_redirect_url: "https://t.me/MuhibAcademyBot",
    instructorName: "",
    instructorImage: "",
    instructorTitle: "", // Added
    instructorExperience: "10+ yillik tajriba",
    features: [""],
    roadmap: [{ week: "", title: "", description: "" }],
    testimonials: [{ name: "", age: "", rating: "5", text: "" }],
    is_active: true,
  })

  const [uploadingImage, setUploadingImage] = React.useState(false)

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: false,
    stats: false,
    media: false,
    features: false,
    roadmap: false,
    testimonials: false,
  })

  useEffect(() => {
    const savedAuth = localStorage.getItem("muhib_admin_auth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [filters.dateRange, filters.customStartDate, filters.customEndDate])

  const loadData = async () => {
    setIsLoading(true)
    try {
      let apiUrl = `/api/analytics/overview?filter=${filters.dateRange}`
      if (filters.dateRange === "custom" && filters.customStartDate && filters.customEndDate) {
        apiUrl += `&startDate=${filters.customStartDate}&endDate=${filters.customEndDate}`
      }
      if (filters.utmSource !== "all") apiUrl += `&source=${filters.utmSource}`
      if (filters.country !== "all") apiUrl += `&country=${filters.country}`
      if (filters.device !== "all") apiUrl += `&device=${filters.device}`

      const overviewRes = await fetch(apiUrl)
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json()
        if (overviewData.success) {
          setOverview(overviewData.overview || {})
          setUtmStats(overviewData.sources || [])
          const countries = overviewData.countries || []
          const totalCountry = countries.reduce((sum: number, c: { count: number }) => sum + c.count, 0)
          const countryWithPercent = countries.map((c: { country: string; count: number }) => ({
            country: c.country,
            count: c.count,
            percentage: totalCountry > 0 ? Math.round((c.count / totalCountry) * 100) : 0,
          }))
          setCountryStats(countryWithPercent)
          setDeviceStats(overviewData.devices || [])
          setCourseStats(overviewData.courseStats || [])
          if (overviewData.shortUrls) {
            setShortUrls(overviewData.shortUrls)
          }
          if (overviewData.demographics) {
            setDemographics(overviewData.demographics)
          }
          if (overviewData.referrers) {
            setReferrers(overviewData.referrers)
          }
        }
      }

      const regRes = await fetch("/api/registrations")
      if (regRes.ok) {
        const regData = await regRes.json()
        if (regData.success) {
          setRegistrations(regData.registrations || [])
        }
      }

      const coursesRes = await fetch("/api/courses")
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        if (coursesData.success) {
          setCourses(coursesData.courses || [])
        }
      }

      const urlsRes = await fetch("/api/short-urls")
      if (urlsRes.ok) {
        const urlsData = await urlsRes.json()
        if (urlsData.success) {
          setShortUrls(urlsData.shortUrls || [])
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("muhib_admin_auth", "true")
      setError("")
      loadData()
    } else {
      setError("Noto'g'ri parol")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("muhib_admin_auth")
  }

  const exportToCSV = () => {
    const headers = ["Ism", "Telefon", "Yosh", "Darslik", "Davlat", "Daraja", "Status", "UTM Source", "Sana"]
    const rows = registrations.map((r) => [
      r.full_name,
      r.phone,
      r.age,
      r.course_title || r.course_slug,
      r.country,
      r.level,
      r.status,
      r.utm_source || "",
      new Date(r.created_at).toLocaleDateString("uz-UZ"),
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `muhib_registrations_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const handleCreateShortUrl = async () => {
    try {
      const response = await fetch("/api/short-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shortUrlForm),
      })
      const data = await response.json()
      if (data.success) {
        loadData()
        setShortUrlForm({
          targetUrl: "https://muhibacademy.uz",
          utm_source: "instagram",
          utm_medium: "post",
          utm_campaign: "",
          utm_content: "",
          utm_term: "",
          blogger: "",
          language: "UZ",
          target_id: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error creating short URL:", error)
    }
  }

  const handleDeleteShortUrl = async (id: string) => {
    if (!confirm("Bu short URL'ni o'chirishni xohlaysizmi?")) return
    try {
      const response = await fetch(`/api/short-urls?id=${id}`, { method: "DELETE" })
      if (response.ok) loadData()
    } catch (error) {
      console.error("Error deleting short URL:", error)
    }
  }

  const copyShortUrl = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${code}`)
  }

  const loadShortUrlDetails = async (shortCode: string) => {
    setLoadingDetails(true)
    setSelectedShortUrl(shortCode)
    try {
      const res = await fetch(`/api/analytics/shorturl-details?shortCode=${shortCode}&days=${filters.dateRange}`)
      const data = await res.json()
      setShortUrlDetails(data)
    } catch (error) {
      console.error("[v0] Failed to load short URL details:", error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleSaveCourse = async () => {
    try {
      const courseData = {
        id: editingCourse ? editingCourse.id : undefined, // Include ID if editing
        slug: courseForm.slug || courseForm.title.toLowerCase().replace(/\s+/g, "-"),
        title: courseForm.title,
        subtitle: courseForm.subtitle,
        description: courseForm.description,
        fullDescription: courseForm.fullDescription,
        price: Number(courseForm.price),
        discount_price: courseForm.discount_price ? Number(courseForm.discount_price) : null,
        duration: courseForm.duration,
        level: courseForm.level,
        lessons: courseForm.lessons,
        students: courseForm.students,
        rating: Number(courseForm.rating),
        reviews: Number(courseForm.reviews),
        videoUrl: courseForm.videoUrl,
        redirect_url: courseForm.redirect_url || "https://t.me/MuhibAcademyBot",
        // Add gender-based redirect URLs
        male_redirect_url: courseForm.male_redirect_url || "https://t.me/MuhibAcademyBot",
        female_redirect_url: courseForm.female_redirect_url || "https://t.me/MuhibAcademyBot",
        instructor: {
          name: courseForm.instructorName,
          image: courseForm.instructorImage,
          experience: courseForm.instructorExperience,
          title: courseForm.instructorTitle, // Added
        },
        features: courseForm.features.filter((f) => f.trim()),
        roadmap: courseForm.roadmap.filter((r) => r.title.trim()),
        testimonials: courseForm.testimonials.filter((t) => t.text.trim()),
        is_active: courseForm.is_active,
      }

      const response = await fetch("/api/courses", {
        method: editingCourse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      })

      const data = await response.json()
      if (data.success) {
        loadData()
        resetCourseForm()
      } else {
        alert("Xatolik: " + data.error)
      }
    } catch (error) {
      console.error("Error saving course:", error)
      alert("Xatolik yuz berdi")
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setIsAddingCourse(true)
    setCourseForm({
      id: course.id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description,
      fullDescription: course.fullDescription || "",
      price: String(course.price),
      discount_price: course.discount_price ? String(course.discount_price) : "",
      duration: course.duration,
      level: course.level,
      lessons: course.lessons || "",
      students: course.students || "0+",
      rating: String(course.rating || "4.9"),
      reviews: String(course.reviews || "0"),
      videoUrl: course.videoUrl || "",
      redirect_url: course.redirect_url || "https://t.me/MuhibAcademyBot",
      // Populate gender-based redirect URLs
      male_redirect_url: course.male_redirect_url || "https://t.me/MuhibAcademyBot",
      female_redirect_url: course.female_redirect_url || "https://t.me/MuhibAcademyBot",
      instructorName: course.instructor?.name || "",
      instructorImage: course.instructor?.image || "/islamic-scholar-beard-1.jpg",
      instructorTitle: course.instructor?.title || "", // Added
      instructorExperience: course.instructor?.experience || "",
      features: course.features?.length ? course.features : [""],
      roadmap: course.roadmap?.length ? course.roadmap : [{ week: "", title: "", description: "" }],
      testimonials: course.testimonials?.length ? course.testimonials : [{ name: "", age: "", rating: "5", text: "" }],
      is_active: course.is_active,
    })
  }

  const handleDeleteCourse = async (id: string) => {
    if (id.startsWith("fallback-")) {
      alert("Bu demo darslik. O'chirish uchun avval yangi darslik qo'shing.")
      return
    }
    if (!confirm("Bu darslikni o'chirishni xohlaysizmi?")) return
    try {
      const response = await fetch(`/api/courses?id=${id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        loadData()
      } else {
        alert("Xatolik: " + data.error)
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Xatolik yuz berdi")
    }
  }

  const resetCourseForm = () => {
    setEditingCourse(null)
    setIsAddingCourse(false)
    setCourseForm({
      id: "",
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      fullDescription: "",
      price: "",
      discount_price: "",
      duration: "",
      level: "Boshlang'ich",
      lessons: "",
      students: "0+",
      rating: "4.9",
      reviews: "0",
      videoUrl: "",
      redirect_url: "https://t.me/MuhibAcademyBot",
      male_redirect_url: "https://t.me/MuhibAcademyBot",
      female_redirect_url: "https://t.me/MuhibAcademyBot",
      instructorName: "",
      instructorImage: "",
      instructorTitle: "",
      instructorExperience: "10+ yillik tajriba",
      features: [""],
      roadmap: [{ week: "", title: "", description: "" }],
      testimonials: [{ name: "", age: "", rating: "5", text: "" }],
      is_active: true,
    })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const getFilterLabel = () => {
    switch (filters.dateRange) {
      case "today":
        return "Bugun"
      case "yesterday":
        return "Kecha"
      case "7":
        return "Oxirgi 7 kun"
      case "14":
        return "Oxirgi 14 kun"
      case "30":
        return "Oxirgi 30 kun"
      case "custom":
        return `${filters.customStartDate} - ${filters.customEndDate}`
      default:
        return "Oxirgi 7 kun"
    }
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-emerald-700">Muhib Academy</CardTitle>
            <CardDescription>Admin paneliga kirish</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Parolni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Kirish
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-emerald-700">
              Muhib Academy
            </Link>
            <span className="text-sm text-gray-500">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Yangilash
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-4 overflow-x-auto">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
            className={activeTab === "dashboard" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "shorturl" ? "default" : "outline"}
            onClick={() => setActiveTab("shorturl")}
            className={activeTab === "shorturl" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Short URL
          </Button>
          <Button
            variant={activeTab === "courses" ? "default" : "outline"}
            onClick={() => setActiveTab("courses")}
            className={activeTab === "courses" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Darsliklar
          </Button>
          <Button
            variant={activeTab === "demographics" ? "default" : "outline"}
            onClick={() => setActiveTab("demographics")}
            className={activeTab === "demographics" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <User className="h-4 w-4 mr-2" />
            Demografiya
          </Button>
          <Button
            variant={activeTab === "referrers" ? "default" : "outline"}
            onClick={() => setActiveTab("referrers")}
            className={activeTab === "referrers" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <Globe className="h-4 w-4 mr-2" />
            Manbalar
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Vaqt:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "today", label: "Bugun" },
                  { value: "yesterday", label: "Kecha" },
                  { value: "7", label: "7 kun" },
                  { value: "14", label: "14 kun" },
                  { value: "30", label: "30 kun" },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={filters.dateRange === opt.value ? "default" : "outline"}
                    onClick={() => setFilters((f) => ({ ...f, dateRange: opt.value }))}
                    className={filters.dateRange === opt.value ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  >
                    {opt.label}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant={filters.dateRange === "custom" ? "default" : "outline"}
                  onClick={() => setFilters((f) => ({ ...f, dateRange: "custom" }))}
                  className={filters.dateRange === "custom" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Diapazon
                </Button>
              </div>
              {filters.dateRange === "custom" && (
                <div className="flex gap-2 items-center">
                  <Input
                    type="date"
                    value={filters.customStartDate}
                    onChange={(e) => setFilters((f) => ({ ...f, customStartDate: e.target.value }))}
                    className="w-36 h-8"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="date"
                    value={filters.customEndDate}
                    onChange={(e) => setFilters((f) => ({ ...f, customEndDate: e.target.value }))}
                    className="w-36 h-8"
                  />
                </div>
              )}
              <div className="ml-auto">
                <Button size="sm" variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-1" />
                  CSV Export
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">Tashrif</span>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{overview.uniqueVisitors}</div>
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    {overview.visitorsChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {overview.visitorsChange >= 0 ? "+" : ""}
                    {overview.visitorsChange}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-emerald-700">Sahifa Ko'rish</span>
                    <Eye className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">{overview.totalPageViews}</div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1">
                    {overview.pageViewsChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {overview.pageViewsChange >= 0 ? "+" : ""}
                    {overview.pageViewsChange}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-700">Lidlar</span>
                    <FileText className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{overview.leads}</div>
                  <div className="text-xs text-orange-600 flex items-center gap-1">
                    {overview.leadsChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {overview.leadsChange >= 0 ? "+" : ""}
                    {overview.leadsChange}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700">Botga O'tish</span>
                    <Bot className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{overview.botClicks}</div>
                  <div className="text-xs text-purple-600 flex items-center gap-1">
                    {overview.botClicksChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {overview.botClicksChange >= 0 ? "+" : ""}
                    {overview.botClicksChange}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-700">Short URL</span>
                    <Link2 className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-900">{overview.totalShortUrls}</div>
                  <div className="text-xs text-cyan-600">Yangi: {overview.todayVisitors}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-pink-700">URL Kliklar</span>
                    <MousePointerClick className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="text-2xl font-bold text-pink-900">{overview.totalShortUrlClicks}</div>
                  <div className="text-xs text-pink-600">
                    O'rtacha:{" "}
                    {overview.totalShortUrls > 0
                      ? Math.round(overview.totalShortUrlClicks / overview.totalShortUrls)
                      : 0}{" "}
                    / link
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Countries and UTM Sources */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Davlatlar bo'yicha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {countryStats.length > 0 ? (
                      countryStats.map((c, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-24 text-sm truncate">{c.country}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${c.percentage}%` }} />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{c.count}</span>
                          <span className="text-xs text-gray-500 w-10">{c.percentage}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Ma'lumot yo'q</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Qurilmalar bo'yicha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deviceStats.length > 0 ? (
                      deviceStats.map((d, i) => {
                        const totalDevices = deviceStats.reduce((sum, item) => sum + item.count, 0)
                        const percentage = totalDevices > 0 ? Math.round((d.count / totalDevices) * 100) : 0
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8">
                              {d.device === "mobile" ? (
                                <Smartphone className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Monitor className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <span className="w-20 text-sm capitalize">{d.device}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{d.count}</span>
                            <span className="text-xs text-gray-500 w-10">{percentage}%</span>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">Ma'lumot yo'q</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* UTM Sources and Top Short URLs */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UTM Manbalar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {utmStats.length > 0 ? (
                      utmStats.slice(0, 8).map((s, i) => {
                        const total = utmStats.reduce((sum, item) => sum + item.count, 0)
                        const percentage = total > 0 ? Math.round((s.count / total) * 100) : 0
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-24 text-sm truncate">{s.source}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm font-medium">{s.count}</span>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">Ma'lumot yo'q</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Darsliklar bo'yicha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courseStats.length > 0 ? (
                      courseStats.map((c, i) => {
                        const total = courseStats.reduce((sum, item) => sum + item.count, 0)
                        const percentage = total > 0 ? Math.round((c.count / total) * 100) : 0
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="flex-1 text-sm truncate">{c.title}</span>
                            <div className="w-24 bg-gray-100 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm font-medium w-8 text-right">{c.count}</span>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">Ma'lumot yo'q</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Short URLs Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eng Ko'p Bosilgan Short URLlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Short Code</th>
                        <th className="text-left p-2">UTM Source</th>
                        <th className="text-left p-2">Campaign</th>
                        <th className="text-left p-2">Blogger</th>
                        <th className="text-left p-2">Yaratilgan</th>
                        <th className="text-right p-2">Kliklar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortUrls.slice(0, 10).map((url) => (
                        <tr key={url.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-mono">
                              /{url.short_code}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                              {url.utm_source || "-"}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                              {url.utm_campaign || "-"}
                            </span>
                          </td>
                          <td className="p-2 text-gray-600">{url.blogger || "-"}</td>
                          <td className="p-2 text-gray-500">{new Date(url.created_at).toLocaleDateString("uz-UZ")}</td>
                          <td className="p-2 text-right font-bold text-emerald-600">{url.clicks}</td>
                        </tr>
                      ))}
                      {shortUrls.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            Short URL mavjud emas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Short URL Tab */}
        {activeTab === "shorturl" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Short URL Statistika</CardTitle>
                <CardDescription>Barcha linklar va to'liq analitika</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold">Kod</th>
                        <th className="text-left p-3 font-semibold">Sana</th>
                        <th className="text-right p-3 font-semibold">Kliklar</th>
                        <th className="text-right p-3 font-semibold">Visitors</th>
                        <th className="text-right p-3 font-semibold">Lidlar</th>
                        <th className="text-right p-3 font-semibold">Bot O'tish</th>
                        <th className="text-center p-3 font-semibold">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortUrls.map((url) => {
                        const leads = 0 // Will be calculated from analytics
                        const botClicks = 0 // Will be calculated from analytics
                        return (
                          <tr key={url.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3">
                              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-xs font-mono font-semibold">
                                /{url.short_code}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600">
                              {new Date(url.created_at).toLocaleDateString("uz-UZ")}
                            </td>
                            <td className="p-3 text-right font-bold text-gray-900">{url.clicks || 0}</td>
                            <td className="p-3 text-right font-medium text-blue-600">{url.unique_visitors || 0}</td>
                            <td className="p-3 text-right font-medium text-orange-600">{leads}</td>
                            <td className="p-3 text-right font-medium text-purple-600">{botClicks}</td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadShortUrlDetails(url.short_code)}
                                  className="hover:bg-emerald-50"
                                >
                                  <BarChart3 className="h-4 w-4 mr-1" />
                                  Statistika
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => copyShortUrl(url.short_code)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {shortUrls.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            Short URL mavjud emas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Create Short URL Form */}
            <Card>
              <CardHeader>
                <CardTitle>Yangi Short URL Yaratish</CardTitle>
                <CardDescription>UTM parametrlar bilan tracking link yarating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">URL manzil</label>
                  <Input
                    value={shortUrlForm.targetUrl}
                    onChange={(e) => setShortUrlForm((f) => ({ ...f, targetUrl: e.target.value }))}
                    placeholder="https://muhibacademy.uz"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">UTM Source *</label>
                    <select
                      value={shortUrlForm.utm_source}
                      onChange={(e) => setShortUrlForm((f) => ({ ...f, utm_source: e.target.value }))}
                      className="w-full border rounded-md h-10 px-3"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="telegram">Telegram</option>
                      <option value="facebook">Facebook</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="google">Google</option>
                      <option value="boshqa">Boshqa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">UTM Medium *</label>
                    <select
                      value={shortUrlForm.utm_medium}
                      onChange={(e) => setShortUrlForm((f) => ({ ...f, utm_medium: e.target.value }))}
                      className="w-full border rounded-md h-10 px-3"
                    >
                      <option value="post">Post</option>
                      <option value="story">Story</option>
                      <option value="bio">Bio</option>
                      <option value="reklama">Reklama</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">UTM Campaign *</label>
                  <Input
                    value={shortUrlForm.utm_campaign}
                    onChange={(e) => setShortUrlForm((f) => ({ ...f, utm_campaign: e.target.value }))}
                    placeholder="2025_yanvar_aksiya"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Blogger / Influencer</label>
                    <Input
                      value={shortUrlForm.blogger}
                      onChange={(e) => setShortUrlForm((f) => ({ ...f, blogger: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Til</label>
                    <select
                      value={shortUrlForm.language}
                      onChange={(e) => setShortUrlForm((f) => ({ ...f, language: e.target.value }))}
                      className="w-full border rounded-md h-10 px-3"
                    >
                      <option value="UZ">O'zbek</option>
                      <option value="RU">Rus</option>
                      <option value="EN">Ingliz</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Izohlar</label>
                  <Textarea
                    value={shortUrlForm.notes}
                    onChange={(e) => setShortUrlForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Qo'shimcha ma'lumotlar..."
                    rows={2}
                  />
                </div>
                <Button onClick={handleCreateShortUrl} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Short URL Yaratish
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            {!isAddingCourse ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Darsliklar</h2>
                  <Button onClick={() => setIsAddingCourse(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi Darslik
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>{course.subtitle}</CardDescription>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs ${course.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {course.is_active ? "Faol" : "Nofaol"}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Narxi:</span>
                            <span className="font-medium">
                              {course.discount_price ? (
                                <>
                                  <span className="line-through text-gray-400 mr-2">
                                    {course.price?.toLocaleString()}
                                  </span>
                                  {course.discount_price?.toLocaleString()} so'm
                                </>
                              ) : (
                                `${course.price?.toLocaleString()} so'm`
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Davomiylik:</span>
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>O'quvchilar:</span>
                            <span>{course.students}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Redirect:</span>
                            <span className="truncate max-w-[150px] text-xs">{course.redirect_url || "Default"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Tahrirlash
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingCourse ? "Darslikni Tahrirlash" : "Yangi Darslik Qo'shish"}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetCourseForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info Section */}
                  <div className="border rounded-lg p-4 cursor-pointer" onClick={() => toggleSection("basic")}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Asosiy ma'lumotlar</h3>
                      {expandedSections.basic ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                    {expandedSections.basic && (
                      <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Sarlavha *</label>
                            <Input
                              value={courseForm.title}
                              onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
                              placeholder="Qur'on o'qish"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Slug</label>
                            <Input
                              value={courseForm.slug}
                              onChange={(e) => setCourseForm((f) => ({ ...f, slug: e.target.value }))}
                              placeholder="quron-oqish"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Subtitle</label>
                          <Input
                            value={courseForm.subtitle}
                            onChange={(e) => setCourseForm((f) => ({ ...f, subtitle: e.target.value }))}
                            placeholder="2 oyda Qur'on o'qishni 0 dan o'rganing"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Qisqa tavsif *</label>
                          <Textarea
                            value={courseForm.description}
                            onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Qur'on o'qishni professional ustozlar bilan o'rganing. 3 ta dars BEPUL!"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">To'liq tavsif</label>
                          <Textarea
                            value={courseForm.fullDescription}
                            onChange={(e) => setCourseForm((f) => ({ ...f, fullDescription: e.target.value }))}
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-600">Erkaklar uchun Redirect URL</label>
                          <Input
                            value={courseForm.male_redirect_url}
                            onChange={(e) => setCourseForm((f) => ({ ...f, male_redirect_url: e.target.value }))}
                            placeholder="https://t.me/MuhibAcademyBot"
                          />
                          <p className="text-xs text-gray-500 mt-1">Erkak foydalanuvchilar shu linkga yo'naltiriladi</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-pink-600">Ayollar uchun Redirect URL</label>
                          <Input
                            value={courseForm.female_redirect_url}
                            onChange={(e) => setCourseForm((f) => ({ ...f, female_redirect_url: e.target.value }))}
                            placeholder="https://t.me/MuhibAcademyBot"
                          />
                          <p className="text-xs text-gray-500 mt-1">Ayol foydalanuvchilar shu linkga yo'naltiriladi</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={courseForm.is_active}
                            onChange={(e) => setCourseForm((f) => ({ ...f, is_active: e.target.checked }))}
                            className="rounded"
                          />
                          <label className="text-sm">Faol</label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing Section */}
                  <div className="border rounded-lg p-4 cursor-pointer" onClick={() => toggleSection("pricing")}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Narx va davomiylik</h3>
                      {expandedSections.pricing ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                    {expandedSections.pricing && (
                      <div className="mt-4 grid md:grid-cols-3 gap-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <label className="text-sm font-medium">Narxi (so'm) *</label>
                          <Input
                            type="number"
                            value={courseForm.price}
                            onChange={(e) => setCourseForm((f) => ({ ...f, price: e.target.value }))}
                            placeholder="500000"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Chegirma narxi</label>
                          <Input
                            type="number"
                            value={courseForm.discount_price}
                            onChange={(e) => setCourseForm((f) => ({ ...f, discount_price: e.target.value }))}
                            placeholder="350000"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Davomiylik *</label>
                          <Input
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm((f) => ({ ...f, duration: e.target.value }))}
                            placeholder="2 oy"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Daraja</label>
                          <select
                            value={courseForm.level}
                            onChange={(e) => setCourseForm((f) => ({ ...f, level: e.target.value }))}
                            className="w-full border rounded-md h-10 px-3"
                          >
                            <option value="Boshlang'ich">Boshlang'ich</option>
                            <option value="O'rta">O'rta</option>
                            <option value="Yuqori">Yuqori</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Darslar soni</label>
                          <Input
                            value={courseForm.lessons}
                            onChange={(e) => setCourseForm((f) => ({ ...f, lessons: e.target.value }))}
                            placeholder="48 ta dars"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Media Section */}
                  <div className="border rounded-lg p-4 cursor-pointer" onClick={() => toggleSection("media")}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Video va ustoz</h3>
                      {expandedSections.media ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                    {expandedSections.media && (
                      <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <label className="text-sm font-medium">YouTube video URL</label>
                          <Input
                            value={courseForm.videoUrl}
                            onChange={(e) => setCourseForm((f) => ({ ...f, videoUrl: e.target.value }))}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">Ustoz ismi</label>
                            <Input
                              value={courseForm.instructorName}
                              onChange={(e) => setCourseForm((f) => ({ ...f, instructorName: e.target.value }))}
                              placeholder="Shayx Muhammad Ali"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ustoz tajribasi</label>
                            <Input
                              value={courseForm.instructorExperience}
                              onChange={(e) => setCourseForm((f) => ({ ...f, instructorExperience: e.target.value }))}
                              placeholder="10+ yillik tajriba"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ustoz lavozimi</label>
                            <Input
                              value={courseForm.instructorTitle}
                              onChange={(e) => setCourseForm((f) => ({ ...f, instructorTitle: e.target.value }))}
                              placeholder="Qori"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ustoz rasmi</label>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    setUploadingImage(true)
                                    try {
                                      const formData = new FormData()
                                      formData.append("file", file)

                                      const res = await fetch("/api/upload-instructor-image", {
                                        method: "POST",
                                        body: formData,
                                      })

                                      if (!res.ok) throw new Error("Upload failed")

                                      const data = await res.json()
                                      setCourseForm((f) => ({ ...f, instructorImage: data.url }))
                                    } catch (error) {
                                      console.error("Upload error:", error)
                                      alert("Rasm yuklashda xatolik")
                                    } finally {
                                      setUploadingImage(false)
                                    }
                                  }}
                                  disabled={uploadingImage}
                                  className="flex-1"
                                />
                              </div>
                              {uploadingImage && <p className="text-xs text-gray-500">Yuklanmoqda...</p>}
                              {courseForm.instructorImage && (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={courseForm.instructorImage || "/placeholder.svg"}
                                    alt="Ustoz"
                                    className="h-12 w-12 rounded-full object-cover"
                                  />
                                  <button
                                    onClick={() => setCourseForm((f) => ({ ...f, instructorImage: "" }))}
                                    className="text-xs text-red-600 hover:underline"
                                  >
                                    O'chirish
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features Section */}
                  <div className="border rounded-lg p-4 cursor-pointer" onClick={() => toggleSection("features")}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Xususiyatlar</h3>
                      {expandedSections.features ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                    {expandedSections.features && (
                      <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                        {courseForm.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...courseForm.features]
                                newFeatures[index] = e.target.value
                                setCourseForm((f) => ({ ...f, features: newFeatures }))
                              }}
                              placeholder="24 ta video dars"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newFeatures = courseForm.features.filter((_, i) => i !== index)
                                setCourseForm((f) => ({ ...f, features: newFeatures.length ? newFeatures : [""] }))
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCourseForm((f) => ({ ...f, features: [...f.features, ""] }))}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Qo'shish
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Save Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveCourse} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      {editingCourse ? "Saqlash" : "Yaratish"}
                    </Button>
                    <Button variant="outline" onClick={resetCourseForm}>
                      Bekor qilish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Demographics Tab */}
        {activeTab === "demographics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Jins bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-40 h-40 relative">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray={`${(demographics.female / demographics.total) * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                        transform="rotate(-90 100 100)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {demographics.female}{" "}
                      <span className="text-xs font-normal">
                        {" "}
                        ({((demographics.female / demographics.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full text-sm">
                    <span>Ayol</span>
                    <span>Erkak</span>
                  </div>
                  <div className="flex justify-around w-full text-sm">
                    <span>{demographics.female} ta</span>
                    <span>{demographics.male} ta</span>
                  </div>
                  <p className="text-center text-gray-500 text-sm">Jami: {demographics.total} ta</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Yosh guruhlari bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.ageGroups.length > 0 ? (
                    demographics.ageGroups.map((group, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-24 text-sm truncate">{group.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${group.percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{group.count}</span>
                        <span className="text-xs text-gray-500">{group.percentage.toFixed(1)}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Ma'lumot yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Referrers Tab */}
        {activeTab === "referrers" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Eng ko'p tashrif buyurgan saytlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrers.length > 0 ? (
                    referrers.slice(0, 10).map((r, i) => {
                      const total = referrers.reduce((sum, item) => sum + item.count, 0)
                      const percentage = total > 0 ? Math.round((r.count / total) * 100) : 0
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-48 text-sm truncate">{r.referrer || "Direct/Unknown"}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{r.count}</span>
                          <span className="text-xs text-gray-500">{percentage}%</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">Ma'lumot yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {selectedShortUrl && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedShortUrl(null)}
        >
          <div
            className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingDetails ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : shortUrlDetails ? (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">/{selectedShortUrl}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {shortUrlDetails.shortUrl?.utmSource} • {shortUrlDetails.shortUrl?.utmCampaign}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedShortUrl(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-sm text-blue-700 mb-1">Kliklar</div>
                      <div className="text-3xl font-bold text-blue-900">{shortUrlDetails.metrics.totalClicks}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <CardContent className="p-4">
                      <div className="text-sm text-emerald-700 mb-1">Visitors</div>
                      <div className="text-3xl font-bold text-emerald-900">
                        {shortUrlDetails.metrics.uniqueVisitors}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-sm text-orange-700 mb-1">Lidlar</div>
                      <div className="text-3xl font-bold text-orange-900">{shortUrlDetails.metrics.totalLeads}</div>
                      <div className="text-xs text-orange-600 mt-1">{shortUrlDetails.metrics.leadConversionRate}%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="text-sm text-purple-700 mb-1">Bot O'tish</div>
                      <div className="text-3xl font-bold text-purple-900">{shortUrlDetails.metrics.totalBotClicks}</div>
                      <div className="text-xs text-purple-600 mt-1">{shortUrlDetails.metrics.botClickRate}%</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Countries, Demographics, Age */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Countries */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Davlatlar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {shortUrlDetails.countries.map((c: any, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-20 text-sm truncate">{c.country}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${c.percentage}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Demographics (gender) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Jins
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder for demographics, actual data not provided in the update */}
                      <div className="text-sm text-gray-500">Ma'lumot yuklanmoqda...</div>
                    </CardContent>
                  </Card>

                  {/* Age groups */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Yosh
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder for age groups, actual data not provided in the update */}
                      <div className="text-sm text-gray-500">Ma'lumot yuklanmoqda...</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Devices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Qurilmalar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {shortUrlDetails.devices.map((d: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <span className="w-20 text-sm">{d.device}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${d.percentage}%` }} />
                          </div>
                          <span className="text-sm font-medium">{d.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
