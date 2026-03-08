"use client"

import { ChevronDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-[#064e3b] overflow-hidden">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/images/quran-hero.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/80 via-[#064e3b]/90 to-[#064e3b]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/muhib-logo.png"
            alt="Muhib Academy"
            className="h-12 sm:h-14 mx-auto brightness-0 invert"
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
          {"Qur'on o'qishni 2 oyda noldan onlayn tarzda o'rganing"}
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto text-pretty">
          {"Muhib Academy sizga Qur'on o'qishni oddiy va tushunarli metodika orqali o'rgatadi. Darslarni boshlashdan oldin 3 ta bepul sinov darsida qatnashing."}
        </p>

        {/* Checkmarks */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10 text-sm sm:text-base text-white/90">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{"Qur'on o'qishni noldan o'rganasiz"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Tajribali ustozlar bilan darslar</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Eng yaxshi o{"'"}quvchi Umra safari yutib olishi mumkin</span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="#courses"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-[#064e3b] shadow-lg shadow-amber-400/30 transition-all hover:scale-105 active:scale-95"
        >
          Bepul 3 ta darsga yozilish
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-xs">Pastga suring</span>
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  )
}
