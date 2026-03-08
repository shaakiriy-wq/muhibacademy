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
    answer: "Barcha darslar jonli Zoom orqali o'tiladi. Darslar video formatda saqlanib, istalgan vaqt qayta ko'rishingiz mumkin.",
  },
  {
    question: "Birinchi 3 ta dars haqiqatan ham bepulmi?",
    answer: "Ha, birinchi 3 ta dars to'liq bepul! Siz kursni sinab ko'rib, ustozlar bilan tanishib olishingiz mumkin.",
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
          full_name: formData.name,
          phone: fullPhone,
          age: formData.age,
          gender: formData.gender,
          country: formData.country,
          arab_level: formData.level,
          contact_method: formData.contactMethod,
          whatsapp: whatsappFull,
          telegram: formData.telegram,
          course_slug: selectedCourseData?.slug || "",
          course_title: selectedCourseData?.title || "",
          short_code: shortCode,
          utm_source: urlParams.get("utm_source") || "",
          utm_medium: urlParams.get("utm_medium") || "",
          utm_campaign: urlParams.get("utm_campaign") || "",
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSubmitSuccess(true)
        setRedirectCountdown(5)
        track("form_submitted", {
          course: selectedCourseData?.title || "Unknown",
          gender: formData.gender,
          age: formData.age,
          country: formData.country,
          level: formData.level,
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Course categories for display
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      arab_tili: "ARAB TILI",
      quron_ilmlari: "QUR'ON ILMLARI",
      fiqh_va_aqida: "FIQH VA AQIDA",
      islom_tarixi: "ISLOM TARIXI",
      zamonaviy_fanlar: "ZAMONAVIY FANLAR",
    }
    return labels[category] || category?.toUpperCase() || "KURS"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="auto_stories" className="text-xl text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white">Muhib Academy</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/kurslar" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Barcha kurslar</Link>
            <Link href="/ustozlar" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Ustozlarimiz</Link>
            <Link href="/#haqida" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Akademiya haqida</Link>
            <Link href="/#contact" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Biz bilan bog'lanish</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-lg" />
              <input
                type="text"
                placeholder="Kurs qidirish..."
                className="h-9 pl-9 pr-4 rounded-full bg-muted border border-border text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-primary w-48"
              />
            </div>
            <Link href="/darsliklar" className="h-9 px-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center hover:bg-primary/90 transition-colors">
              A'zo bo'lish
            </Link>
            <button type="button" className="h-9 px-4 rounded-full bg-white text-background font-semibold text-sm hover:bg-white/90 transition-colors">
              Kirish
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border/50 p-4">
            <nav className="flex flex-col gap-3">
              <Link href="/kurslar" className="text-white/70 hover:text-primary transition-colors text-sm font-medium py-2">Barcha kurslar</Link>
              <Link href="/ustozlar" className="text-white/70 hover:text-primary transition-colors text-sm font-medium py-2">Ustozlarimiz</Link>
              <Link href="/#haqida" className="text-white/70 hover:text-primary transition-colors text-sm font-medium py-2">Akademiya haqida</Link>
              <Link href="/#contact" className="text-white/70 hover:text-primary transition-colors text-sm font-medium py-2">Biz bilan bog'lanish</Link>
              <div className="flex gap-2 pt-2">
                <Link href="/darsliklar" className="flex-1 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center">
                  A'zo bo'lish
                </Link>
                <button type="button" className="flex-1 h-10 rounded-full bg-white text-background font-semibold text-sm">
                  Kirish
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 hero-pattern">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Muqaddas ilmlarni<br />
            <span className="text-primary">istalgan joyda o'rganing.</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mb-4">
            An'ana va zamonaviy ta'limning oqlangan sintezi. Dunyo darajasidagi olimlar tomonidan olib boriladigan kurslarni kashf eting.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Icon name="verified" className="text-primary text-lg" />
            <span className="text-primary text-sm font-medium">AKKREDITATSIYALANGAN DASTURLAR</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Course Selected - Detail View */}
          {selectedCourse && selectedCourseData ? (
            <div className="space-y-8">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCourse(null)
                  setFormStep(1)
                  setSubmitSuccess(false)
                  setErrors({})
                }}
                className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors"
              >
                <Icon name="arrow_back" className="text-xl" />
                <span className="text-sm font-medium">Barcha kurslarga qaytish</span>
              </button>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Course Info */}
                <div className="space-y-6">
                  {/* Video */}
                  {selectedCourseData.video_url && (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedCourseData.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Course Card */}
                  <div className="card-dark p-6 space-y-4">
                    <span className="category-badge">{getCategoryLabel(selectedCourseData.category)}</span>
                    <h2 className="text-2xl font-bold text-white">{selectedCourseData.title}</h2>
                    <p className="text-white/60">{selectedCourseData.description}</p>

                    {/* Instructor */}
                    {selectedCourseData.instructor && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                          {selectedCourseData.instructor.image_url ? (
                            <Image
                              src={selectedCourseData.instructor.image_url}
                              alt={selectedCourseData.instructor.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/20">
                              <Icon name="person" className="text-primary text-xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{selectedCourseData.instructor.name}</p>
                          <p className="text-sm text-white/60">{selectedCourseData.instructor.specialty}</p>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Icon name="schedule" className="text-primary text-lg" />
                        <span className="text-sm text-white/70">3 ta bepul dars</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="workspace_premium" className="text-primary text-lg" />
                        <span className="text-sm text-white/70">Sertifikat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="videocam" className="text-primary text-lg" />
                        <span className="text-sm text-white/70">Jonli darslar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="support_agent" className="text-primary text-lg" />
                        <span className="text-sm text-white/70">24/7 qo'llab-quvvatlash</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="card-dark p-6">
                  {submitSuccess ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Icon name="check_circle" className="text-5xl text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Tabriklaymiz!</h3>
                      <p className="text-white/60">Ro'yxatdan muvaffaqiyatli o'tdingiz</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <Icon name="hourglass_top" className="text-primary animate-spin" />
                        <span className="text-primary font-medium">{redirectCountdown} soniyada Telegram botga yo'naltirilasiz</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Progress Steps */}
                      <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((step) => (
                          <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                              formStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-white/50"
                            }`}>
                              {step}
                            </div>
                            {step < 3 && (
                              <div className={`w-16 h-1 mx-1 rounded transition-colors ${
                                formStep > step ? "bg-primary" : "bg-muted"
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Step 1 */}
                      {formStep === 1 && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white mb-6">Shaxsiy ma'lumotlar</h3>
                          
                          <div>
                            <label className="block text-sm text-white/70 mb-2">Ismingiz</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="To'liq ismingiz"
                              className="form-input"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                          </div>

                          <div>
                            <label className="block text-sm text-white/70 mb-2">Telefon raqam</label>
                            <div className="flex gap-2">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowPhoneCountryDropdown(!showPhoneCountryDropdown)}
                                  className="h-12 px-3 rounded-xl bg-muted border border-border text-white flex items-center gap-2"
                                >
                                  <span>{countriesWithCodes.find(c => c.code === formData.phoneCountry)?.flag}</span>
                                  <span className="text-sm">{countriesWithCodes.find(c => c.code === formData.phoneCountry)?.phoneCode}</span>
                                  <Icon name="expand_more" className="text-lg" />
                                </button>
                                {showPhoneCountryDropdown && (
                                  <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                                    <input
                                      type="text"
                                      placeholder="Qidirish..."
                                      value={phoneCountrySearch}
                                      onChange={(e) => setPhoneCountrySearch(e.target.value)}
                                      className="w-full h-10 px-3 bg-muted border-b border-border text-white text-sm"
                                    />
                                    {countriesWithCodes
                                      .filter(c => c.name.toLowerCase().includes(phoneCountrySearch.toLowerCase()))
                                      .map((country) => (
                                        <button
                                          key={country.code}
                                          type="button"
                                          onClick={() => {
                                            setFormData(prev => ({ ...prev, phoneCountry: country.code }))
                                            setShowPhoneCountryDropdown(false)
                                            setPhoneCountrySearch("")
                                          }}
                                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-white text-sm"
                                        >
                                          <span>{country.flag}</span>
                                          <span>{country.name}</span>
                                          <span className="text-white/50 ml-auto">{country.phoneCode}</span>
                                        </button>
                                      ))}
                                  </div>
                                )}
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder="Telefon raqamingiz"
                                className="form-input flex-1"
                              />
                            </div>
                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-white/70 mb-2">Yoshingiz</label>
                              <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Yosh"
                                className="form-input"
                              />
                              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                            </div>
                            <div>
                              <label className="block text-sm text-white/70 mb-2">Jinsingiz</label>
                              <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-input"
                              >
                                <option value="">Tanlang</option>
                                <option value="54">Erkak</option>
                                <option value="56">Ayol</option>
                              </select>
                              {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors mt-4"
                          >
                            Davom etish
                          </button>
                        </div>
                      )}

                      {/* Step 2 */}
                      {formStep === 2 && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white mb-6">Ta'lim ma'lumotlari</h3>

                          <div>
                            <label className="block text-sm text-white/70 mb-2">Davlatingiz</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="form-input w-full text-left flex items-center justify-between"
                              >
                                <span>{formData.country || "Davlatni tanlang"}</span>
                                <Icon name="expand_more" className="text-lg" />
                              </button>
                              {showCountryDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                                  <input
                                    type="text"
                                    placeholder="Qidirish..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="w-full h-10 px-3 bg-muted border-b border-border text-white text-sm"
                                  />
                                  {countriesWithCodes
                                    .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                                    .map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, country: country.name }))
                                          setShowCountryDropdown(false)
                                          setCountrySearch("")
                                        }}
                                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-white text-sm"
                                      >
                                        <span>{country.flag}</span>
                                        <span>{country.name}</span>
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>
                            {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
                          </div>

                          <div>
                            <label className="block text-sm text-white/70 mb-2">Arab tili darajangiz</label>
                            <select
                              name="level"
                              value={formData.level}
                              onChange={handleChange}
                              className="form-input"
                            >
                              <option value="">Tanlang</option>
                              <option value="beginner">Boshlang'ich (Hech narsa bilmayman)</option>
                              <option value="elementary">Oddiy (Harflarni bilaman)</option>
                              <option value="intermediate">O'rta (O'qiy olaman)</option>
                              <option value="advanced">Yuqori (Yaxshi gaplashaman)</option>
                            </select>
                            {errors.level && <p className="text-red-400 text-xs mt-1">{errors.level}</p>}
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="flex-1 h-12 rounded-xl bg-muted text-white font-bold hover:bg-muted/80 transition-colors"
                            >
                              Ortga
                            </button>
                            <button
                              type="button"
                              onClick={handleNextStep}
                              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                            >
                              Davom etish
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 3 */}
                      {formStep === 3 && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white mb-6">Bog'lanish ma'lumotlari</h3>

                          <div>
                            <label className="block text-sm text-white/70 mb-2">Qanday bog'lanishni xohlaysiz?</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { value: "telegram", label: "Telegram", icon: "send" },
                                { value: "whatsapp", label: "WhatsApp", icon: "chat" },
                                { value: "phone", label: "Telefon", icon: "call" },
                                { value: "any", label: "Farqi yo'q", icon: "done_all" },
                              ].map((method) => (
                                <button
                                  key={method.value}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, contactMethod: method.value }))}
                                  className={`h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
                                    formData.contactMethod === method.value
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-white hover:bg-muted/80"
                                  }`}
                                >
                                  <Icon name={method.icon} className="text-lg" />
                                  {method.label}
                                </button>
                              ))}
                            </div>
                            {errors.contactMethod && <p className="text-red-400 text-xs mt-1">{errors.contactMethod}</p>}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm text-white/70">WhatsApp raqamingiz</label>
                              <button
                                type="button"
                                onClick={copyPhoneToWhatsApp}
                                className="text-xs text-primary hover:underline"
                              >
                                Telefon raqamdan nusxalash
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowWhatsAppCountryDropdown(!showWhatsAppCountryDropdown)}
                                  className="h-12 px-3 rounded-xl bg-muted border border-border text-white flex items-center gap-2"
                                >
                                  <span>{countriesWithCodes.find(c => c.code === formData.whatsappCountry)?.flag}</span>
                                  <span className="text-sm">{countriesWithCodes.find(c => c.code === formData.whatsappCountry)?.phoneCode}</span>
                                  <Icon name="expand_more" className="text-lg" />
                                </button>
                                {showWhatsAppCountryDropdown && (
                                  <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                                    <input
                                      type="text"
                                      placeholder="Qidirish..."
                                      value={whatsappCountrySearch}
                                      onChange={(e) => setWhatsappCountrySearch(e.target.value)}
                                      className="w-full h-10 px-3 bg-muted border-b border-border text-white text-sm"
                                    />
                                    {countriesWithCodes
                                      .filter(c => c.name.toLowerCase().includes(whatsappCountrySearch.toLowerCase()))
                                      .map((country) => (
                                        <button
                                          key={country.code}
                                          type="button"
                                          onClick={() => {
                                            setFormData(prev => ({ ...prev, whatsappCountry: country.code }))
                                            setShowWhatsAppCountryDropdown(false)
                                            setWhatsappCountrySearch("")
                                          }}
                                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-white text-sm"
                                        >
                                          <span>{country.flag}</span>
                                          <span>{country.name}</span>
                                          <span className="text-white/50 ml-auto">{country.phoneCode}</span>
                                        </button>
                                      ))}
                                  </div>
                                )}
                              </div>
                              <input
                                type="tel"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleWhatsAppChange}
                                placeholder="WhatsApp raqamingiz"
                                className="form-input flex-1"
                              />
                            </div>
                            {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
                          </div>

                          <div>
                            <label className="block text-sm text-white/70 mb-2">Telegram username</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">@</span>
                              <input
                                type="text"
                                name="telegram"
                                value={formData.telegram}
                                onChange={handleChange}
                                placeholder="username"
                                className="form-input pl-8"
                              />
                            </div>
                            {errors.telegram && <p className="text-red-400 text-xs mt-1">{errors.telegram}</p>}
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="flex-1 h-12 rounded-xl bg-muted text-white font-bold hover:bg-muted/80 transition-colors"
                            >
                              Ortga
                            </button>
                            <button
                              type="button"
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                  Yuborilmoqda...
                                </>
                              ) : (
                                "Ro'yxatdan o'tish"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-white text-center mb-8">Ko'p so'raladigan savollar</h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="card-dark overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-white">{faq.question}</span>
                        <Icon
                          name={openFaq === index ? "expand_less" : "expand_more"}
                          className="text-xl text-white/50 flex-shrink-0"
                        />
                      </button>
                      {openFaq === index && (
                        <div className="px-4 pb-4">
                          <p className="text-white/60 text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Courses Grid */
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/50 text-sm">
                  Katalogdan {courses.length} ta natija ko'rsatilmoqda
                </p>
              </div>

              {isLoadingCourses ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="course-card animate-pulse">
                      <div className="aspect-[4/3] bg-muted rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-20" />
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-10 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-16">
                  <Icon name="school" className="text-6xl text-white/20 mb-4" />
                  <p className="text-white/50">Hozircha kurslar mavjud emas</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.slug} className="course-card group">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                        {course.image_url ? (
                          <Image
                            src={course.image_url}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Icon name="auto_stories" className="text-5xl text-primary/50" />
                          </div>
                        )}
                        <span className="category-badge absolute top-3 left-3">
                          {getCategoryLabel(course.category)}
                        </span>
                        {course.has_free_consultation && (
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white text-background text-xs font-medium flex items-center gap-1">
                            <Icon name="headset_mic" className="text-sm" />
                            Bepul maslahat
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        {/* Instructor */}
                        {course.instructor && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                              {course.instructor.image_url ? (
                                <Image
                                  src={course.instructor.image_url}
                                  alt={course.instructor.name}
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/20">
                                  <Icon name="person" className="text-primary text-xs" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-white/60">{course.instructor.name}</span>
                          </div>
                        )}
                        
                        <h3 className="font-bold text-white line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-white/60 line-clamp-2">{course.description}</p>
                        
                        <div className="flex items-center gap-1 text-primary text-sm">
                          <Icon name="calendar_month" className="text-base" />
                          <span>3 ta bepul dars mavjud</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedCourse(course.slug)}
                          className="w-full h-10 rounded-xl bg-transparent border border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                        >
                          3 ta bepul darsni boshlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="auto_stories" className="text-xl text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-white">Muhib Academy</span>
              </div>
              <p className="text-white/50 text-sm mb-4">
                Islomning boqiylik hikmati bilan ongni yoritish. Izlanuvchilarning global hamjamiyati uchun zamonaviy platforma.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-white/50 hover:text-primary transition-colors">
                  <Icon name="language" className="text-lg" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-white/50 hover:text-primary transition-colors">
                  <Icon name="group" className="text-lg" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-white/50 hover:text-primary transition-colors">
                  <Icon name="mail" className="text-lg" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Ta'lim</h4>
              <ul className="space-y-2">
                <li><Link href="/kurslar" className="text-white/50 hover:text-primary text-sm transition-colors">Barcha kurslar</Link></li>
                <li><Link href="/darsliklar" className="text-white/50 hover:text-primary text-sm transition-colors">Ilmiy daraja dasturlari</Link></li>
                <li><Link href="/darsliklar" className="text-white/50 hover:text-primary text-sm transition-colors">Qisqa kurslar</Link></li>
                <li><Link href="/darsliklar" className="text-white/50 hover:text-primary text-sm transition-colors">Bepul ma'ruzalar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Akademiya</h4>
              <ul className="space-y-2">
                <li><Link href="/#haqida" className="text-white/50 hover:text-primary text-sm transition-colors">Akademiya haqida</Link></li>
                <li><Link href="/ustozlar" className="text-white/50 hover:text-primary text-sm transition-colors">Ustozlarimiz</Link></li>
                <li><Link href="/#" className="text-white/50 hover:text-primary text-sm transition-colors">Qabul</Link></li>
                <li><Link href="/#contact" className="text-white/50 hover:text-primary text-sm transition-colors">Biz bilan bog'lanish</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Yangiliklardan xabardor bo'ling</h4>
              <p className="text-white/50 text-sm mb-3">Kurslar va yangiliklar uchun obuna bo'ling.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Elektron pochta manzili"
                  className="flex-1 h-10 px-3 rounded-lg bg-muted border border-border text-white text-sm placeholder:text-white/50"
                />
                <button type="button" className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                  QO'SHILISH
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">© 2024 Muhib Academy. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-6">
              <a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Maxfiylik siyosati</a>
              <a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Xizmat ko'rsatish shartlari</a>
              <a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Yordam</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Button */}
      <a
        href="https://t.me/MuhibAcademyBot"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 h-12 px-5 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Icon name="headset_mic" className="text-xl" />
        <span className="hidden sm:inline">Bog'lanish</span>
      </a>
    </div>
  )
}
