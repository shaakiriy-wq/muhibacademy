"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  Shield,
  Users,
  CheckCircle2,
  Star,
  Sparkles,
  GraduationCap,
  BadgeCheck,
  Home,
  Lightbulb,
  Menu,
  X,
  HelpCircle,
  ChevronDown,
  Award,
  BookOpen,
  Video,
  Headphones,
  Gift,
} from "lucide-react"
import { useRouter } from "next/navigation"
import SuccessModal from "@/components/success-modal" // Assuming SuccessModal is in this path
import GrainOverlay from "@/components/grain-overlay"
import { track } from "@vercel/analytics"

// Helper function to capture UTM parameters (needs implementation)
const captureUTM = () => {
  const params = new URLSearchParams(window.location.search)
  const utmData = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  }
  // Store utmData, e.g., in localStorage
  localStorage.setItem("utmData", JSON.stringify(utmData))

  if (typeof window !== "undefined" && (window as any).gtag) {
    const hasUtm = Object.values(utmData).some((val) => val !== null && val !== "")
    if (hasUtm) {
      ;(window as any).gtag("event", "page_view_with_utm", {
        utm_source: utmData.utm_source || "(not set)",
        utm_medium: utmData.utm_medium || "(not set)",
        utm_campaign: utmData.utm_campaign || "(not set)",
        utm_term: utmData.utm_term || "(not set)",
        utm_content: utmData.utm_content || "(not set)",
      })
    }
  }
}

// Helper function to get stored UTM data (needs implementation)
// This is a local implementation, separate from the imported one
const getStoredUTM = () => {
  const data = localStorage.getItem("utmData")
  return data ? JSON.parse(data) : {}
}

const trackEvent = async (eventType: string, eventName: string, metadata: any = {}) => {
  try {
    const utmData = getStoredUTM()
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        event_name: eventName,
        ...utmData,
        page_url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        metadata,
      }),
    })
  } catch (error) {
    console.error("[v0] Analytics tracking error:", error)
  }
}

