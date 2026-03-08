"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { track } from "@vercel/analytics"

// Icon component for Material Symbols
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
      {name}
    </span>
  )
}

const countriesWithCodes = [
  { code: "UZ", name: "O'zbekiston", flag: "🇺🇿", phoneCode: "+998" },
  { code: "US", name: "AQSH", flag: "🇺🇸", phoneCode: "+1" },
  { code: "RU", name: "Rossiya", flag: "🇷🇺", phoneCode: "+7" },
  { code: "TR", name: "Turkiya", flag: "🇹🇷", phoneCode: "+90" },
  { code: "KZ", name: "Qozog'iston", flag: "🇰🇿", phoneCode: "+7" },
  { code: "GB", name: "Buyuk Britaniya", flag: "🇬🇧", phoneCode: "+44" },
  { code: "DE", name: "Germaniya", flag: "🇩🇪", phoneCode: "+49" },
  { code: "FR", name: "Fransiya", flag: "🇫🇷", phoneCode: "+33" },
  { code: "SA", name: "Saudiya Arabistoni", flag: "🇸🇦", phoneCode: "+966" },
  { code: "AE", name: "BAA", flag: "🇦🇪", phoneCode: "+971" },
  { code: "KG", name: "Qirg'iziston", flag: "🇰🇬", phoneCode: "+996" },
  { code: "TJ", name: "Tojikiston", flag: "🇹🇯", phoneCode: "+992" },
  { code: "TM", name: "Turkmaniston", flag: "🇹🇲", phoneCode: "+993" },
  { code: "IN", name: "Hindiston", flag: "🇮🇳", phoneCode: "+91" },
  { code: "PK", name: "Pokiston", flag: "🇵🇰", phoneCode: "+92" },
  { code: "AF", name: "Afg'oniston", flag: "🇦🇫", phoneCode: "+93" },
  { code: "CN", name: "Xitoy", flag: "🇨🇳", phoneCode: "+86" },
  { code: "JP", name: "Yaponiya", flag: "🇯🇵", phoneCode: "+81" },
  { code: "KR", name: "Janubiy Koreya", flag: "🇰🇷", phoneCode: "+82" },
  { code: "IT", name: "Italiya", flag: "🇮🇹", phoneCode: "+39" },
  { code: "ES", name: "Ispaniya", flag: "🇪🇸", phoneCode: "+34" },
  { code: "CA", name: "Kanada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "AU", name: "Avstraliya", flag: "🇦🇺", phoneCode: "+61" },
  { code: "BR", name: "Braziliya", flag: "🇧🇷", phoneCode: "+55" },
  { code: "EG", name: "Misr", flag: "🇪🇬", phoneCode: "+20" },
  { code: "MY", name: "Malayziya", flag: "🇲🇾", phoneCode: "+60" },
  { code: "ID", name: "Indoneziya", flag: "🇮🇩", phoneCode: "+62" },
  { code: "AZ", name: "Ozarbayjon", flag: "🇦🇿", phoneCode: "+994" },
]

const faqs = [
  {
    question: "Darslar qanday formatda o'tiladi?",
    answer:
      "Barcha darslar jonli Zoom orqali o'tiladi. Darslar video formatda saqlanib, istalgan vaqt qayta ko'rishingiz mumkin.",
  },
  {
    question: "Birinchi 3 ta dars haqiqatan ham bepulmi?",
    answer:
      "Ha, birinchi 3 ta dars to'liq bepul! Siz kursni sinab ko'rib, ustozlar bilan tanishib olishingiz mumkin. Faqat shundan keyin to'lov qilasiz.",
  },
  {
    question: "Sertifikat beriladimi?",
    answer: "Ha, kursni muvaffaqiyatli tugatganingizdan keyin rasmiy sertifikat beriladi.",
  },
  {
    question: "To'lovni qanday amalga oshiraman?",
    answer: "To'lovni Click, Payme, bank o'tkazmasi yoki naqd pul orqali amalga oshirishingiz mumkin.",
  },
]

const phoneNumberLengths: Record<string, number> = {
  UZ: 9, US: 10, RU: 10, TR: 10, KZ: 10, GB: 10, DE: 10, FR: 9, SA: 9, AE: 9, KG: 9, TJ: 9, TM: 8,
  IN: 10, PK: 10, AF: 9, CN: 11, JP: 10, KR: 10, IT: 10, ES: 9, CA: 10, AU: 9, BR: 11, EG: 10, MY: 10, ID: 10, AZ: 9,
}

const getPhoneLength = (countryCode: string): number => phoneNumberLengths[countryCode] || 9

export default function DarsliklarPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [courses, setCourses] = useState<any[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    country: "",
    level: "",
    contactMethod: "",
    whatsapp: "",
    telegram: "",
    phoneCountry: "UZ",
    whatsappCountry: "UZ",
    hasWhatsApp: true,
  })

  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] = useState(false)
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("")
  const [showWhatsAppCountryDropdown, setShowWhatsAppCountryDropdown] = useState(false)
  const [whatsappCountrySearch, setWhatsappCountrySearch] = useState("")

  const selectedCourseData = courses.find((c) => c.slug === selectedCourse) || null

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("/api/courses")
        const data = await response.json()
        if (data.success && Array.isArray(data.courses)) {
          const activeCourses = data.courses.filter((c: any) => c.is_active !== false)
          setCourses(activeCourses)
        }
      } catch (error) {
        console.error("Error loading courses:", error)
      } finally {
        setIsLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [selectedCourse])

  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        if (redirectCountdown === 1) {
          const redirectUrl =
            formData.gender === "56"
              ? selectedCourseData?.female_redirect_url || selectedCourseData?.redirect_url || "https://t.me/MuhibAcademyBot"
              : selectedCourseData?.male_redirect_url || selectedCourseData?.redirect_url || "https://t.me/MuhibAcademyBot"

          track("bot_click", {
            course: selectedCourseData?.title || "Unknown",
            gender: formData.gender,
            age: formData.age,
            redirect_url: redirectUrl,
          })

          fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_type: "bot_click",
              page_url: window.location.href,
              page_title: `Bot Redirect - ${selectedCourseData?.title || "Course"}`,
              referrer: document.referrer,
              utm_source: new URLSearchParams(window.location.search).get("utm_source"),
              utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
              utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
              short_code: new URLSearchParams(window.location.search).get("su"),
              session_id: localStorage.getItem("session_id"),
              course_slug: selectedCourseData?.slug,
              course_title: selectedCourseData?.title,
              gender: formData.gender,
              age: formData.age ? Number.parseInt(formData.age) : undefined,
            }),
          }).catch(console.error)

          setTimeout(() => {
            window.location.href = redirectUrl
          }, 100)
        } else {
          setRedirectCountdown(redirectCountdown - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [redirectCountdown, selectedCourseData, formData.gender, formData.age])

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ""
    if (url.includes("youtube.com/embed/")) return url
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Ismingizni kiriting"
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon raqamingizni kiriting"
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "")
      const expectedLength = getPhoneLength(formData.phoneCountry)
      if (phoneDigits.length !== expectedLength) {
        const selectedCountry = countriesWithCodes.find((c) => c.code === formData.phoneCountry)
        newErrors.phone = `${selectedCountry?.name} uchun ${expectedLength} ta raqam kiriting`
      }
    }
    if (!formData.age.trim()) newErrors.age = "Yoshingizni kiriting"
    if (!formData.gender) newErrors.gender = "Jinsingizni tanlang"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.country.trim()) newErrors.country = "Davlatni tanlang"
    if (!formData.level.trim()) newErrors.level = "Darajangizni tanlang"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.contactMethod) newErrors.contactMethod = "Bog'lanish usulini tanlang"
    if (formData.hasWhatsApp && !formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp raqamini kiriting"
    }
    if (!formData.telegram.trim()) {
      newErrors.telegram = "Telegram username kiriting"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setFormData((prev) => ({ ...prev, phone: value }))
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setFormData((prev) => ({ ...prev, whatsapp: value }))
    if (errors.whatsapp) {
      setErrors((prev) => ({ ...prev, whatsapp: "" }))
    }
  }

  const handleNextStep = () => {
    if (formStep === 1 && validateStep1()) setFormStep(2)
    else if (formStep === 2 && validateStep2()) setFormStep(3)
  }

  const handlePrevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1)
      setErrors({})
    }
  }

  const copyPhoneToWhatsApp = () => {
    const selectedCountry = countriesWithCodes.find((c) => c.code === formData.phoneCountry)
    setFormData((prev) => ({
      ...prev,
      whatsapp: prev.phone,
      whatsappCountry: prev.phoneCountry,
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return
    setIsSubmitting(true)
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const shortCode = urlParams.get("su") || urlParams.get("short") || urlParams.get("src") || ""
      const selectedCountry = countriesWithCodes.find((c) => c.code === formData.phoneCountry)
      const fullPhone = `${selectedCountry?.phoneCode || "+998"}${formData.phone}`
      let whatsappFull = ""
      if (formData.hasWhatsApp && formData.whatsapp) {
        const whatsappCountry = countriesWithCodes.find((c) => c.code === formData.whatsappCountry)
        whatsappFull = `${whatsappCountry?.phoneCode || "+998"}${formData.whatsapp}`
      }

      const response = await fetch("/api/bitrix-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          whatsapp: whatsappFull,
          course: selectedCourseData?.title,
          courseId: selectedCourse,
          shortCode,
        }),
      })

      const data = await response.json()
      if (data.success) {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          ;(window as any).fbq('track', 'Lead', {
            content_name: selectedCourseData?.title || 'Course Registration',
            content_category: 'Education',
          })
        }

        track("lead_generated", {
          course: selectedCourseData?.title || "Unknown",
          gender: formData.gender,
          age: formData.age,
          utm_source: urlParams.get("utm_source") || "direct",
          short_code: shortCode || "none",
        })

        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "lead_generated",
            page_url: window.location.href,
            page_title: `Form Submit - ${selectedCourseData?.title || "Course"}`,
            referrer: document.referrer,
            utm_source: urlParams.get("utm_source"),
            utm_medium: urlParams.get("utm_medium"),
            utm_campaign: urlParams.get("utm_campaign"),
            short_code: shortCode,
            session_id: localStorage.getItem("session_id"),
            course_slug: selectedCourseData?.slug,
            course_title: selectedCourseData?.title,
            gender: formData.gender,
            age: formData.age ? Number.parseInt(formData.age) : undefined,
          }),
        }).catch(console.error)

        setSubmitSuccess(true)
        setRedirectCountdown(3)
      } else {
        alert("Xatolik yuz berdi: " + (data.error || "Iltimos qaytadan urinib ko'ring."))
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitSuccess(false)
    setSelectedCourse(null)
    setFormData({
      name: "", phone: "", age: "", gender: "", country: "", level: "", contactMethod: "",
      whatsapp: "", telegram: "", phoneCountry: "UZ", whatsappCountry: "UZ", hasWhatsApp: true,
    })
    setFormStep(1)
    setRedirectCountdown(0)
  }

  const filteredCountries = countriesWithCodes.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
  const filteredPhoneCountries = countriesWithCodes.filter(
    (c) => c.name.toLowerCase().includes(phoneCountrySearch.toLowerCase()) || c.phoneCode.includes(phoneCountrySearch),
  )
  const filteredWhatsAppCountries = countriesWithCodes.filter(
    (c) => c.name.toLowerCase().includes(whatsappCountrySearch.toLowerCase()) || c.phoneCode.includes(whatsappCountrySearch),
  )

  // Loading state
  if (isLoadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Darsliklar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // Course detail view
  if (selectedCourse && selectedCourseData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Success Modal */}
        {submitSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative max-w-md w-full rounded-2xl bg-card-dark p-8 shadow-2xl border border-border animate-in fade-in zoom-in duration-300">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg animate-pulse">
                <Icon name="check_circle" className="text-4xl text-background" />
              </div>
              <h3 className="mb-3 text-center text-2xl font-bold text-foreground">Tabriklaymiz!</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Tez orada siz bilan bog'lanamiz.
              </p>
              {redirectCountdown > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative h-24 w-24">
                      <svg className="absolute inset-0 h-24 w-24 -rotate-90 transform">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
                        <circle
                          cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - (4 - redirectCountdown) / 3)}`}
                          className="text-primary transition-all duration-1000 ease-linear" strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{redirectCountdown}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">Kutib turing...</p>
                    <p className="text-xs text-muted-foreground">Sizni guruhga yo'naltiryapmiz</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-10 py-3">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Icon name="arrow_back" className="text-xl" />
                <span className="text-sm font-medium hidden sm:inline">Orqaga</span>
              </button>
              <Link href="/" className="flex items-center gap-3">
                <div className="size-8 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
                  </svg>
                </div>
                <h2 className="text-foreground text-xl font-bold">Muhib Academy</h2>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Left Column - Course Info */}
            <div className="space-y-6">
              {/* Course Header */}
              <div className="rounded-xl bg-card-dark p-6 border border-border">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-bold text-black">
                  <Icon name="redeem" className="text-lg" />
                  3 ta dars BEPUL
                </div>
                <h1 className="mb-3 text-2xl md:text-3xl font-bold text-foreground">{selectedCourseData.title}</h1>
                <p className="mb-4 text-muted-foreground leading-relaxed">{selectedCourseData.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Icon name="group" className="text-lg" />{selectedCourseData.students}</span>
                  <span className="flex items-center gap-1"><Icon name="schedule" className="text-lg" />{selectedCourseData.duration}</span>
                  <span className="flex items-center gap-1">
                    <Icon name="star" className="text-lg text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }} />
                    <span className="text-yellow-400 font-bold">{selectedCourseData.rating}</span>
                    <span className="text-muted-foreground">({selectedCourseData.reviews} sharh)</span>
                  </span>
                </div>
              </div>

              {/* Video */}
              {selectedCourseData.videoUrl && (
                <div className="rounded-xl bg-card-dark p-4 border border-border overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(selectedCourseData.videoUrl)}
                      title={selectedCourseData.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="rounded-xl bg-card-dark p-6 border border-border">
                <h3 className="mb-4 font-bold text-foreground flex items-center gap-2">
                  <Icon name="check_circle" className="text-xl text-primary" />
                  Kursda nimalar bor
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(selectedCourseData.features || []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <Icon name="check" className="text-lg text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div className="rounded-xl bg-card-dark p-6 border border-border">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                  <Icon name="school" className="text-xl text-primary" />
                  Ustoz haqida
                </h3>
                <div className="flex items-start gap-4">
                  <img
                    src={selectedCourseData.instructor?.image || "/placeholder.svg?height=80&width=80"}
                    alt={selectedCourseData.instructor?.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <h4 className="font-bold text-foreground">{selectedCourseData.instructor?.name}</h4>
                    <p className="text-sm text-primary">{selectedCourseData.instructor?.title}</p>
                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="military_tech" className="text-base" />{selectedCourseData.instructor?.experience}</span>
                      <span className="flex items-center gap-1"><Icon name="group" className="text-base" />{selectedCourseData.instructor?.students}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="rounded-xl bg-card-dark p-6 border border-border">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                  <Icon name="format_quote" className="text-xl text-primary" />
                  O'quvchilar fikri
                </h3>
                <div className="space-y-3">
                  {(selectedCourseData.testimonials || []).map((t: any, idx: number) => (
                    <div key={idx} className="rounded-lg bg-muted/30 p-4 border border-border/50">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground text-sm">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.age} yosh</div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Icon key={i} name="star" className="text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm italic text-muted-foreground">"{t.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Enrollment Form */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <form
                onSubmit={async (e) => { e.preventDefault(); await handleSubmit() }}
                className="rounded-xl bg-card p-6 shadow-xl border border-border"
              >
                {/* Form Header */}
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-background">
                    <Icon name="redeem" className="text-sm" />
                    BUGUN BEPUL!
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">
                    {formStep === 1 && "1-qadam: Ma'lumotlaringiz"}
                    {formStep === 2 && "2-qadam: Davlat va daraja"}
                    {formStep === 3 && "3-qadam: Bog'lanish"}
                  </h3>
                  <p className="text-xs text-muted-foreground">3 daqiqada ro'yxatdan o'ting</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`h-1 flex-1 rounded-full transition-colors ${step <= formStep ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>

                {/* Step 1: Personal Info */}
                {formStep === 1 && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">Ismingiz</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ism va familiya"
                        className={`h-10 w-full rounded-lg border-2 bg-muted px-3 text-sm text-foreground transition-all focus:outline-none focus:border-primary ${errors.name ? "border-red-500 bg-red-500/10" : "border-border hover:border-primary/50"}`}
                      />
                      {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">Telefon raqamingiz</label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowPhoneCountryDropdown(!showPhoneCountryDropdown)}
                            className="flex h-10 w-20 items-center justify-center gap-1 rounded-lg border-2 border-border bg-muted hover:border-primary/50 transition-all"
                          >
                            <span className="text-base">{countriesWithCodes.find((c) => c.code === formData.phoneCountry)?.flag}</span>
                            <Icon name="expand_more" className="text-lg text-muted-foreground" />
                          </button>
                          {showPhoneCountryDropdown && (
                            <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-64 overflow-auto rounded-lg border-2 border-border bg-card shadow-xl">
                              <input
                                type="text"
                                placeholder="Qidirish..."
                                value={phoneCountrySearch}
                                onChange={(e) => setPhoneCountrySearch(e.target.value)}
                                className="sticky top-0 w-full border-b border-border bg-card px-3 py-2 text-sm focus:outline-none text-foreground"
                              />
                              {filteredPhoneCountries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => { setFormData((prev) => ({ ...prev, phoneCountry: c.code })); setShowPhoneCountryDropdown(false); setPhoneCountrySearch("") }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-primary/10 text-sm text-foreground"
                                >
                                  <span>{c.flag}</span>
                                  <span>{c.name}</span>
                                  <span className="ml-auto text-muted-foreground">{c.phoneCode}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            {countriesWithCodes.find((c) => c.code === formData.phoneCountry)?.phoneCode}
                          </span>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="901234567"
                            maxLength={getPhoneLength(formData.phoneCountry)}
                            className={`h-10 w-full rounded-lg border-2 bg-muted pl-14 pr-3 text-sm text-foreground transition-all focus:outline-none focus:border-primary ${errors.phone ? "border-red-500 bg-red-500/10" : "border-border hover:border-primary/50"}`}
                          />
                        </div>
                      </div>
                      {errors.phone && <p className="mt-0.5 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">Yoshingiz</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="25"
                          min="10"
                          max="100"
                          className={`h-10 w-full rounded-lg border-2 bg-muted px-3 text-sm text-foreground transition-all focus:outline-none focus:border-primary ${errors.age ? "border-red-500 bg-red-500/10" : "border-border hover:border-primary/50"}`}
                        />
                        {errors.age && <p className="mt-0.5 text-xs text-red-500">{errors.age}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">Jinsingiz</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setFormData((prev) => ({ ...prev, gender: "54" })); if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" })) }}
                            className={`flex-1 h-10 rounded-lg border-2 text-sm font-medium transition-all ${formData.gender === "54" ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`}
                          >
                            Erkak
                          </button>
                          <button
                            type="button"
                            onClick={() => { setFormData((prev) => ({ ...prev, gender: "56" })); if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" })) }}
                            className={`flex-1 h-10 rounded-lg border-2 text-sm font-medium transition-all ${formData.gender === "56" ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`}
                          >
                            Ayol
                          </button>
                        </div>
                        {errors.gender && <p className="mt-0.5 text-xs text-red-500">{errors.gender}</p>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full h-11 rounded-lg bg-primary text-background font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Keyingi qadam
                      <Icon name="arrow_forward" className="text-lg" />
                    </button>
                  </div>
                )}

                {/* Step 2: Country and Level */}
                {formStep === 2 && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">Qaysi davlatda yashaysiz?</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className={`h-10 w-full rounded-lg border-2 bg-muted px-3 text-left text-sm transition-all focus:outline-none flex items-center justify-between ${errors.country ? "border-red-500 bg-red-500/10" : "border-border hover:border-primary/50"}`}
                        >
                          <span className={formData.country ? "text-foreground" : "text-muted-foreground"}>
                            {formData.country ? countriesWithCodes.find((c) => c.name === formData.country)?.flag + " " + formData.country : "Davlatni tanlang"}
                          </span>
                          <Icon name="expand_more" className="text-lg text-muted-foreground" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border-2 border-border bg-card shadow-xl">
                            <input
                              type="text"
                              placeholder="Qidirish..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="sticky top-0 w-full border-b border-border bg-card px-3 py-2 text-sm focus:outline-none text-foreground"
                            />
                            {filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => { setFormData((prev) => ({ ...prev, country: c.name })); setShowCountryDropdown(false); setCountrySearch(""); if (errors.country) setErrors((prev) => ({ ...prev, country: "" })) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-primary/10 text-sm text-foreground"
                              >
                                <span>{c.flag}</span>
                                <span>{c.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.country && <p className="mt-0.5 text-xs text-red-500">{errors.country}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">Arab tili darajangiz</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "44", label: "Nol" },
                          { value: "46", label: "Boshlang'ich" },
                          { value: "48", label: "O'rta" },
                          { value: "50", label: "Yuqori" },
                        ].map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => { setFormData((prev) => ({ ...prev, level: level.value })); if (errors.level) setErrors((prev) => ({ ...prev, level: "" })) }}
                            className={`h-10 rounded-lg border-2 text-sm font-medium transition-all ${formData.level === level.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                      {errors.level && <p className="mt-0.5 text-xs text-red-500">{errors.level}</p>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 h-11 rounded-lg border-2 border-border bg-muted text-muted-foreground font-bold hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Icon name="arrow_back" className="text-lg" />
                        Orqaga
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 h-11 rounded-lg bg-primary text-background font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Keyingi
                        <Icon name="arrow_forward" className="text-lg" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact */}
                {formStep === 3 && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">Qanday bog'lanaylik?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "58", label: "Telefon", icon: "call" },
                          { value: "60", label: "WhatsApp", icon: "chat" },
                          { value: "62", label: "Telegram", icon: "send" },
                        ].map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => { setFormData((prev) => ({ ...prev, contactMethod: method.value })); if (errors.contactMethod) setErrors((prev) => ({ ...prev, contactMethod: "" })) }}
                            className={`h-10 rounded-lg border-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${formData.contactMethod === method.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`}
                          >
                            <Icon name={method.icon} className="text-base" />
                            {method.label}
                          </button>
                        ))}
                      </div>
                      {errors.contactMethod && <p className="mt-0.5 text-xs text-red-500">{errors.contactMethod}</p>}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-card-foreground">WhatsApp raqamingiz</label>
                        <button type="button" onClick={copyPhoneToWhatsApp} className="text-xs text-primary hover:underline">
                          Telefon raqamni nusxalash
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowWhatsAppCountryDropdown(!showWhatsAppCountryDropdown)}
                            className="flex h-10 w-20 items-center justify-center gap-1 rounded-lg border-2 border-border bg-muted hover:border-primary/50 transition-all"
                          >
                            <span className="text-base">{countriesWithCodes.find((c) => c.code === formData.whatsappCountry)?.flag}</span>
                            <Icon name="expand_more" className="text-lg text-muted-foreground" />
                          </button>
                          {showWhatsAppCountryDropdown && (
                            <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-64 overflow-auto rounded-lg border-2 border-border bg-card shadow-xl">
                              <input
                                type="text"
                                placeholder="Qidirish..."
                                value={whatsappCountrySearch}
                                onChange={(e) => setWhatsappCountrySearch(e.target.value)}
                                className="sticky top-0 w-full border-b border-border bg-card px-3 py-2 text-sm focus:outline-none text-foreground"
                              />
                              {filteredWhatsAppCountries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => { setFormData((prev) => ({ ...prev, whatsappCountry: c.code })); setShowWhatsAppCountryDropdown(false); setWhatsappCountrySearch("") }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-primary/10 text-sm text-foreground"
                                >
                                  <span>{c.flag}</span>
                                  <span>{c.name}</span>
                                  <span className="ml-auto text-muted-foreground">{c.phoneCode}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            {countriesWithCodes.find((c) => c.code === formData.whatsappCountry)?.phoneCode}
                          </span>
                          <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={handleWhatsAppChange}
                            placeholder="901234567"
                            className={`h-10 w-full rounded-lg border-2 bg-muted pl-14 pr-3 text-sm text-foreground transition-all focus:outline-none focus:border-primary ${errors.whatsapp ? "border-red-500 bg-red-500/10" : "border-border hover:border-primary/50"}`}
                          />
                        </div>
                      </div>
                      {errors.whatsapp && <p className="mt-0.5 text-xs text-red-500">{errors.whatsapp}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">Telegram username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                        <input
                          type="text"
                          name="telegram"
                          value={formData.telegram}
                          onChange={handleChange}
                          placeholder="username"
                          className={`h-10 w-full rounded-lg border-2 bg-muted pl-8 pr-3 text-sm text-foreground transition-all focus:outline-none focus:border-primary ${errors.telegram ? "border-red-500 bg-red-500/10" : "border-border hover:border-primary/50"}`}
                        />
                      </div>
                      {errors.telegram && <p className="mt-0.5 text-xs text-red-500">{errors.telegram}</p>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 h-11 rounded-lg border-2 border-border bg-muted text-muted-foreground font-bold hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Icon name="arrow_back" className="text-lg" />
                        Orqaga
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-11 rounded-lg bg-primary text-background font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                            Yuklanmoqda...
                          </>
                        ) : (
                          <>
                            <Icon name="check_circle" className="text-lg" />
                            Yuborish
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Courses catalog view
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 text-foreground">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-foreground text-xl font-bold">Muhib Academy</h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/kurslar" className="text-foreground hover:text-primary transition-colors text-sm font-medium">Barcha kurslar</Link>
              <Link href="/ustozlar" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Ustozlarimiz</Link>
              <Link href="/#haqida" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Akademiya haqida</Link>
              <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Biz bilan bog'lanish</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-lg">
                  <Icon name="search" className="text-xl" />
                </div>
                <input className="form-input flex w-full min-w-0 flex-1 border-none bg-muted text-foreground focus:ring-0 h-full placeholder:text-muted-foreground px-4 rounded-r-lg text-sm" placeholder="Kurs qidirish..." />
              </div>
            </label>
            <div className="flex gap-2">
              <Link href="/darsliklar" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-background text-sm font-bold hover:opacity-90 transition-opacity">
                A'zo bo'lish
              </Link>
              <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-muted text-foreground text-sm font-bold hover:bg-muted/80 transition-colors">
                Kirish
              </button>
            </div>
            <button className="lg:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border mt-3 pt-3 pb-2">
            <nav className="flex flex-col gap-2">
              <Link href="/kurslar" className="text-foreground hover:text-primary transition-colors text-sm font-medium py-2">Barcha kurslar</Link>
              <Link href="/ustozlar" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium py-2">Ustozlarimiz</Link>
              <Link href="/#haqida" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium py-2">Akademiya haqida</Link>
              <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium py-2">Biz bilan bog'lanish</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background py-12 border-b border-border">
        <div className="absolute inset-0 hero-pattern"></div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="max-w-2xl">
              <h1 className="text-foreground text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
                Muqaddas ilmlarni <br /><span className="text-primary">istalgan joyda o'rganing.</span>
              </h1>
              <p className="text-muted-foreground text-lg font-normal leading-normal max-w-lg">
                An'ana va zamonaviy ta'limning oqlangan sintezi. Dunyo darajasidagi olimlar tomonidan olib boriladigan kurslarni kashf eting.
              </p>
            </div>
            <div className="flex gap-3 pb-2">
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Icon name="verified" className="text-lg" />
                <span className="text-sm font-semibold uppercase tracking-wider">Akkreditatsiyalangan dasturlar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8">
        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.slug}
              className="group flex flex-col bg-card-dark border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedCourse(course.slug)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${course.image || "/images/quran-hero.jpg"}')` }}
                />
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase text-primary border border-primary/20 tracking-widest">
                  {course.category || "Arab tili"}
                </div>
                {course.is_bestseller && (
                  <div className="absolute bottom-3 right-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter">
                    <Icon name="star" className="text-xs" style={{ fontVariationSettings: "'FILL' 1" }} /> Eng ko'p sotilgan
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="size-6 rounded-full bg-cover bg-center border border-primary/30"
                    style={{ backgroundImage: `url('${course.instructor?.image || "/placeholder-user.jpg"}')` }}
                  />
                  <span className="text-xs text-muted-foreground">{course.instructor?.name || "Ustoz"}</span>
                </div>
                <h3 className="text-foreground text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {course.description}
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Icon name="redeem" className="text-lg" />
                    3 ta bepul dars mavjud
                  </div>
                  <button className="w-full rounded-lg h-11 px-4 bg-primary text-background text-sm font-bold hover:bg-white transition-colors">
                    3 ta bepul darsni boshlash
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Tez-tez beriladigan savollar
          </h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card-dark overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  <Icon name={openFaq === idx ? "expand_less" : "expand_more"} className="text-xl text-muted-foreground" />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-muted-foreground text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 md:px-10 py-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-8 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-foreground font-bold">Muhib Academy</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Islomning boqiylik hikmati bilan ongni yoritish. Izlanuvchilarning global hamjamiyati uchun zamonaviy platforma.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-4">Ta'lim</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/kurslar" className="hover:text-primary transition-colors">Barcha kurslar</Link></li>
                <li><Link href="/darsliklar" className="hover:text-primary transition-colors">Ilmiy daraja dasturlari</Link></li>
                <li><Link href="/darsliklar" className="hover:text-primary transition-colors">Qisqa kurslar</Link></li>
                <li><Link href="/darsliklar" className="hover:text-primary transition-colors">Bepul ma'ruzalar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-4">Akademiya</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#haqida" className="hover:text-primary transition-colors">Akademiya haqida</Link></li>
                <li><Link href="/ustozlar" className="hover:text-primary transition-colors">Ustozlarimiz</Link></li>
                <li><Link href="/#contact" className="hover:text-primary transition-colors">Biz bilan bog'lanish</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-4">Yangiliklardan xabardor bo'ling</h4>
              <p className="text-muted-foreground text-sm mb-3">Kurslar va yangiliklar uchun obuna bo'ling.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Elektron pochta manzili"
                  className="flex-1 h-10 rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <button className="h-10 px-4 rounded-lg bg-primary text-background font-bold text-sm hover:opacity-90 transition-opacity">
                  QO'SHILISH
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2024 Muhib Academy. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors">Maxfiylik siyosati</Link>
              <Link href="#" className="hover:text-primary transition-colors">Xizmat ko'rsatish shartlari</Link>
              <Link href="#" className="hover:text-primary transition-colors">Yordam</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <a
        href="https://t.me/MuhibAcademyBot"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-background px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
      >
        <Icon name="headset_mic" className="text-xl" />
        <span className="font-bold text-sm">Bog'lanish</span>
      </a>
    </div>
  )
}
