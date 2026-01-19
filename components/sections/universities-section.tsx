"use client"

import { useReveal } from "@/hooks/use-reveal"
import { Handshake, Building2, GraduationCap } from "lucide-react"

export function UniversitiesSection() {
  const { ref, isVisible } = useReveal(0.2)

  const universities = [
    { name: "Universitet 1", icon: "U1" },
    { name: "Universitet 2", icon: "U2" },
    { name: "Universitet 3", icon: "U3" },
    { name: "Universitet 4", icon: "U4" },
  ]

  const consultings = [
    { name: "Konsalting 1", icon: "K1" },
    { name: "Konsalting 2", icon: "K2" },
    { name: "Konsalting 3", icon: "K3" },
    { name: "Konsalting 4", icon: "K4" },
  ]

  return (
    <section ref={ref} className="relative w-full px-4 py-10 md:px-8 md:py-20">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Section header */}
        <div
          className={`mb-8 text-center transition-all duration-700 md:mb-14 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 md:px-4 md:py-2">
            <Handshake className="h-3 w-3 text-emerald-400 md:h-4 md:w-4" />
            <span className="text-xs font-medium text-emerald-400">100+ hamkor</span>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white md:mb-4 md:text-4xl lg:text-5xl">
            Bizning <span className="text-emerald-400">hamkorlarimiz</span>
          </h2>
        </div>

        {/* Universities - smaller cards on mobile */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="mb-3 flex items-center gap-2 md:mb-4">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-white/70">Universitetlar</span>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {universities.map((uni, index) => (
              <div
                key={index}
                className="glass-card flex aspect-square flex-col items-center justify-center rounded-xl p-2 md:rounded-2xl md:p-4"
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-[10px] font-bold text-white md:mb-2 md:h-14 md:w-14 md:rounded-xl md:text-sm">
                  {uni.icon}
                </div>
                <p className="text-[8px] text-white/60 md:text-xs">{uni.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consultings */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="mb-3 flex items-center gap-2 md:mb-4">
            <Building2 className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-medium text-white/70">Konsaltinglar</span>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {consultings.map((cons, index) => (
              <div
                key={index}
                className="glass-card flex aspect-square flex-col items-center justify-center rounded-xl p-2 md:rounded-2xl md:p-4"
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-[10px] font-bold text-black md:mb-2 md:h-14 md:w-14 md:rounded-xl md:text-sm">
                  {cons.icon}
                </div>
                <p className="text-[8px] text-white/60 md:text-xs">{cons.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div
          className={`mt-6 flex items-center justify-center gap-3 md:mt-10 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-[10px] text-white/40 md:text-xs">Barcha hamkorlar tekshirilgan</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </section>
  )
}
