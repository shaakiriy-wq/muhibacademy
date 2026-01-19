"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Star,
  ArrowRight,
  Quote,
  ChevronDown,
  Gift,
  Play,
  Shield,
  Sparkles,
  Phone,
  MessageCircle,
  Send,
  Home,
} from "lucide-react"

import { track } from "@vercel/analytics"

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
  { code: "MX", name: "Meksika", flag: "🇲🇽", phoneCode: "+52" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", phoneCode: "+54" },
  { code: "EG", name: "Misr", flag: "🇪🇬", phoneCode: "+20" },
  { code: "NG", name: "Nigeriya", flag: "🇳🇬", phoneCode: "+234" },
  { code: "ZA", name: "Janubiy Afrika", flag: "🇿🇦", phoneCode: "+27" },
  { code: "KE", name: "Keniya", flag: "🇰🇪", phoneCode: "+254" },
  { code: "MA", name: "Marokash", flag: "🇲🇦", phoneCode: "+212" },
  { code: "DZ", name: "Jazoir", flag: "🇩🇿", phoneCode: "+213" },
  { code: "TN", name: "Tunis", flag: "🇹🇳", phoneCode: "+216" },
  { code: "LY", name: "Liviya", flag: "🇱🇾", phoneCode: "+218" },
  { code: "SD", name: "Sudan", flag: "🇸🇩", phoneCode: "+249" },
  { code: "ET", name: "Efiopiya", flag: "🇪🇹", phoneCode: "+251" },
  { code: "IQ", name: "Iroq", flag: "🇮🇶", phoneCode: "+964" },
  { code: "IR", name: "Eron", flag: "🇮🇷", phoneCode: "+98" },
  { code: "SY", name: "Suriya", flag: "🇸🇾", phoneCode: "+963" },
  { code: "JO", name: "Iordaniya", flag: "🇯🇴", phoneCode: "+962" },
  { code: "LB", name: "Livan", flag: "🇱🇧", phoneCode: "+961" },
  { code: "YE", name: "Yaman", flag: "🇾🇪", phoneCode: "+967" },
  { code: "OM", name: "Ummon", flag: "🇴🇲", phoneCode: "+968" },
  { code: "KW", name: "Quvayt", flag: "🇰🇼", phoneCode: "+965" },
  { code: "BH", name: "Bahrayn", flag: "🇧🇭", phoneCode: "+973" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", phoneCode: "+974" },
  { code: "IL", name: "Isroil", flag: "🇮🇱", phoneCode: "+972" },
  { code: "PS", name: "Falastin", flag: "🇵🇸", phoneCode: "+970" },
  { code: "AZ", name: "Ozarbayjon", flag: "🇦🇿", phoneCode: "+994" },
  { code: "GE", name: "Gruziya", flag: "🇬🇪", phoneCode: "+995" },
  { code: "AM", name: "Armaniston", flag: "🇦🇲", phoneCode: "+374" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", phoneCode: "+375" },
  { code: "UA", name: "Ukraina", flag: "🇺🇦", phoneCode: "+380" },
  { code: "MD", name: "Moldova", flag: "🇲🇩", phoneCode: "+373" },
  { code: "PL", name: "Polsha", flag: "🇵🇱", phoneCode: "+48" },
  { code: "CZ", name: "Chexiya", flag: "🇨🇿", phoneCode: "+420" },
  { code: "SK", name: "Slovakiya", flag: "🇸🇰", phoneCode: "+421" },
  { code: "HU", name: "Vengriya", flag: "🇭🇺", phoneCode: "+36" },
  { code: "RO", name: "Ruminiya", flag: "🇷🇴", phoneCode: "+40" },
  { code: "BG", name: "Bolgariya", flag: "🇧🇬", phoneCode: "+359" },
  { code: "GR", name: "Gretsiya", flag: "🇬🇷", phoneCode: "+30" },
  { code: "RS", name: "Serbiya", flag: "🇷🇸", phoneCode: "+381" },
  { code: "HR", name: "Xorvatiya", flag: "🇭🇷", phoneCode: "+385" },
  { code: "BA", name: "Bosniya", flag: "🇧🇦", phoneCode: "+387" },
  { code: "AL", name: "Albaniya", flag: "🇦🇱", phoneCode: "+355" },
  { code: "MK", name: "Shimoliy Makedoniya", flag: "🇲🇰", phoneCode: "+389" },
  { code: "SI", name: "Sloveniya", flag: "🇸🇮", phoneCode: "+386" },
  { code: "AT", name: "Avstriya", flag: "🇦🇹", phoneCode: "+43" },
  { code: "CH", name: "Shveytsariya", flag: "🇨🇭", phoneCode: "+41" },
  { code: "NL", name: "Niderlandiya", flag: "🇳🇱", phoneCode: "+31" },
  { code: "BE", name: "Belgiya", flag: "🇧🇪", phoneCode: "+32" },
  { code: "LU", name: "Lyuksemburg", flag: "🇱🇺", phoneCode: "+352" },
  { code: "SE", name: "Shvetsiya", flag: "🇸🇪", phoneCode: "+46" },
  { code: "NO", name: "Norvegiya", flag: "🇳🇴", phoneCode: "+47" },
  { code: "DK", name: "Daniya", flag: "🇩🇰", phoneCode: "+45" },
  { code: "FI", name: "Finlandiya", flag: "🇫🇮", phoneCode: "+358" },
  { code: "IS", name: "Islandiya", flag: "🇮🇸", phoneCode: "+354" },
  { code: "IE", name: "Irlandiya", flag: "🇮🇪", phoneCode: "+353" },
  { code: "PT", name: "Portugaliya", flag: "🇵🇹", phoneCode: "+351" },
  { code: "TH", name: "Tailand", flag: "🇹🇭", phoneCode: "+66" },
  { code: "VN", name: "Vyetnam", flag: "🇻🇳", phoneCode: "+84" },
  { code: "MY", name: "Malayziya", flag: "🇲🇾", phoneCode: "+60" },
  { code: "SG", name: "Singapur", flag: "🇸🇬", phoneCode: "+65" },
  { code: "PH", name: "Filippin", flag: "🇵🇭", phoneCode: "+63" },
  { code: "ID", name: "Indoneziya", flag: "🇮🇩", phoneCode: "+62" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", phoneCode: "+880" },
  { code: "LK", name: "Shri-Lanka", flag: "🇱🇰", phoneCode: "+94" },
  { code: "MM", name: "Myanma", flag: "🇲🇲", phoneCode: "+95" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", phoneCode: "+977" },
  { code: "MN", name: "Mo'g'uliston", flag: "🇲🇳", phoneCode: "+976" },
  { code: "KH", name: "Kambodja", flag: "🇰🇭", phoneCode: "+855" },
  { code: "LA", name: "Laos", flag: "🇱🇦", phoneCode: "+856" },
  { code: "NZ", name: "Yangi Zelandiya", flag: "🇳🇿", phoneCode: "+64" },
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
  UZ: 9, // Uzbekistan: 9 digits after +998
  US: 10, // USA: 10 digits after +1
  RU: 10, // Russia: 10 digits after +7
  TR: 10, // Turkey: 10 digits after +90
  KZ: 10, // Kazakhstan: 10 digits after +7
  GB: 10, // UK: 10 digits after +44
  DE: 10, // Germany: 10-11 digits, we use 10 as minimum
  FR: 9, // France: 9 digits after +33
  SA: 9, // Saudi Arabia: 9 digits after +966
  AE: 9, // UAE: 9 digits after +971
  KG: 9, // Kyrgyzstan: 9 digits after +996
  TJ: 9, // Tajikistan: 9 digits after +992
  TM: 8, // Turkmenistan: 8 digits after +993
  IN: 10, // India: 10 digits after +91
  PK: 10, // Pakistan: 10 digits after +92
  AF: 9, // Afghanistan: 9 digits after +93
  CN: 11, // China: 11 digits after +86
  JP: 10, // Japan: 10 digits after +81
  KR: 10, // South Korea: 10 digits after +82
  IT: 10, // Italy: 10 digits after +39
  ES: 9, // Spain: 9 digits after +34
  CA: 10, // Canada: 10 digits after +1
  AU: 9, // Australia: 9 digits after +61
  BR: 11, // Brazil: 11 digits after +55
  MX: 10, // Mexico: 10 digits after +52
  AR: 10, // Argentina: 10 digits after +54
  EG: 10, // Egypt: 10 digits after +20
  NG: 10, // Nigeria: 10 digits after +234
  ZA: 9, // South Africa: 9 digits after +27
  // Default for others: 9 digits
}

const getPhoneLength = (countryCode: string): number => {
  return phoneNumberLengths[countryCode] || 9
}

// Define track function if it's not globally available (e.g., in Vercel Analytics)
// REMOVED: const track =
// REMOVED:  typeof window !== "undefined" && (window as any).trackAnalytics ? (window as any).trackAnalytics : () => {}

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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "", // 54=Erkak, 56=Ayol
    country: "",
    level: "", // 44,46,48,50,52
    contactMethod: "", // 58=Telefon, 60=WhatsApp, 62=Telegram
    whatsapp: "",
    telegram: "",
    phoneCountry: "UZ", // Default to Uzbekistan
    whatsappCountry: "UZ", // Default to Uzbekistan for WhatsApp
    hasWhatsApp: true, // Default: user has WhatsApp
  })

  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] = useState(false)
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("")
  const [showWhatsAppCountryDropdown, setShowWhatsAppCountryDropdown] = useState(false)
  const [whatsappCountrySearch, setWhatsappCountrySearch] = useState("")

  const selectedCourseData = courses.find((c) => c.slug === selectedCourse) || null

  // Fetch courses on component mount
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

  // Scroll to top when a course is selected
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
              ? selectedCourseData?.female_redirect_url ||
                selectedCourseData?.redirect_url ||
                "https://t.me/MuhibAcademyBot"
              : selectedCourseData?.male_redirect_url ||
                selectedCourseData?.redirect_url ||
                "https://t.me/MuhibAcademyBot"

          track("bot_click", {
            course: selectedCourseData?.title || "Unknown",
            gender: formData.gender,
            age: formData.age,
            redirect_url: redirectUrl,
          })

          // Track bot click to Supabase
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

          // Redirect after tracking
          setTimeout(() => {
            window.location.href = redirectUrl
          }, 100)
        } else {
          setRedirectCountdown(redirectCountdown - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [redirectCountdown, selectedCourseData])

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ""

    // Already embed URL
    if (url.includes("youtube.com/embed/")) return url

    // Watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Short URL: https://youtu.be/VIDEO_ID
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
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    setFormData((prev) => ({ ...prev, phone: value }))
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    setFormData((prev) => ({ ...prev, whatsapp: value }))
    if (errors.whatsapp) {
      setErrors((prev) => ({ ...prev, whatsapp: "" }))
    }
  }

  const handleNextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2)
    } else if (formStep === 2 && validateStep2()) {
      setFormStep(3)
    }
  }

  const handlePrevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1)
      setErrors({})
    }
  }

  const copyPhoneToWhatsApp = () => {
    const selectedCountry = countriesWithCodes.find((c) => c.code === formData.phoneCountry)
    const fullPhone = `${formData.phone}` // Just the digits

    setFormData((prev) => ({
      ...prev,
      whatsapp: fullPhone,
      whatsappCountry: prev.phoneCountry, // Set WhatsApp country same as phone
    }))

    // Also copy to clipboard with full format
    const fullPhoneWithCode = `${selectedCountry?.phoneCode || "+998"}${fullPhone}`
    navigator.clipboard
      .writeText(fullPhoneWithCode)
      .then(() => {
        alert(`Raqam nusxalandi: ${fullPhoneWithCode}`)
      })
      .catch((err) => {
        console.error("[v0] Copy failed:", err)
        alert("Nusxalashda xatolik")
      })
  }

  const handleSubmit = async () => {
    console.log("[v0] handleSubmit started")
    if (!validateStep3()) {
      console.log("[v0] Step 3 validation failed")
      return
    }

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

      console.log("[v0] Submitting to Bitrix:", {
        course: selectedCourseData?.title,
        redirectUrl: selectedCourseData?.redirect_url,
        whatsappFull,
      })

      const response = await fetch("/api/bitrix-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone, // Send with + and country code
          whatsapp: whatsappFull, // Send WhatsApp with + and country code or empty
          course: selectedCourseData?.title,
          courseId: selectedCourse,
          shortCode,
        }),
      })

      const data = await response.json()
      console.log("[v0] Bitrix response:", data)

      if (data.success) {
        console.log("[v0] Success! Starting 3 second countdown to:", selectedCourseData?.redirect_url)

        track("lead_generated", {
          course: selectedCourseData?.title || "Unknown",
          gender: formData.gender,
          age: formData.age,
          utm_source: urlParams.get("utm_source") || "direct",
          short_code: shortCode || "none",
        })

        // Track to our Supabase analytics
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
            utm_content: urlParams.get("utm_content"),
            utm_term: urlParams.get("utm_term"),
            short_code: shortCode,
            session_id: localStorage.getItem("session_id"),
            course_slug: selectedCourseData?.slug,
            course_title: selectedCourseData?.title,
            gender: formData.gender, // Added gender
            age: formData.age ? Number.parseInt(formData.age) : undefined, // Added age
          }),
        }).catch(console.error)

        setSubmitSuccess(true)
        setRedirectCountdown(3)
      } else {
        alert("Xatolik yuz berdi: " + (data.error || "Iltimos qaytadan urinib ko'ring."))
      }
    } catch (error) {
      console.error("[v0] Submit error:", error)
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitSuccess(false)
    setSelectedCourse(null)
    setFormData({
      name: "",
      phone: "",
      age: "",
      gender: "",
      country: "",
      level: "",
      contactMethod: "",
      whatsapp: "",
      telegram: "",
      phoneCountry: "UZ", // Reset to default
      whatsappCountry: "UZ",
      hasWhatsApp: true,
    })
    setFormStep(1)
    setRedirectCountdown(0)
  }

  // Filtered countries for dropdowns
  const filteredCountries = countriesWithCodes.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))

  const filteredPhoneCountries = countriesWithCodes.filter(
    (c) => c.name.toLowerCase().includes(phoneCountrySearch.toLowerCase()) || c.phoneCode.includes(phoneCountrySearch),
  )

  const filteredWhatsAppCountries = countriesWithCodes.filter(
    (c) =>
      c.name.toLowerCase().includes(whatsappCountrySearch.toLowerCase()) || c.phoneCode.includes(whatsappCountrySearch),
  )

  // Loading state
  if (isLoadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Darsliklar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // Course detail view
  if (selectedCourse && selectedCourseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 pb-20">
        {/* Decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Updated success modal */}
        {submitSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative max-w-md w-full rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg animate-pulse">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>

              <h3 className="mb-3 text-center text-2xl font-bold text-gray-900">Tabriklaymiz!</h3>
              <p className="mb-6 text-center text-gray-600">
                Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Tez orada siz bilan bog'lanamiz.
              </p>

              {redirectCountdown > 0 && (
                <div className="space-y-4">
                  {/* Progress circle */}
                  <div className="flex justify-center">
                    <div className="relative h-24 w-24">
                      {/* Background circle */}
                      <svg className="absolute inset-0 h-24 w-24 -rotate-90 transform">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-gray-200"
                        />
                        {/* Progress circle with animation */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - (4 - redirectCountdown) / 3)}`}
                          className="text-emerald-500 transition-all duration-1000 ease-linear"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Countdown number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-emerald-600">{redirectCountdown}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status text */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-1">Kutib turing...</p>
                    <p className="text-xs text-gray-500">Sizni guruhga yo'naltiryapmiz</p>
                  </div>

                  {/* Animated dots */}
                  <div className="flex justify-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navbar - glass effect */}
        <nav className="fixed left-0 right-0 top-0 z-50 bg-emerald-900/30 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Orqaga</span>
            </button>
            {/* Kurs ichidagi navbar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/muhib-logo.png" alt="Muhib Academy" className="h-7 sm:h-8 md:h-9 brightness-0 invert" />
            </div>
            <div className="w-16 sm:w-20" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-3 sm:px-4 md:px-6 pt-20 sm:pt-24 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
            {/* Left Column - Course Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Course Header - glass card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 sm:p-6 border border-white/20">
                <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-yellow-400 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-gray-900">
                  <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />3 ta dars BEPUL
                </div>
                <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {selectedCourseData.title}
                </h1>
                <p className="mb-3 sm:mb-4 text-sm sm:text-base text-white/80 leading-relaxed">
                  {selectedCourseData.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {selectedCourseData.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {selectedCourseData.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-300 font-bold">{selectedCourseData.rating}</span>
                    <span className="text-white/60">({selectedCourseData.reviews} sharh)</span>
                  </span>
                </div>
              </div>

              {/* Video - glass card */}
              {selectedCourseData.videoUrl && (
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-3 sm:p-4 border border-white/20 overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden rounded-xl">
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

              {/* Features - glass card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 sm:p-6 border border-white/20">
                <h3 className="mb-3 sm:mb-4 font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                  Kursda nimalar bor
                </h3>
                <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                  {(selectedCourseData.features || []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-yellow-300 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor - glass card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 sm:p-6 border border-white/20">
                <h3 className="mb-3 sm:mb-4 flex items-center gap-2 font-bold text-white text-sm sm:text-base">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                  Ustoz haqida
                </h3>
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={selectedCourseData.instructor?.image || "/placeholder.svg?height=80&width=80"}
                    alt={selectedCourseData.instructor?.name}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover shadow-md ring-2 ring-yellow-300/50"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">{selectedCourseData.instructor?.name}</h4>
                    <p className="text-xs sm:text-sm text-yellow-300">{selectedCourseData.instructor?.title}</p>
                    <div className="mt-1.5 sm:mt-2 flex gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {selectedCourseData.instructor?.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {selectedCourseData.instructor?.students}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials - glass card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 sm:p-6 border border-white/20">
                <h3 className="mb-3 sm:mb-4 flex items-center gap-2 font-bold text-white text-sm sm:text-base">
                  <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                  O'quvchilar fikri
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {(selectedCourseData.testimonials || []).map((t: any, idx: number) => (
                    <div key={idx} className="rounded-xl bg-white/10 p-3 sm:p-4 border border-white/10">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm">{t.name}</div>
                          <div className="text-[10px] sm:text-xs text-white/60">{t.age} yosh</div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm italic text-white/80">"{t.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Enrollment Form */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <form
                id="enrollment-form"
                onSubmit={async (e) => {
                  e.preventDefault()
                  console.log("[v0] Form submitted")
                  await handleSubmit()
                }}
                className="rounded-xl bg-white/95 backdrop-blur-sm p-4 sm:p-5 md:p-6 shadow-xl border border-emerald-100"
              >
                {/* Form Header */}
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">
                    <Gift className="h-3 w-3" />
                    BUGUN BEPUL!
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {formStep === 1 && "1-qadam: Ma'lumotlaringiz"}
                    {formStep === 2 && "2-qadam: Davlat va daraja"}
                    {formStep === 3 && "3-qadam: Bog'lanish"}
                  </h3>
                  <p className="text-xs text-gray-600">3 daqiqada ro'yxatdan o'ting</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        step <= formStep ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Step 1: Personal Info - ULTRA COMPACT */}
                {formStep === 1 && (
                  <div className="space-y-2">
                    {/* Name */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Ismingiz</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ism va familiya"
                        className={`h-9 w-full rounded-lg border-2 px-3 text-xs transition-all focus:outline-none focus:border-emerald-500 ${
                          errors.name ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-emerald-300"
                        }`}
                      />
                      {errors.name && <p className="mt-0.5 text-[10px] text-red-600">{errors.name}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Telefon raqamingiz</label>
                      <div className="flex gap-1.5">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowPhoneCountryDropdown(!showPhoneCountryDropdown)}
                            className="flex h-9 w-16 items-center justify-center gap-0.5 rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-all"
                          >
                            <span className="text-sm">
                              {countriesWithCodes.find((c) => c.code === formData.phoneCountry)?.flag}
                            </span>
                            <ChevronDown className="h-3 w-3 text-gray-400" />
                          </button>
                          {showPhoneCountryDropdown && (
                            <div className="absolute left-0 top-full z-50 mt-1 max-h-36 w-56 overflow-auto rounded-lg border-2 border-gray-200 bg-white shadow-xl">
                              <input
                                type="text"
                                placeholder="Qidirish..."
                                value={phoneCountrySearch}
                                onChange={(e) => setPhoneCountrySearch(e.target.value)}
                                className="sticky top-0 w-full border-b border-gray-100 bg-white px-2 py-1 text-[10px] focus:outline-none"
                              />
                              {filteredPhoneCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, phoneCountry: country.code }))
                                    setShowPhoneCountryDropdown(false)
                                    setPhoneCountrySearch("")
                                  }}
                                  className="flex w-full items-center gap-1 px-2 py-1 text-left text-[10px] hover:bg-emerald-50 transition-colors"
                                >
                                  <span className="text-sm">{country.flag}</span>
                                  <span className="flex-1 truncate text-[10px]">{country.name}</span>
                                  <span className="text-[9px] text-gray-500">{country.phoneCode}</span>
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
                          placeholder={`${getPhoneLength(formData.phoneCountry)} ta raqam`}
                          className={`h-9 flex-1 rounded-lg border-2 px-2.5 text-xs transition-all focus:outline-none focus:border-emerald-500 ${
                            errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-emerald-300"
                          }`}
                          maxLength={getPhoneLength(formData.phoneCountry)}
                        />
                      </div>
                      {errors.phone && <p className="mt-0.5 text-[10px] text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Age and Gender - ULTRA COMPACT */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">Yoshingiz</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="25"
                          className={`h-9 w-full rounded-lg border-2 px-2.5 text-xs transition-all focus:outline-none focus:border-emerald-500 ${
                            errors.age ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-emerald-300"
                          }`}
                        />
                        {errors.age && <p className="mt-0.5 text-[10px] text-red-600">{errors.age}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">Jinsingiz</label>
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, gender: "54" }))}
                            className={`h-9 rounded-lg border-2 text-[10px] font-medium transition-all ${
                              formData.gender === "54"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-gray-200 hover:border-emerald-300"
                            }`}
                          >
                            Erkak
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, gender: "56" }))}
                            className={`h-9 rounded-lg border-2 text-[10px] font-medium transition-all ${
                              formData.gender === "56"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-gray-200 hover:border-emerald-300"
                            }`}
                          >
                            Ayol
                          </button>
                        </div>
                        {errors.gender && <p className="mt-0.5 text-[10px] text-red-600">{errors.gender}</p>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2.5 text-xs font-bold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      Davom etish
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <p className="text-center text-[9px] text-gray-400">Ma'lumotlaringiz 100% himoyalangan</p>
                  </div>
                )}

                {/* Step 2: Location & Level - ULTRA COMPACT */}
                {formStep === 2 && (
                  <div className="space-y-2">
                    {/* Country */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Qaysi davlatdasiz?</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className={`flex h-9 w-full items-center justify-between rounded-lg border-2 px-2.5 text-left transition-all ${
                            errors.country ? "border-red-300" : "border-gray-200 hover:border-emerald-300"
                          }`}
                        >
                          <span className={`text-xs ${formData.country ? "text-gray-900" : "text-gray-400"}`}>
                            {formData.country
                              ? countriesWithCodes.find((c) => c.code === formData.country)?.flag +
                                " " +
                                countriesWithCodes.find((c) => c.code === formData.country)?.name
                              : "Davlatni tanlang"}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-36 overflow-auto rounded-lg border-2 border-gray-200 bg-white shadow-xl">
                            <input
                              type="text"
                              placeholder="Qidirish..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="sticky top-0 w-full border-b border-gray-100 bg-white px-2.5 py-1.5 text-[10px] focus:outline-none"
                            />
                            {filteredCountries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, country: country.code }))
                                  setShowCountryDropdown(false)
                                  setCountrySearch("")
                                }}
                                className="flex w-full items-center gap-1.5 px-2.5 py-1 text-left text-xs hover:bg-emerald-50 transition-colors"
                              >
                                <span className="text-base">{country.flag}</span>
                                <span className="text-[10px]">{country.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.country && <p className="mt-0.5 text-[10px] text-red-600">{errors.country}</p>}
                    </div>

                    {/* Level */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Qur'on o'qish darajangiz</label>
                      <div className="space-y-1">
                        {[
                          { value: "44", label: "Bilmayman" },
                          { value: "46", label: "Harflarni taniyman" },
                          { value: "48", label: "O'qiyman, qiynalaman" },
                          { value: "50", label: "O'qiyman, xatolarim bor" },
                          { value: "52", label: "To'g'ri o'qiy olaman" },
                        ].map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, level: level.value }))}
                            className={`w-full rounded-lg border-2 p-2 text-left text-[10px] transition-all ${
                              formData.level === level.value
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                                : "border-gray-200 hover:border-emerald-300"
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                      {errors.level && <p className="mt-0.5 text-[10px] text-red-600">{errors.level}</p>}
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 rounded-lg border-2 border-gray-200 px-2.5 py-2 text-[10px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Orqaga
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-[2] rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs font-bold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-1.5"
                      >
                        Davom etish
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Method - ULTRA COMPACT */}
                {formStep === 3 && (
                  <div className="space-y-2">
                    {/* Contact Method Preference */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Bog'lanish usuli</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { value: "58", label: "Telefon", icon: Phone },
                          { value: "60", label: "WhatsApp", icon: MessageCircle },
                          { value: "62", label: "Telegram", icon: Send },
                        ].map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, contactMethod: method.value }))
                              if (errors.contactMethod) setErrors((prev) => ({ ...prev, contactMethod: "" }))
                            }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                              formData.contactMethod === method.value
                                ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                                : "border-gray-200 hover:border-emerald-300"
                            }`}
                          >
                            <method.icon className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-medium">{method.label}</span>
                          </button>
                        ))}
                      </div>
                      {errors.contactMethod && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.contactMethod}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="noWhatsApp"
                        checked={!formData.hasWhatsApp}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            hasWhatsApp: !e.target.checked,
                            whatsapp: e.target.checked ? "" : prev.whatsapp, // Clear whatsapp if checkbox is checked
                          }))
                          if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: "" }))
                        }}
                        className="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label htmlFor="noWhatsApp" className="text-[10px] text-gray-600">
                        WhatsApp yo'q
                      </label>
                    </div>

                    {formData.hasWhatsApp && (
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">WhatsApp raqami</label>
                        <div className="flex gap-1">
                          {/* Country code selector for WhatsApp */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowWhatsAppCountryDropdown(!showWhatsAppCountryDropdown)}
                              className="h-9 px-2 border border-gray-300 rounded-lg bg-white text-[10px] font-medium flex items-center gap-0.5 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <span className="text-sm">
                                {countriesWithCodes.find((c) => c.code === formData.whatsappCountry)?.flag || "🇺🇿"}
                              </span>
                              <span className="text-[9px]">
                                {countriesWithCodes.find((c) => c.code === formData.whatsappCountry)?.phoneCode ||
                                  "+998"}
                              </span>
                              <ChevronDown className="h-2.5 w-2.5" />
                            </button>

                            {showWhatsAppCountryDropdown && (
                              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-hidden">
                                <input
                                  type="text"
                                  placeholder="Qidirish..."
                                  value={whatsappCountrySearch}
                                  onChange={(e) => setWhatsappCountrySearch(e.target.value)}
                                  className="w-full px-2 py-1 text-[10px] border-b border-gray-200 focus:outline-none"
                                />
                                <div className="overflow-y-auto max-h-32">
                                  {filteredWhatsAppCountries.map((c) => (
                                    <button
                                      key={c.code}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, whatsappCountry: c.code }))
                                        setShowWhatsAppCountryDropdown(false)
                                        setWhatsappCountrySearch("")
                                      }}
                                      className="w-full px-2 py-1 text-left text-[10px] hover:bg-gray-50 flex items-center gap-1"
                                    >
                                      <span>{c.flag}</span>
                                      <span>{c.name}</span>
                                      <span className="text-gray-500">{c.phoneCode}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={handleWhatsAppChange}
                            placeholder="Raqam"
                            className="flex-1 h-9 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                            maxLength={
                              countriesWithCodes.find((c) => c.code === formData.whatsappCountry)?.maxLength || 15
                            }
                          />
                        </div>

                        {/* Copy phone button under WhatsApp input */}
                        <button
                          type="button"
                          onClick={copyPhoneToWhatsApp}
                          className="text-[9px] text-emerald-600 hover:text-emerald-700 underline mt-0.5"
                        >
                          Raqamim bilan bir xil
                        </button>

                        {errors.whatsapp && <p className="text-[10px] text-red-600 mt-0.5">{errors.whatsapp}</p>}
                      </div>
                    )}

                    {/* Telegram Input */}
                    <div>
                      <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                        <Send className="h-3 w-3 text-blue-500" />
                        Telegram username <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs">
                          @
                        </span>
                        <input
                          type="text"
                          name="telegram"
                          value={formData.telegram}
                          onChange={handleChange}
                          placeholder="username"
                          className={`h-9 w-full rounded-lg border-2 pl-7 pr-2.5 text-xs transition-all focus:outline-none focus:border-emerald-500 ${
                            errors.telegram ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-emerald-300"
                          }`}
                        />
                      </div>
                      {errors.telegram && <p className="mt-0.5 text-[10px] text-red-600">{errors.telegram}</p>}
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 rounded-lg border-2 border-gray-200 px-2.5 py-2 text-[10px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Orqaga
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs font-bold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isSubmitting ? "Yuborilmoqda..." : "Guruhga qo'shilish"}
                        {!isSubmitting && <Send className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <p className="text-center text-[9px] text-gray-400">
                      3 soniyadan keyin Telegram guruhga yo'naltirilish
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 via-transparent to-transparent blur-xl" />
          <div className="relative border-t-2 border-yellow-400 bg-gradient-to-r from-white via-yellow-50/80 to-white p-2 sm:p-2.5 md:p-4 shadow-2xl backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4">
              {/* Home button */}
              <a
                href="/"
                className="flex-shrink-0 flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
              >
                <Home className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
              </a>

              {/* Text content */}
              <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex-shrink-0 hidden sm:flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-yellow-400 text-yellow-900">
                  <Gift className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-bold text-gray-800 truncate">
                    3 ta BEPUL darsga yoziling!
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                    Hech qanday to'lov talab qilinmaydi
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={() => {
                  document.getElementById("enrollment-form")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="flex-shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-bold text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-1 sm:gap-1.5"
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                <span className="sm:hidden">BOSHLASH</span>
                <span className="hidden sm:inline">BEPUL BOSHLASH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Courses list view - Green gradient design
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 pb-20">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-28">
        {/* Navbar */}
        <nav className="absolute left-0 right-0 top-0 z-50 px-3 sm:px-4 py-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/muhib-logo.png" alt="Muhib Academy" className="h-8 sm:h-10 brightness-0 invert" />
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
              <a href="/" className="hover:text-white transition-colors">
                Bosh sahifa
              </a>
              <a href="/darsliklar" className="text-yellow-300 font-bold">
                Darsliklar
              </a>
            </div>
          </div>
        </nav>

        <div className="container relative z-10 mx-auto max-w-3xl text-center pt-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-900">
            <Gift className="h-4 w-4" />3 ta dars BEPUL
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">2 oyda Qur'on o'qishni o'rganing</h1>
          <p className="mb-8 text-lg text-white/90 max-w-xl mx-auto">
            Professional ustozlar bilan, qulay vaqtda, istalgan joydan ta'lim oling
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-lg font-bold text-gray-900 shadow-lg hover:bg-yellow-300 transition-all"
            >
              <Play className="h-5 w-5" />
              BEPUL boshlash
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">1000+</div>
              <div className="text-sm text-white/70">O'quvchilar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">4.9</div>
              <div className="text-sm text-white/70">Reyting</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">10+</div>
              <div className="text-sm text-white/70">Yil tajriba</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Free Section - Glass card */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">Nega 3 ta dars BEPUL?</h2>
          <p className="mb-8 text-white/80 max-w-2xl mx-auto">
            Biz o'z sifatimizga ishonchimiz komil. Shuning uchun sizga sinash imkoniyatini beramiz
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
              <div className="mb-4 mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-400">
                <Gift className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="mb-2 font-bold text-white">3 ta dars bepul</h3>
              <p className="text-sm text-white/70">Hech qanday to'lov talab qilinmaydi</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
              <div className="mb-4 mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-400">
                <Shield className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="mb-2 font-bold text-white">100% kafolat</h3>
              <p className="text-sm text-white/70">Yoqmasa — hech narsa yo'qotmaysiz</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
              <div className="mb-4 mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-400">
                <Award className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="mb-2 font-bold text-white">Professional ustozlar</h3>
              <p className="text-sm text-white/70">10+ yillik tajribaga ega mutaxassislar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid - White cards on green bg */}
      <section id="courses" className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-white">Darsliklar</h2>
            <p className="text-white/80 max-w-xl mx-auto">O'zingizga mos kursni tanlang va bugun BEPUL boshlang!</p>
          </div>

          {/* Course Cards - Improved mobile responsiveness */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-3 sm:px-4">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="group cursor-pointer rounded-2xl bg-white p-4 sm:p-6 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
                onClick={() => setSelectedCourse(course.slug)}
              >
                {/* Free Badge */}
                <div className="mb-3 sm:mb-4 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 sm:px-3 py-1 text-xs font-bold text-gray-900">
                  <Gift className="h-3 w-3" />
                  <span className="text-[10px] sm:text-xs">3 ta dars BEPUL</span>
                </div>

                {/* Course Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                  <BookOpen className="h-7 w-7 text-emerald-600" />
                </div>

                {/* Title */}
                <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {course.title}
                </h3>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 line-clamp-2">{course.description}</p>

                {/* Stats */}
                <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-[11px] sm:text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-[11px] sm:text-sm">{course.students}+ o'quvchi</span>
                  </div>
                </div>

                {/* View Button */}
                <button className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all group-hover:from-emerald-600 group-hover:to-emerald-700">
                  <span>Batafsil</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Glass cards */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-white">O'quvchilarimiz fikri</h2>
            <p className="text-white/80">Bizning kurslarimiz haqida ular nima deydi</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Aziza K.",
                age: 28,
                text: "2 oyda Qur'on o'qishni o'rgandim! Ustozlar juda sabr-toqatli va professional.",
                rating: 5,
              },
              {
                name: "Muhammad R.",
                age: 35,
                text: "Eng yaxshi tanlov! Oilam bilan birga o'qiyapmiz. Darslar juda tushunarli.",
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center text-lg font-bold text-gray-900">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-sm text-white/70">{t.age} yosh</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Yellow card */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-3xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 p-8 text-center shadow-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-yellow-300">
              <Gift className="h-4 w-4" />3 ta dars BEPUL
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Hoziroq boshlang!</h2>
            <p className="mb-6 text-gray-700">Hech narsa yo'qotmaysiz — 3 ta bepul darsdan keyin qaror qilasiz!</p>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-4 font-bold text-yellow-300 shadow-lg hover:bg-gray-800 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              BEPUL boshlash
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Transparent */}
      <footer className="border-t border-white/10 bg-emerald-900/30 backdrop-blur-sm px-4 py-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            <img src="/muhib-logo.png" alt="Muhib Academy" className="h-8 sm:h-10 brightness-0 invert" />
          </div>
          <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-white/70">Qur'on va Arab tili ta'limida yetakchi markaz</p>
          <p className="text-sm text-white/50">© 2026 Muhib Academy. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 via-transparent to-transparent blur-xl" />
        <div className="relative border-t-2 border-yellow-400 bg-gradient-to-r from-white via-yellow-50/80 to-white p-2.5 shadow-2xl backdrop-blur-sm md:p-4">
          <div className="container mx-auto flex items-center justify-between gap-2 md:gap-4">
            <div className="flex flex-1 items-center gap-2 md:gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg">
                  <Gift className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-xs md:text-sm font-bold text-gray-900 truncate">
                    3 ta BEPUL darsga yoziling!
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 truncate hidden sm:block">
                  Hech qanday to'lov talab qilinmaydi
                </p>
              </div>
            </div>
            <a
              href="#courses"
              className="flex-shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="sm:hidden">BOSHLASH</span>
              <span className="hidden sm:inline">BEPUL BOSHLASH</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