function PageLoadConfetti() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => setShow(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            backgroundColor: ["#10b981", "#059669", "#fbbf24", "#f59e0b", "#ef4444", "#3b82f6"][
              Math.floor(Math.random() * 6)
            ],
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("bosh")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [telegramValidation, setTelegramValidation] = useState<{
    status: "idle" | "checking" | "valid" | "invalid"
    message?: string
  }>({ status: "idle" })

  // New state for multi-step form
  const [formStep, setFormStep] = useState(1)
  const [selectedService, setSelectedService] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [whatsappError, setWhatsappError] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false) // Added for new form success message

  // Initialize formData with all potential fields, including new ones
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactMethod: "", // Renamed from original formData.contactMethod for clarity
    whatsappNumber: "",
    telegramUsername: "",
    // New fields for the form
    sourceWhere: "",
    // UF_CRM_1756745905172: Adding new form state for service type and conditional fields
    serviceType: "", // UF_CRM_1756745905172
    country: "",
    level: "", // Renamed from original formData.level
    direction: "", // Added for university service type
    description: "", // Renamed from original formData.description
    lastEntryDate: "", // Added for residence permit
    age: "", // Added age field for all service types
    hasDeportCode: "", // Added for visa/deport
    deportCode: "", // Added for visa/deport
    deportDate: "", // Added for visa/deport
    honeypot: "", // Assuming 'description' maps to 'comments' in backend - this seems like a typo. Assuming it's a honeypot field.
    // New fields for the form
    startSemester: "",
    budget: "",
    city: "",
    additionalInfo: "",
    residenceType: "",
    applicationType: "",
    documentsStatus: "",
    deportPeriod: "",
    // Added for the new form section
    course: "", // For course selection
  })
  const [contactMethod, setContactMethod] = useState("") // Separate state for contactMethod
  const [showDetailed, setShowDetailed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // New state for submission status
  const [showSuccessModal, setShowSuccessModal] = useState(false) // New state for success modal

  useEffect(() => {
    captureUTM()

    const utmData = getStoredUTM()
    track("page_view", {
      page: "landing",
      utm_source: utmData.utm_source || "direct",
      utm_medium: utmData.utm_medium || "none",
      utm_campaign: utmData.utm_campaign || "none",
    })

    trackEvent("page_view", "Landing Page View", {
      path: window.location.pathname,
    })
  }, [])

  useEffect(() => {
    // Lock scroll position immediately
    const scrollY = window.scrollY
    window.scrollTo(0, 0)

    // Create confetti without affecting body overflow
    const createConfetti = () => {
      const confettiContainer = document.createElement("div")
      confettiContainer.className = "fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      confettiContainer.id = "hero-confetti"
      document.body.appendChild(confettiContainer)

      const colors = ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0", "#fbbf24", "#f59e0b"]
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "confetti-particle"
        particle.style.left = `${Math.random() * 100}%`
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.animationDuration = `${2 + Math.random() * 2}s`
        particle.style.animationDelay = `${Math.random() * 0.5}s`
        confettiContainer.appendChild(particle)
      }

      // Remove confetti after animation completes
      setTimeout(() => {
        confettiContainer.remove()
      }, 4000)
    }

    createConfetti()
  }, [])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const promoSection = document.getElementById("maxsus-aksiya")
  //     if (promoSection) {
  //       promoSection.scrollIntoView({ behavior: "smooth", block: "center" })
  //     }
  //   }, 2000)

  //   return () => clearTimeout(timer)
  // }, [])

  useEffect(() => {
    setIsVisible(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = [
            "bosh",
            "muammo",
            "yechim",
            "jamoa",
            "jarayon",
            "taqqoslash",
            "sharhlar",
            "hamkorlar",
            "savol",
          ]
          const scrollPosition = window.scrollY + 150

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId)
            if (element) {
              const { offsetTop, offsetHeight } = element
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(sectionId)
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
      setMobileMenuOpen(false)

      // Track navigation click
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "navigation_click", {
          section: sectionId,
          ...getStoredUTM(),
        })
      }
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s+()-]/g, "")
    setFormData({ ...formData, phone: value })
    setPhoneError(false)

    const digitsOnly = value.replace(/\D/g, "")
    if (digitsOnly.length >= 9) {
      setShowServiceModal(true)
    }
  }

  const handleContactMethodChange = (method: string) => {
    setContactMethod(method) // Use separate state
    setFormData({ ...formData, contactMethod: method }) // Keep in formData for submission if needed
  }

  const handleSameAsPhone = () => {
    setFormData({ ...formData, whatsappNumber: formData.phone })
  }

  // Telegram validation useEffect ni o'chirish
  // useEffect(() => {
  //   const validateTelegramUsername = async (username: string) => {
  //     if (username.length < 5) {
  //       setTelegramValidation({ status: "idle" })
  //       return
  //     }

  //     setTelegramValidation({ status: "checking" })

  //     try {
  //       // Check if username exists on Telegram
  //       const response = await fetch(`https://t.me/${username}`, { method: "HEAD", mode: "no-cors" })
  //       // Since we can't get actual response with no-cors, we'll use a timeout-based check
  //       setTimeout(() => {
  //         setTelegramValidation({
  //           status: "valid",
  //           message: "Username tasdiqlandi",
  //         })
  //       }, 500)
  //     } catch {
  //       setTelegramValidation({
  //         status: "invalid",
  //         message: "Bu username Telegram da topilmadi",
  //       })
  //     }
  //   }

  //   const timeoutId = setTimeout(() => {
  //     if (formData.telegramUsername && contactMethod === "telegram") {
  //       validateTelegramUsername(formData.telegramUsername)
  //     }
  //   }, 1000)

  //   return () => clearTimeout(timeoutId)
  // }, [formData.telegramUsername, contactMethod])

  // Handler for the new form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear success message if user starts typing again
    if (name === "name" || name === "phone" || name === "course") {
      setSubmitSuccess(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false) // Clear previous success message

    try {
      // Get UTM data
      const utmData = getStoredUTM()

      await trackEvent("form_interaction", "Form Submission Started", {
        service_type: formData.serviceType,
        step: formStep,
      })

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "form_submission_started", {
          service_type: formData.serviceType,
          contact_method: contactMethod,
          ...utmData,
        })
      }

      const capitalizedContactMethod =
        contactMethod === "whatsapp" ? "WhatsApp" : contactMethod === "telegram" ? "Telegram" : contactMethod

      // Prepare payload with correct field names matching API route
      const payload = {
        name: formData.name,
        phone: formData.phone,
        sourceWhere: formData.sourceWhere,
        contactMethod: capitalizedContactMethod, // WhatsApp or Telegram (kapitalizatsiya qilingan)
        whatsappNumber: contactMethod === "whatsapp" ? formData.whatsappNumber : undefined,
        telegramUsername: contactMethod === "telegram" ? formData.telegramUsername : undefined,
        serviceType: formData.serviceType,
        honeypot: formData.honeypot,
        // University fields
        country: formData.country,
        startSemester: formData.startSemester,
        level: formData.level,
        budget: formData.budget,
        age: formData.age,
        additionalInfo: formData.additionalInfo,
        // Residence fields
        residenceType: formData.residenceType,
        applicationType: formData.applicationType,
        documentsStatus: formData.documentsStatus,
        lastEntryDate: formData.lastEntryDate,
        // Deport fields
        deportPeriod: formData.deportPeriod,
        hasDeportCode: formData.hasDeportCode,
        deportCode: formData.deportCode,
        deportDate: formData.deportDate,
        // UTM parameters
        ...utmData,
        // New fields for the form submission
        course: formData.course, // Added course
      }

      console.log("[v0] Submitting payload:", payload)

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      console.log("[v0] Response:", data)

      if (data.success) {
        await fetch("/api/form-submission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...utmData,
            service_type: formData.serviceType,
            full_name: formData.name,
            phone: formData.phone,
            whatsapp: formData.whatsappNumber,
            country: formData.country,
            step_completed: 4,
            form_data: payload,
          }),
        })

        await trackEvent("conversion", "Form Submitted Successfully", {
          service_type: formData.serviceType,
          country: formData.country,
        })

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "form_submission_success", {
            service_type: formData.serviceType,
            contact_method: capitalizedContactMethod,
            country: formData.country,
            level: formData.level,
            ...utmData,
          })
        }

        // setShowSuccessModal(true) // Removed for new success message
        setSubmitSuccess(true) // Show success message
        setIsSubmitting(false) // Stop submitting indicator

        // Reset form
        setFormData({
          name: "",
          phone: "",
          contactMethod: "",
          whatsappNumber: "",
          telegramUsername: "",
          serviceType: "",
          sourceWhere: "",
          country: "",
          level: "",
          direction: "", // Reset new field
          description: "",
          lastEntryDate: "", // Reset new field
          age: "", // Reset new field
          hasDeportCode: "", // Reset new field
          deportCode: "", // Reset new field
          deportDate: "", // Reset new field
          honeypot: "",
          // Reset new fields
          startSemester: "",
          budget: "",
          city: "",
          additionalInfo: "",
          residenceType: "",
          applicationType: "",
          documentsStatus: "",
          deportPeriod: "",
          course: "", // Reset new course field
        })
        setContactMethod("") // Reset contact method state
        setShowDetailed(false) // Assuming this was intended to hide detailed fields after submission
        setShowServiceModal(false) // Close modal after submission
        setTelegramValidation({ status: "idle" }) // Reset telegram validation state
        setFormStep(1) // Reset form to the first step
        setPhoneError(false) // Reset phone error state
      } else {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "form_submission_error", {
            error: data.error,
            ...utmData,
          })
        }
        console.error("[v0] Server error:", data)
        alert(`Xatolik: ${data.error || "Noma'lum xatolik"}`)
      }
    } catch (error) {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "form_submission_failed", {
          error: error instanceof Error ? error.message : "Unknown error",
          ...getStoredUTM(),
        })
      }
      console.error("[v0] Submit error:", error)
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: "Qur'on o'qishni qancha vaqtda o'rganish mumkin?",
      answer:
        "O'rtacha 2-3 oyda asosiy ko'nikmalarni o'zlashtirish mumkin. Bu o'quvchining darajasi va harakatiga bog'liq.",
    },
    {
      question: "Darslar qanday o'tkaziladi?",
      answer: "Darslar Zoom platformasi orqali jonli o'tkaziladi. Video darslar arxivi ham mavjud.",
    },
    {
      question: "Qanday to'lov tizimi?",
      answer: "Oylik to'lov tizimi. Birinchi dars bepul sinov darsi.",
    },
    {
      question: "Qanday materiallar taqdim etiladi?",
      answer: "Barcha kerakli materiallar raqamli shaklda taqdim etiladi va doimiy qo'llab-quvvatlash mavjud.",
    },
    {
      question: "Individual darslar mavjudmi?",
      answer: "Ha, individual darslar ham, guruh darslari ham mavjud. O'quvchining ehtiyojiga qarab tanlash mumkin.",
    },
  ]

  const navItems = [
    { id: "bosh", label: "Bosh sahifa", icon: Home },
    { id: "haqida", label: "Biz haqimizda", icon: Users },
    { id: "afzalliklar", label: "Afzalliklar", icon: Lightbulb },
    { id: "sharhlar", label: "Sharhlar", icon: Star },
    { id: "savol", label: "Savollar", icon: HelpCircle },
    { id: "darsliklar", label: "Ro'yxatdan o'tish", icon: BookOpen, isExternal: true, href: "/darsliklar" },
  ]

  const testimonials = [
    {
      name: "Aziza Karimova",
      uni: "O'quvchi",
      text: "Muhib Academy yordamida 3 oyda Qur'on o'qishni o'rgandim. O'qituvchilar juda malakali va sabrli.",
      savings: "",
    },
    {
      name: "Muhammad Rahimov",
      uni: "O'quvchi",
      text: "Arab tilini o'rganishda katta yordam berdi. Zamonaviy usullar va sifatli materiallar.",
      savings: "",
    },
    {
      name: "Fatima Yusupova",
      uni: "O'quvchi",
      text: "O'z vaqtimda ta'lim olish imkoniyati berdi. Natijalar juda yaxshi.",
      savings: "",
    },
    {
      name: "Abdulloh Toshmatov",
      uni: "O'quvchi",
      text: "Professional yondashuv va individual e'tibor. Tavsiya etaman!",
      savings: "",
    },
    {
      name: "Zuhra Karimova",
      uni: "O'quvchi",
      text: "Qur'on o'qishni o'rganishda eng yaxshi akademiya. Rahmat!",
      savings: "",
    },
  ]

  const isValidPhoneFormat = (phone: string): boolean => {
    // Check if phone starts with + and has country code
    if (!phone.startsWith("+")) return false

    // Extract digits only
    const digitsOnly = phone.replace(/\D/g, "")

    // Require at least 10 digits (country code + number)
    return digitsOnly.length >= 10
  }

  const handleDarslarClick = () => {
    window.location.href = "/darsliklar"
  }

  return (
    <>
      <PageLoadConfetti />
      <div className="relative min-h-screen bg-white">
        <GrainOverlay />

        {/* Navbar */}
        <nav className="nav-white fixed left-0 right-0 top-0 z-50">
          <div className="mx-auto flex max-w-7xl items-center justify-between bg-slate-50 px-4 py-3">
            <div className="navbar-logo">
              <img src="/muhib-logo.png" alt="Muhib Academy" className="navbar-logo-img h-10 w-auto md:h-12" />
            </div>

            {/* Desktop menu */}
            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.gtag) {
                        window.gtag("event", "navbar_external_link_click", {
                          link_text: item.label,
                          link_url: item.href,
                          ...getStoredUTM(),
                        })
                      }
                    }}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === item.id ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === item.id ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:text-emerald-600 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
              <div className="flex flex-col gap-2">
                {navItems.map((item) =>
                  item.isExternal ? (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        if (typeof window !== "undefined" && window.gtag) {
                          window.gtag("event", "navbar_external_link_click", {
                            link_text: item.label,
                            link_url: item.href,
                            ...getStoredUTM(),
                          })
                        }
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        activeSection === item.id ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        activeSection === item.id ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </nav>

        {/* ============ HERO SECTION ============ */}
        <section id="bosh" className="relative overflow-hidden px-4 pb-12 pt-20 md:px-8 md:pb-20 md:pt-28">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-transparent to-emerald-50/80" />
            <img
              src="/images/gemini-generated-image-4ault94ault94aul.jpeg"
              alt="Muhib Academy - Bepul darslikka qo'shiling"
              className="h-full w-full object-cover object-top opacity-20 md:opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          </div>
          {/* End teacher background */}

          <GrainOverlay />
          <div className="relative z-10 mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-12 items-center">
            {/* Left content */}
            <div className="order-1 lg:order-1 animate-on-scroll animate-fadeInLeft leading-7 tracking-normal mx-0">
              <div className="mb-3 md:mb-4"></div>

              <div className="mb-6 md:mb-8 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-emerald-200/50 aspect-[16/10] md:aspect-[16/9]">
                  <img
                    src="/images/gemini-generated-image-4ault94ault94aul.jpeg"
                    alt="Muhib Academy - Bepul darslikka qo'shiling"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay gradient for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent" />
                </div>
              </div>

              <h1 className="mb-3 text-2xl font-black leading-none tracking-tight text-gray-900 md:mb-4 md:text-3xl lg:text-4xl xl:text-5xl uppercase">
                <span className="block hero-title-main bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-primary">
                  2 OYDA QUR'ON O'QISHNI
                </span>
                <span className="block hero-title-highlight-green mt-1 font-extrabold text-background opacity-100 bg-primary">
                  0 DAN O'RGANING
                </span>
              </h1>

              <p className="mb-4 text-xs text-gray-600 leading-relaxed md:mb-5 md:text-sm lg:text-base max-w-xl font-normal">
                Qulay vaqt va joyda ta'lim oling. Zamonaviy texnologiyalar yordamida sifatli bilim.
              </p>

              <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row md:mt-6 md:gap-4">
                <button
                  onClick={() => {
                    const nextSection = document.getElementById("haqida")
                    nextSection?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 md:text-base"
                >
                  <span>Batafsil ma'lumot</span>
                  <ChevronDown className="h-5 w-5 animate-bounce md:h-6 md:w-6" />
                </button>
              </div>
            </div>

            {/* Right - Hero Card - Equal sizing with left column */}
            <div className="order-2 lg:order-2 animate-on-scroll animate-fadeInRight">
              <div className="hero-card p-5 text-white md:p-6 lg:p-7 relative overflow-hidden promo-super-glow flex flex-col justify-center min-h-[320px] md:min-h-[380px]">
                {/* Animated shining overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent promo-shine-effect" />

                {/* Pulsing rings */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-yellow-300/20 promo-pulse-ring" />
                <div
                  className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-yellow-300/20 promo-pulse-ring"
                  style={{ animationDelay: "1s" }}
                />

                <div className="relative z-10">
                  <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-gray-900 promo-badge-bounce promo-badge-scale shadow-lg">
                    <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 promo-sparkle" />
                    MAXSUS TAKLIF
                  </div>

                  <h2 className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-black promo-main-text">
                    <span className="block text-white">Umra safariga</span>
                    <span className="block mt-2 text-3xl md:text-4xl bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent promo-gradient-text animate-pulse lg:text-4xl">
                      YO'LLANMA SOVG'A!
                    </span>
                  </h2>

                  <p className="mb-4 md:mb-5 text-sm md:text-base text-emerald-50 leading-relaxed">
                    Kursni muvaffaqiyatli tamomlaganlardan 1 nafari Umra safariga yo'llanma oladi!
                  </p>

                  <ul className="mb-4 md:mb-5 space-y-2 md:space-y-2.5">
                    <li className="flex items-center gap-2.5 text-sm md:text-base">
                      <BadgeCheck className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 text-yellow-300 promo-check-icon" />
                      <span>Zoom orqali jonli darslar</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm md:text-base">
                      <BadgeCheck className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 text-yellow-300 promo-check-icon" />
                      <span>Video darslar arxivi</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm md:text-base">
                      <BadgeCheck className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 text-yellow-300 promo-check-icon" />
                      <span>Individual konsultatsiya</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      window.location.href = "/darsliklar"
                      if (typeof window !== "undefined" && window.gtag) {
                        window.gtag("event", "promo_cta_click", {
                          button_text: "HOZIROQ RO'YXATDAN O'TING",
                          promo_year: "2026",
                          ...getStoredUTM(),
                        })
                      }
                    }}
                    className="group relative w-full rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 px-5 py-3 md:px-6 md:py-3.5 text-base md:text-lg font-black text-gray-900 transition-all duration-300 hover:scale-105 shadow-2xl promo-cta-button promo-cta-scale overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent promo-button-shine" />
                    <span className="relative z-10 flex items-center justify-center promo-cta-text leading-7 gap-2.5">
                      <Sparkles className="h-5 w-5 md:h-6 md:w-6 promo-sparkle-2" />
                      RO'YXATDAN O'TISH
                      <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>

                  <p className="mt-3 text-center text-[10px] md:text-xs text-yellow-200 font-semibold promo-urgency">
                    ⏰ Cheklangan o'rinlar mavjud
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700">
          {/* Global decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2" />
            <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          {/* ============ BIZ HAQIMIZDA ============ */}
          <section id="haqida" className="section-container relative overflow-hidden px-4 py-12 md:px-8 md:py-20">
            <GrainOverlay opacity={0.02} />

            <div className="relative z-10 mx-auto max-w-5xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-white border border-white/20 shadow-sm md:mb-6">
                <Users className="h-4 w-4" />
                Biz haqimizda
              </div>

              <h2 className="mb-4 text-3xl font-bold text-white md:mb-6 md:text-4xl lg:text-5xl">
                <span className="text-yellow-300">10 yillik</span> tajriba va ishonch
              </h2>

              <p className="mx-auto max-w-2xl text-base text-white/80 leading-relaxed md:text-lg">
                Bizning akademiyamizda siz Qur'on o'qishni, Arab tilini va Islomiy bilimlarni zamonaviy usullar bilan
                o'rganasiz. Tajribali ustozlar va sifatli ta'lim sizni kutmoqda.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 lg:mt-14">
                <div className="group relative rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">10+ yil</h3>
                  <p className="text-sm text-white/70 leading-relaxed">Qur'on va Islomiy bilimlar ta'limida tajriba</p>
                </div>

                <div className="group relative rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">500+</h3>
                  <p className="text-sm text-white/70 leading-relaxed">Muvaffaqiyatli o'quvchilar</p>
                </div>

                <div className="group relative rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Zamonaviy</h3>
                  <p className="text-sm text-white/70 leading-relaxed">Zoom va video darslar</p>
                </div>

                <div className="group relative rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">100%</h3>
                  <p className="text-sm text-white/70 leading-relaxed">Sertifikatlangan ustozlar</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============ BIZNING AFZALLIKLARIMIZ ============ */}
          <section
            id="afzalliklar"
            className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 px-4 py-12 md:px-8 md:py-20"
          >
            <GrainOverlay opacity={0.03} />

            <div className="container relative z-10 mx-auto max-w-6xl">
              <div className="text-center mb-10 md:mb-14 animate-on-scroll animate-fadeInUp">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-white border border-white/20 md:mb-6">
                  <Shield className="h-4 w-4" />
                  Bizning afzalliklarimiz
                </div>

                <h2 className="mb-4 text-3xl font-bold text-white md:mb-6 md:text-4xl lg:text-5xl">
                  Nega aynan <span className="text-yellow-300">bizning darslar?</span>
                </h2>

                <p className="text-base text-white/80 max-w-xl mx-auto md:text-lg leading-relaxed">
                  Muhib Academy da ta'lim olish sizga ko'plab afzalliklarni taqdim etadi
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3 md:gap-6">
                <div className="group rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 animate-on-scroll animate-scaleIn">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 transition-transform duration-300 group-hover:scale-110">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">Malakali o'qituvchilar</h3>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    10+ yillik tajribaga ega, xalqaro sertifikatli professional ustozlar
                  </p>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-semibold">Tajribali ustozlar</span>
                  </div>
                </div>

                <div
                  className="group rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 animate-on-scroll animate-scaleIn"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 transition-transform duration-300 group-hover:scale-110">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">Zamonaviy texnologiyalar</h3>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    Zoom, video darslar va interaktiv platformalar orqali ta'lim
                  </p>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-semibold">Online ta'lim</span>
                  </div>
                </div>

                <div
                  className="group rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 animate-on-scroll animate-scaleIn"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 transition-transform duration-300 group-hover:scale-110">
                    <Headphones className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">24/7 Qo'llab-quvvatlash</h3>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    Har doim yordam berishga tayyor jamoamiz bor
                  </p>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-semibold">Doimiy yordam</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ SHARHLAR ============ */}
          <section id="sharhlar" className="relative z-10 px-4 py-10 md:px-8 md:py-20">
            <GrainOverlay />
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12 animate-on-scroll animate-fadeInUp">
                <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white border border-white/20 md:px-5 md:py-2 md:text-sm">
                  <Star className="h-4 w-4" />
                  O'quvchilar fikri
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 md:text-4xl md:mb-4">
                  Bizning <span className="text-yellow-300">muvaffaqiyat hikoyalarimiz</span>
                </h2>
                <p className="text-sm text-white/80 max-w-xl mx-auto md:text-base">
                  Minglab o'quvchilar Muhib Academy orqali Qur'on va Arab tilini o'rganishdi
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 animate-on-scroll animate-scaleIn"
                  >
                    <div className="mb-3 flex items-center gap-0.5 md:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 md:h-5 md:w-5" />
                      ))}
                    </div>
                    <p className="mb-3 text-sm text-white/90 md:mb-4 md:text-base">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 md:h-12 md:w-12">
                        <span className="text-base font-bold text-white md:text-lg">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white md:text-base">{testimonial.name}</div>
                        <div className="text-xs text-white/70 md:text-sm">{testimonial.uni}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ FAQ ============ */}
          <section id="savol" className="relative z-10 px-4 py-12 md:px-8 md:py-20">
            <GrainOverlay />
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-8 md:mb-12">
                <span className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white border border-white/20">
                  <HelpCircle className="h-4 w-4" />
                  Savol-javob
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                  Tez-tez <span className="text-yellow-300">so'raladigan savollar</span>
                </h2>
                <p className="text-base text-white/80">Eng ko'p so'raladigan savollar va javoblar</p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border transition-all duration-300 ${
                      openFaq === index
                        ? "border-yellow-300/50 bg-white/20 shadow-lg shadow-yellow-300/10"
                        : "border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex w-full items-center justify-between p-5 md:p-6 text-left"
                    >
                      <span className="pr-4 text-base md:text-lg font-semibold text-white">{faq.question}</span>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          openFaq === index ? "bg-yellow-300 rotate-180" : "bg-white/20"
                        }`}
                      >
                        <ChevronDown className={`h-5 w-5 ${openFaq === index ? "text-emerald-800" : "text-white"}`} />
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="border-t border-white/20 px-5 py-4 md:px-6 md:py-5 bg-white/5">
                        <p className="text-base text-white/90 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ FOOTER ============ */}
          <footer className="relative overflow-hidden px-4 py-8 text-white md:px-8 md:py-12 border-t border-white/10">
            <GrainOverlay />

            {/* Decorative gradient orbs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-teal-400/30 blur-3xl" />

            <div className="relative z-10 mx-auto grid max-w-6xl gap-6 md:grid-cols-4 md:gap-8">
              <div>
                <img src="/muhib-logo.png" alt="Muhib Academy" className="mb-3 h-10 md:mb-4 md:h-12" />
                <p className="text-xs text-white/90 md:text-sm">
                  Qur'on va Arab tili ta'limida 10 yillik tajriba. 2 oyda professional natija.
                </p>
                {/* Social media links */}
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://t.me/muhibacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/muhibacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.163zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/muhibacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-bold text-white md:mb-4 md:text-base">Sahifalar</h4>
                <div className="flex flex-col gap-2 text-xs text-white/80 md:text-sm">
                  <button onClick={() => scrollToSection("bosh")} className="text-left hover:text-white">
                    Bosh sahifa
                  </button>
                  <button onClick={() => scrollToSection("haqida")} className="text-left hover:text-white">
                    Biz haqimizda
                  </button>
                  <button onClick={() => scrollToSection("afzalliklar")} className="text-left hover:text-white">
                    Afzalliklar
                  </button>
                  <button onClick={() => scrollToSection("sharhlar")} className="text-left hover:text-white">
                    Sharhlar
                  </button>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-bold text-white md:mb-4 md:text-base">Darsliklar</h4>
                <div className="flex flex-col gap-2 text-xs text-white/80 md:text-sm">
                  <a href="/darsliklar" className="hover:text-white">
                    Qur'on o'qish
                  </a>
                  <a href="/darsliklar" className="hover:text-white">
                    Arab tili
                  </a>
                  <a href="/darsliklar" className="hover:text-white">
                    Islom asoslari
                  </a>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-bold text-white md:mb-4 md:text-base">Aloqa</h4>
                <div className="flex flex-col gap-2 text-xs text-white/80 md:text-sm">
                  <p>Toshkent shahri, Chilonzor tumani, 1-mavze</p>
                  <p>+905397401555</p>
                  <p>info@muhibacademy.uz</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6 md:mt-12 md:pt-8">
              <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-xs text-white/80 md:text-sm">© 2025 Muhib Academy. Barcha huquqlar himoyalangan</p>
                <p className="text-xs text-white/70 md:text-sm">NURKOM tomonidan ishlab chiqilgan</p>
              </div>
            </div>
          </footer>
        </div>
        {/* End of global gradient background container */}

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message="Arizangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz."
          />
        )}

        {/* Sticky CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Gradient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent blur-xl" />

          <div className="relative border-t-2 border-emerald-400 bg-gradient-to-r from-white via-emerald-50/50 to-white p-2.5 shadow-2xl backdrop-blur-sm md:p-4">
            <div className="container mx-auto flex items-center justify-between gap-2 md:gap-4">
              {/* Left side - Compelling copy with animation */}
              <div className="flex flex-1 items-center gap-2 md:gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 animate-pulse rounded-full bg-emerald-400/30" />
                  <div className="relative rounded-full bg-emerald-500 p-1.5 md:p-2">
                    <Gift className="h-4 w-4 text-white md:h-5 md:w-5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-emerald-800 md:text-sm lg:text-base">
                    3 ta BEPUL darsga yoziling!
                  </p>
                  <p className="hidden text-xs text-emerald-600 sm:block md:text-sm">
                    Hoziroq ro'yxatdan o'ting va bepul darslarga ega bo'ling
                  </p>
                </div>
              </div>

              {/* Right side - CTA button */}
              <a
                href="/darsliklar"
                className="group relative flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-emerald-500/25 md:px-6 md:py-2.5 md:text-sm"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  BEPUL BOSHLASH
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
