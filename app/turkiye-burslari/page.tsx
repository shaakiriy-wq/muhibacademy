"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  GraduationCap,
  Globe,
  HomeIcon,
  Calendar,
  DollarSign,
  Shield,
  Plane,
  Heart,
  Award,
  CheckCircle,
  Send,
  MessageSquare,
  Sparkles,
  BookOpen,
  Target,
  Gift,
  ExternalLink,
  FileCheck,
  Users,
  Loader2,
} from "lucide-react"
import SuccessModal from "@/components/success-modal"
import GrainOverlay from "@/components/grain-overlay"
import Link from "next/link"

// Helper functions
const captureUTM = () => {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const utmData = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  }
  localStorage.setItem("utmData", JSON.stringify(utmData))
  return utmData
}

const getStoredUTM = () => {
  if (typeof window === "undefined") return {}
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

export default function TurkiyeBurslariPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "telegram" | "">("")
  const [whatsappError, setWhatsappError] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsappNumber: "",
    telegramUsername: "",
    sourceWhere: "",
    serviceType: "university", // Avtomatik Universitet
    country: "Turkiya", // Avtomatik Turkiya
    startSemester: "2026-2027 Kuz", // Avtomatik semester bosh sahifadagi format kabi
    level: "",
    age: "",
    additionalInfo: "Turkiye burslari", // Default qiymat
    honeypot: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    captureUTM()
    trackEvent("page_view", "Turkey Scholarship Landing View", {
      path: window.location.pathname,
    })

    const createConfetti = () => {
      const confettiContainer = document.createElement("div")
      confettiContainer.className = "fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      confettiContainer.id = "hero-confetti"
      document.body.appendChild(confettiContainer)

      const colors = ["#10b981", "#059669", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"]
      const particleCount = 60

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "confetti-particle"
        particle.style.left = `${Math.random() * 100}%`
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.animationDuration = `${2 + Math.random() * 2}s`
        particle.style.animationDelay = `${Math.random() * 0.5}s`
        confettiContainer.appendChild(particle)
      }

      setTimeout(() => confettiContainer.remove(), 4000)
    }

    createConfetti()
    setIsVisible(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.honeypot) {
      console.log("[v0] Bot detected")
      return
    }

    if (!contactMethod) {
      alert("Iltimos, bog'lanish usulini tanlang (WhatsApp yoki Telegram)")
      return
    }

    setIsSubmitting(true)

    try {
      const utmData = getStoredUTM()

      await trackEvent("form_interaction", "Turkey Scholarship Form Started", {
        step: formStep,
      })

      const payload = {
        name: formData.name,
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        telegramUsername: formData.telegramUsername,
        sourceWhere: formData.sourceWhere,
        contactMethod: contactMethod === "whatsapp" ? "WhatsApp" : "Telegram", // to'g'ri format
        serviceType: "university", // to'g'ri key
        country: "Turkiya",
        startSemester: formData.startSemester, // Changed to use the state value
        level: formData.level,
        budget: "1000-3000$", // Avtomatik 1000-3000$
        age: formData.age,
        additionalInfo: formData.additionalInfo,
        ...utmData,
      }

      console.log("[v0] Submitting payload:", payload)

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetch("/api/form-submission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...utmData,
            service_type: "Turkiye Burslari - Universitet",
            full_name: formData.name,
            phone: formData.phone,
            country: "Turkiya",
            step_completed: 3,
            form_data: payload,
          }),
        })

        await trackEvent("conversion", "Turkey Scholarship Form Submitted", {
          level: formData.level,
          age: formData.age,
        })

        setShowSuccessModal(true)
        setFormData({
          name: "",
          phone: "",
          whatsappNumber: "",
          telegramUsername: "",
          sourceWhere: "",
          serviceType: "university",
          country: "Turkiya",
          startSemester: "2026-2027 Kuz", // Changed back to the updated default
          level: "",
          age: "",
          additionalInfo: "Turkiye burslari",
          honeypot: "",
        })
        setFormStep(1)
        setContactMethod("")
      } else {
        console.error("[v0] Submission error:", data)
        alert(`Xatolik: ${data.error || "Noma'lum xatolik"}`)
      }
    } catch (error) {
      console.error("[v0] Submit error:", error)
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: DollarSign,
      title: "100% bepul ta'lim",
      description: "To'liq davlat granti - kontrakt to'lash kerak emas",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: HomeIcon,
      title: "Bepul yotoqxona",
      description: "Davlat tomonidan to'liq ta'minlangan yashash joyi",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Calendar,
      title: "1 yil turk tili",
      description: "TÖMER markazida bepul til kursi va sertifikat",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Heart,
      title: "Tibbiy sug'urta",
      description: "To'liq davlat tibbiy sug'urta qoplamasi",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: Plane,
      title: "Aviachiptalar",
      description: "Kelish va ketish uchun bepul aviachiptalar",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: Award,
      title: "Oylik stipendiya",
      description: "4,500 - 9,000 TL oylik stipendiya",
      color: "from-yellow-500 to-orange-600",
    },
  ]

  const universities = [
    "Boğaziçi University",
    "METU (Middle East Technical University)",
    "Istanbul Technical University",
    "Ankara University",
    "Hacettepe University",
    "Koç University",
  ]

  const stats = [
    { number: "100+", label: "Universitetlar", icon: BookOpen },
    { number: "100%", label: "Bepul ta'lim", icon: DollarSign },
    { number: "12", label: "Ta'lim tili", icon: Globe },
    { number: "1 yil", label: "Turk tili kursi", icon: GraduationCap },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <GrainOverlay />

      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-emerald-400 to-green-500 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-8 md:px-6 md:py-20">
        {/* Hero Section */}
        <section className="animate-on-scroll mb-10 text-center md:mb-24">
          <div className="mb-4 flex justify-center md:mb-8">
            <img src="/talimci-logo-with-text.png" alt="Talimci" className="h-8 w-auto md:h-16" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-sm md:mb-8 md:px-6 md:py-3">
            <span className="text-lg md:text-3xl">🇹🇷</span>
            <span className="text-xs font-semibold text-emerald-400 md:text-base">TÜRKIYE BURSLARI 2026</span>
          </div>

          <h1 className="mb-3 text-2xl font-black leading-tight text-white md:mb-6 md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-clip-text text-transparent">
              Turkiyada 100% bepul
            </span>
            <br />
            <span className="text-white">ta'lim olish imkoniyati!</span>
          </h1>

          <p className="mx-auto mb-4 max-w-3xl text-xs leading-relaxed text-white/80 md:mb-8 md:text-lg lg:text-xl">
            Bu shaxsiy fond yoki universitet chegirmasi emas - bu Turkiya davlatining rasmiy stipendiya dasturi! To'liq
            ta'minot, bepul ta'lim va oylik stipendiya bilan o'qish imkoniyati.
          </p>

          <div className="mb-5 flex flex-wrap items-center justify-center gap-2 md:mb-12 md:gap-4">
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 backdrop-blur-sm md:px-6 md:py-3">
              <CheckCircle className="h-4 w-4 text-emerald-400 md:h-6 md:w-6" />
              <span className="text-xs font-medium text-white md:text-base">100% grant</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-3 py-1.5 backdrop-blur-sm md:px-6 md:py-3">
              <CheckCircle className="h-4 w-4 text-blue-400 md:h-6 md:w-6" />
              <span className="text-xs font-medium text-white md:text-base">Imtihonsiz</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-purple-500/20 px-3 py-1.5 backdrop-blur-sm md:px-6 md:py-3">
              <CheckCircle className="h-4 w-4 text-purple-400 md:h-6 md:w-6" />
              <span className="text-xs font-medium text-white md:text-base">Turk tili shart emas</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2.5 md:flex-row md:gap-4">
            <button
              onClick={() => document.getElementById("ariza-forma")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-500/50 transition-all hover:scale-105 hover:shadow-3xl hover:shadow-emerald-500/60 active:scale-95 md:w-auto md:min-h-[56px] md:px-8 md:py-5 md:text-lg"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
              Bepul ariza yuborish
            </button>
            <Link
              href="/"
              className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 active:scale-95 md:w-auto md:min-h-[56px] md:px-8 md:py-5 md:text-lg"
            >
              Bosh sahifaga qaytish
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="animate-on-scroll mb-10 grid grid-cols-2 gap-3 md:mb-24 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="glass-card group rounded-xl p-3 transition-all hover:scale-105 md:rounded-3xl md:p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="mx-auto mb-1.5 h-6 w-6 text-emerald-400 transition-all group-hover:scale-110 md:mb-3 md:h-10 md:w-10" />
                <div className="mb-0.5 text-xl font-black text-white md:text-4xl">{stat.number}</div>
                <div className="text-[10px] text-white/70 md:text-sm">{stat.label}</div>
              </div>
            )
          })}
        </section>

        {/* Benefits Grid */}
        <section className="animate-on-scroll mb-10 md:mb-24">
          <div className="mb-6 text-center md:mb-12">
            <h2 className="mb-2 text-xl font-black text-white md:mb-4 md:text-5xl">
              Grant bo'yicha nima{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                olasiz?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-[11px] text-white/70 md:text-base">
              Türkiye Bursları sizga to'liq ta'minot va barcha qulayliklarni taqdim etadi
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="glass-card group rounded-xl p-4 transition-all hover:scale-105 md:rounded-3xl md:p-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${benefit.color} p-2.5 shadow-xl md:mb-6 md:rounded-2xl md:p-4`}
                  >
                    <Icon className="h-5 w-5 text-white md:h-8 md:w-8" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-white md:mb-3 md:text-xl">{benefit.title}</h3>
                  <p className="text-[11px] leading-relaxed text-white/70 md:text-base">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Universities Section */}
        <section className="animate-on-scroll mb-10 md:mb-24">
          <div className="glass-card rounded-2xl p-4 md:rounded-4xl md:p-12">
            <div className="mb-5 text-center md:mb-8">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 md:mb-4 md:px-6 md:py-3">
                <GraduationCap className="h-4 w-4 text-emerald-400 md:h-6 md:w-6" />
                <span className="text-xs font-semibold text-emerald-400 md:text-base">100+ Universitetlar</span>
              </div>
              <h2 className="mb-2 text-lg font-black text-white md:mb-4 md:text-4xl">
                Top <span className="text-emerald-400">Universitetlar</span>
              </h2>
              <p className="mx-auto max-w-2xl text-[11px] text-white/70 md:text-base">
                Dasturda Turkiyaning eng yaxshi davlat va xususiy universitetlari ishtirok etadi
              </p>
            </div>

            <div className="grid gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {universities.map((uni, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 p-2.5 transition-all hover:border-emerald-400/50 hover:bg-white/10 md:rounded-xl md:p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 md:h-12 md:w-12">
                    <GraduationCap className="h-4 w-4 text-white md:h-6 md:w-6" />
                  </div>
                  <span className="text-[11px] font-medium text-white md:text-base">{uni}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-3 text-center md:mt-8 md:rounded-xl md:p-6">
              <p className="text-[11px] font-medium text-white md:text-base">
                Arizangizda <span className="font-bold text-emerald-400">12 tagacha</span> universitet tanlashingiz
                mumkin!
              </p>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="animate-on-scroll mb-10 md:mb-24">
          <div className="mb-6 text-center md:mb-12">
            <h2 className="mb-2 text-xl font-black text-white md:mb-4 md:text-5xl">
              Kim{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                murojaat
              </span>{" "}
              qilishi mumkin?
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-8">
            <div className="glass-card rounded-2xl p-4 md:rounded-3xl md:p-8">
              <div className="mb-3 inline-flex items-center gap-2 md:mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 md:h-14 md:w-14 md:rounded-xl">
                  <BookOpen className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <span className="text-base font-bold text-white md:text-2xl">Bakalavr</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-white/80 md:space-y-3 md:text-base">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  11-sinf o'quvchilari
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  Maktab/kollej bitiruvchilari
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  21 yoshgacha
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-4 md:rounded-3xl md:p-8">
              <div className="mb-3 inline-flex items-center gap-2 md:mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 md:h-14 md:w-14 md:rounded-xl">
                  <Target className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <span className="text-base font-bold text-white md:text-2xl">Magistratura</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-white/80 md:space-y-3 md:text-base">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  Oxirgi kurs talabalari
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  OTM (oliy ta'lim muassasasi) bitiruvchilari
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  30 yoshgacha
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-4 md:rounded-3xl md:p-8">
              <div className="mb-3 inline-flex items-center gap-2 md:mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 md:h-14 md:w-14 md:rounded-xl">
                  <Award className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <span className="text-base font-bold text-white md:text-2xl">Doktorantura</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-white/80 md:space-y-3 md:text-base">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  Magistr darajasi
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  Ilmiy tadqiqot tajribasi
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
                  35 yoshgacha
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="ariza-forma" className="animate-on-scroll mb-10 md:mb-24">
          <div className="glass-card mx-auto max-w-2xl rounded-2xl p-4 md:rounded-4xl md:p-10">
            <div className="mb-5 text-center md:mb-8">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 md:mb-4 md:px-6 md:py-3">
                <Gift className="h-4 w-4 text-emerald-400 md:h-6 md:w-6" />
                <span className="text-xs font-semibold text-emerald-400 md:text-base">Bepul konsultatsiya</span>
              </div>
              <h2 className="mb-1.5 text-xl font-black text-white md:mb-3 md:text-4xl">Ariza qoldiring</h2>
              <p className="text-xs text-white/70 md:text-base">Mutaxassislarimiz sizga bepul maslahat berishadi</p>
            </div>

            {/* Progress bar */}
            <div className="mb-5 md:mb-8">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-white md:mb-2 md:text-sm">
                <span>{formStep}-qadam</span>
                <span className="text-emerald-400">{formStep}/3</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10 md:h-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${(formStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Step 1: Asosiy ma'lumotlar */}
              {formStep === 1 && (
                <div className="space-y-3 animate-fadeIn md:space-y-5">
                  <div className="text-center mb-2 md:mb-4">
                    <h3 className="text-base font-bold text-white mb-1 md:text-xl">Tanishaylik!</h3>
                    <p className="text-[11px] text-white/70 md:text-sm">Sizning ism va telefon raqamingizni yozing</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      Ismingiz <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:py-3.5 md:text-base"
                      placeholder="Ismingizni kiriting"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      Telefon raqam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:py-3.5 md:text-base"
                      placeholder="+998 XX XXX XX XX"
                    />
                    <p className="mt-1.5 text-[11px] text-white/50 md:mt-2 md:text-sm">
                      + belgisi va davlat kodi bilan kiriting
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.phone) {
                        setFormStep(2)
                      }
                    }}
                    disabled={!formData.name || !formData.phone}
                    className="form-next-button w-full rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none md:py-4 md:text-base"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Davom etish
                      <svg
                        className="w-4 h-4 animate-bounce md:w-5 md:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              )}

              {/* Step 2: Bog'lanish - Skip xizmat tanlash, to'g'ridan-to'g'ri bog'lanish */}
              {formStep === 2 && (
                <div className="space-y-3 animate-fadeIn md:space-y-5">
                  <div className="text-center mb-2 md:mb-4">
                    <h3 className="text-base font-bold text-white mb-1 md:text-xl">Qayerda va qanday bog'lanamiz?</h3>
                    <p className="text-[11px] text-white/70 md:text-sm">Qulay usulni tanlang</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      Qayerdan murojaat qilyapsiz? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sourceWhere}
                      onChange={(e) => setFormData({ ...formData, sourceWhere: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:text-base"
                      placeholder="Masalan: Toshkentdan"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white md:text-base">
                      Bog'lanish usuli <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <button
                        type="button"
                        onClick={() => setContactMethod("whatsapp")}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all md:gap-4 md:p-6 ${
                          contactMethod === "whatsapp"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                            : "border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 md:h-14 md:w-14">
                          <MessageSquare className="h-5 w-5 text-white md:h-7 md:w-7" />
                        </div>
                        <span className="text-sm font-semibold text-white md:text-base">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod("telegram")}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all md:gap-4 md:p-6 ${
                          contactMethod === "telegram"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                            : "border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 md:h-14 md:w-14">
                          <Send className="h-5 w-5 text-white md:h-7 md:w-7" />
                        </div>
                        <span className="text-sm font-semibold text-white md:text-base">Telegram</span>
                      </button>
                    </div>
                  </div>

                  {contactMethod === "whatsapp" && (
                    <div className="animate-slideDown">
                      <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                        WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsappNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, whatsappNumber: e.target.value })
                          setWhatsappError(false)
                        }}
                        className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:text-base"
                        placeholder="+998 XX XXX XX XX"
                      />
                      {whatsappError && (
                        <p className="mt-1.5 text-[11px] text-red-400 font-medium animate-shake md:text-sm">
                          + belgisi va davlat kodi bilan kiriting
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, whatsappNumber: formData.phone })}
                        className="mt-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium underline md:text-sm"
                      >
                        Raqamim bilan bir xil
                      </button>
                    </div>
                  )}

                  {contactMethod === "telegram" && (
                    <div className="animate-slideDown">
                      <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                        Telegram <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                          <span className="text-lg font-bold text-white/60 md:text-xl">@</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.telegramUsername}
                          onChange={(e) => {
                            const value = e.target.value.replace(/^@/, "")
                            setFormData({ ...formData, telegramUsername: value })
                          }}
                          className="w-full rounded-xl border-2 border-white/10 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:py-3.5 md:text-base"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1 md:gap-3 md:pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="flex-1 rounded-xl border-2 border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 md:py-3 md:text-sm"
                    >
                      ← Orqaga
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (contactMethod === "whatsapp") {
                          const whatsappNum = formData.whatsappNumber.trim()
                          if (!whatsappNum.startsWith("+") || whatsappNum.length < 10) {
                            setWhatsappError(true)
                            return
                          }
                        }

                        if (
                          formData.sourceWhere &&
                          contactMethod &&
                          ((contactMethod === "whatsapp" && formData.whatsappNumber) ||
                            (contactMethod === "telegram" && formData.telegramUsername))
                        ) {
                          setFormStep(3)
                        }
                      }}
                      disabled={
                        !formData.sourceWhere ||
                        !contactMethod ||
                        (contactMethod === "whatsapp" && !formData.whatsappNumber) ||
                        (contactMethod === "telegram" && !formData.telegramUsername)
                      }
                      className="form-next-button flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none md:py-4 md:text-base"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Davom etish
                        <svg
                          className="w-4 h-4 animate-bounce md:w-5 md:h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Batafsil ma'lumot - faqat Universitet uchun, byudjet siz */}
              {formStep === 3 && (
                <div className="space-y-3 animate-fadeIn md:space-y-5">
                  <div className="text-center mb-2 md:mb-4">
                    <h3 className="text-base font-bold text-white mb-1 md:text-xl">Batafsil ma'lumot</h3>
                    <p className="text-[11px] text-white/70 md:text-sm">Sizga yaxshiroq yordam berish uchun</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      O'qishni qaysi semestrda boshlaysiz?
                    </label>
                    <select
                      value={formData.startSemester}
                      onChange={(e) => setFormData({ ...formData, startSemester: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:text-base"
                    >
                      <option value="2025-2026 Bahor" className="bg-slate-900">
                        2025-2026 Bahor
                      </option>
                      <option value="2026-2027 Kuz" className="bg-slate-900">
                        2026-2027 Kuz
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      O'qish darajangizni tanlang <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:text-base"
                    >
                      <option value="" className="bg-slate-900">
                        Darajani tanlang
                      </option>
                      <option value="Bakalavr" className="bg-slate-900">
                        🎓 Bakalavr
                      </option>
                      <option value="Magistratura" className="bg-slate-900">
                        🎯 Magistratura
                      </option>
                      <option value="Doktorantura" className="bg-slate-900">
                        📖 Doktorantura
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      Yoshingiz <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="16"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:text-base"
                      placeholder="Masalan: 18"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white md:text-base">
                      Yo'nalish va maqsadi
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:text-base"
                      placeholder="Qaysi yo'nalishda o'qimoqchisiz va maqsadingiz nima?"
                    />
                  </div>

                  <div className="flex gap-2 pt-1 md:gap-3 md:pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="flex-1 rounded-xl border-2 border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 md:py-3 md:text-sm"
                    >
                      ← Orqaga
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-next-button flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none md:text-sm"
                    >
                      {isSubmitting ? (
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin md:h-5 md:w-5" />
                          Yuborilmoqda...
                        </div>
                      ) : (
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <Send className="h-4 w-4 animate-pulse" />
                          Ariza yuborish
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Honeypot field - hidden from users */}
              <div style={{ display: "none" }}>
                <label htmlFor="honeypot">Don't fill this out</label>
                <input
                  id="honeypot"
                  type="text"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>
            </form>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="animate-on-scroll mb-10 md:mb-24">
          <div className="mb-6 text-center md:mb-12">
            <h2 className="mb-2 text-xl font-black text-white md:mb-4 md:text-5xl">
              Ariza jarayoni <span className="text-emerald-400">qanday?</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xs text-white/70 md:text-base">
              Oddiy va tushunarli jarayon - biz har qadamda yondasiz!
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-500 md:left-8" />

            {/* Timeline steps */}
            <div className="space-y-4 md:space-y-8">
              {[
                {
                  step: "1",
                  title: "Ariza yuborish",
                  description: "Formani to'ldiring va biz 24 soat ichida bog'lanamiz",
                  icon: FileCheck,
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  step: "2",
                  title: "Bepul konsultatsiya",
                  description: "Mutaxassislarimiz bilan batafsil suhbat",
                  icon: Users,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "3",
                  title: "Hujjat tayyorlash",
                  description: "Barcha kerakli hujjatlarni to'g'ri tayyorlaymiz",
                  icon: Shield,
                  color: "from-purple-500 to-purple-600",
                },
                {
                  step: "4",
                  title: "Ariza topshirish",
                  description: "Rasmiy saytda arizangizni to'liq ko'rib chiqamiz",
                  icon: Target,
                  color: "from-yellow-500 to-orange-600",
                },
                {
                  step: "5",
                  title: "Grant olish!",
                  description: "Tabriklaymiz! Turkiyada o'qish boshlandi",
                  icon: Award,
                  color: "from-red-500 to-rose-600",
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="relative flex gap-3 pl-10 md:gap-6 md:pl-20">
                    {/* Step number */}
                    <div
                      className={`absolute left-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${item.color} font-bold text-white md:left-4 md:h-10 md:w-10`}
                    >
                      <span className="text-xs md:text-base">{item.step}</span>
                    </div>

                    {/* Content card */}
                    <div className="glass-card flex-1 rounded-xl p-3 md:p-6">
                      <div className="mb-1.5 flex items-center gap-1.5 md:mb-3">
                        <Icon className="h-4 w-4 text-emerald-400 md:h-6 md:w-6" />
                        <h3 className="text-sm font-bold text-white md:text-lg">{item.title}</h3>
                      </div>
                      <p className="text-xs text-white/70 md:text-base">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-on-scroll text-center">
          <div className="glass-card mx-auto max-w-3xl rounded-2xl p-6 md:rounded-4xl md:p-12">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-emerald-400 md:mb-6 md:h-16 md:w-16" />
            <h2 className="mb-2 text-xl font-black text-white md:mb-4 md:text-4xl">
              Turkiyada o'qish orzuingizni{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                amalga oshiring!
              </span>
            </h2>
            <p className="mx-auto mb-5 max-w-2xl text-xs leading-relaxed text-white/70 md:mb-8 md:text-base">
              Har yili minglab O'zbekistonlik talabalar Türkiye Bursları orqali bepul ta'lim olishadi. Siz ham ulardan
              biri bo'lishingiz mumkin!
            </p>
            <button
              onClick={() => document.getElementById("ariza-forma")?.scrollIntoView({ behavior: "smooth" })}
              className="group mx-auto flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-500/50 transition-all hover:scale-105 hover:shadow-3xl hover:shadow-emerald-500/60 active:scale-95 md:min-h-[56px] md:px-8 md:py-5 md:text-lg"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
              Hoziroq boshlash
            </button>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />}

      <style jsx global>{`
        @keyframes confetti-explosion {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(1080deg) scale(0.5);
            opacity: 0;
          }
        }

        .confetti-particle {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -20px;
          animation: confetti-explosion 4s ease-out forwards;
          z-index: 9999;
          pointer-events: none;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .text-balance {
          text-wrap: balance;
        }

        select option {
          background-color: #0f172a;
          color: white;
        }
        
        /* Multi-step form animations */
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
        }

        .form-next-button {
          background-image: linear-gradient(to right, #10b981, #059669);
        }
        .form-next-button:hover {
          box-shadow: 0 0 15px rgba(16, 185, 121, 0.4);
        }

      `}</style>
    </div>
  )
}
