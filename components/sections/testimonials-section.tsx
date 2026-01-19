"use client"

import { useReveal } from "@/hooks/use-reveal"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const { ref, isVisible } = useReveal(0.2)

  const testimonials = [
    {
      name: "Shohruh A.",
      university: "Xalqaro universitet",
      image: "SA",
      rating: 5,
      text: "Talimci orqali eng yaxshi universitetga kirdim. Hech qanday yashirin to'lov bo'lmadi!",
      savings: "$2,500",
    },
    {
      name: "Dilnoza K.",
      university: "Yevropa universiteti",
      image: "DK",
      rating: 5,
      text: "Boshqa agentliklar ikki barobar qimmat taklif qilgan edi. Talimci haqiqatan halol ishlaydi.",
      savings: "$4,200",
    },
    {
      name: "Javohir R.",
      university: "Texnik universitet",
      image: "JR",
      rating: 5,
      text: "Grant dasturi orqali birinchi yil kontrakt to'lab berishdi. Oilam uchun katta yordam bo'ldi.",
      savings: "$6,000",
    },
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 md:px-4 md:py-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 md:h-4 md:w-4" />
            <span className="text-xs font-medium text-yellow-400">500+ mamnun talaba</span>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white md:mb-4 md:text-4xl lg:text-5xl">
            Talabalar <span className="text-yellow-400">nima deydi?</span>
          </h2>
        </div>

        {/* Testimonial cards - single column on mobile */}
        <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-3 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl p-5 transition-all duration-700 md:rounded-3xl md:p-7 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Quote className="mb-3 h-6 w-6 text-yellow-400/30 md:mb-4 md:h-8 md:w-8" />

              {/* Rating */}
              <div className="mb-3 flex gap-0.5 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="mb-4 text-sm leading-relaxed text-white/80 md:mb-5 md:text-base">"{testimonial.text}"</p>

              {/* Author */}
              <div className="mb-3 flex items-center gap-3 md:mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-yellow-500 text-sm font-bold text-black md:h-12 md:w-12">
                  {testimonial.image}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/50">{testimonial.university}</p>
                </div>
              </div>

              {/* Savings */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center md:rounded-xl md:px-4 md:py-3">
                <p className="text-[10px] text-white/60">Tejagan summasi</p>
                <p className="text-lg font-bold text-emerald-400 md:text-xl">{testimonial.savings}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row - 2x2 grid on mobile */}
        <div
          className={`glass-card grid grid-cols-2 gap-3 rounded-2xl p-4 md:grid-cols-4 md:gap-6 md:rounded-3xl md:p-6 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400 md:text-3xl">500+</div>
            <div className="text-[10px] text-white/50 md:text-xs">talaba</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400 md:text-3xl">4.9/5</div>
            <div className="text-[10px] text-white/50 md:text-xs">baho</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400 md:text-3xl">$350K+</div>
            <div className="text-[10px] text-white/50 md:text-xs">tejatildi</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400 md:text-3xl">98%</div>
            <div className="text-[10px] text-white/50 md:text-xs">mamnunlik</div>
          </div>
        </div>
      </div>
    </section>
  )
}
