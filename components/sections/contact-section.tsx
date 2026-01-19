"use client"

import { Phone, Send, User, MessageSquare, CheckCircle, Gift } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", phone: "", message: "" })
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section ref={ref} className="relative w-full">
      <div className="relative z-10 mx-auto w-full max-w-xl">
        {/* Section header */}
        <div
          className={`mb-6 text-center transition-all duration-700 md:mb-10 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 md:px-4 md:py-2">
            <Send className="h-3 w-3 text-emerald-400 md:h-4 md:w-4" />
            <span className="text-xs font-medium text-emerald-400">Bepul ariza</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-4xl">
            Kelajagingizni <span className="text-emerald-400">boshlang</span>
          </h2>
          <p className="text-xs text-white/60 md:text-sm">Bepul konsultatsiya + 1 yillik grant imkoniyati</p>
        </div>

        {/* Benefits - compact on mobile */}
        <div
          className={`mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mb-8 md:gap-3 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 md:rounded-xl md:px-4 md:py-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-xs text-white/80">Bepul konsultatsiya</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 md:rounded-xl md:px-4 md:py-3">
            <Gift className="h-4 w-4 shrink-0 text-yellow-400" />
            <span className="text-xs text-white/80">$8000 gacha grant</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 md:rounded-xl md:px-4 md:py-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-xs text-white/80">24 soatda javob</span>
          </div>
        </div>

        {/* Form card */}
        <div
          className={`glass-card rounded-2xl p-5 transition-all duration-700 md:rounded-3xl md:p-8 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-white/80 md:mb-2">
                <User className="h-3 w-3 md:h-4 md:w-4" />
                Ismingiz *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none md:rounded-xl md:px-5 md:py-4 md:text-base"
                placeholder="Ismingizni kiriting"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-white/80 md:mb-2">
                <Phone className="h-3 w-3 md:h-4 md:w-4" />
                Telefon raqamingiz *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none md:rounded-xl md:px-5 md:py-4 md:text-base"
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-white/80 md:mb-2">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                Xabar (ixtiyoriy)
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none md:rounded-xl md:px-5 md:py-4 md:text-base"
                placeholder="Qaysi davlatda o'qishni xohlaysiz?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 md:rounded-xl md:px-6 md:py-4 md:text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Yuborilmoqda...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Bepul ariza yuborish
                </span>
              )}
            </button>

            {submitSuccess && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center md:rounded-xl md:p-4">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-400">Arizangiz qabul qilindi!</p>
                </div>
                <p className="text-xs text-white/70">24 soat ichida bog'lanamiz</p>
              </div>
            )}
          </form>
        </div>

        {/* Trust note */}
        <p
          className={`mt-4 text-center text-[10px] text-white/40 md:mt-6 md:text-xs ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Ma'lumotlaringiz xavfsiz saqlanadi
        </p>
      </div>
    </section>
  )
}
