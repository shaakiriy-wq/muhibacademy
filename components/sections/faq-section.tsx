"use client"

import { useReveal } from "@/hooks/use-reveal"
import { HelpCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

export function FAQSection() {
  const { ref, isVisible } = useReveal(0.2)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "1 yillik grant qanday ishlaydi?",
      answer:
        "Har oyda 2 ta eng faol talabaning to'liq 1 yillik kontrakt to'lovini biz qoplaymiz. Bu $3,000 dan $8,000 gacha bo'lishi mumkin.",
    },
    {
      question: "2 talaba uchun kontrakt to'lab berasizlarmi?",
      answer:
        "Ha! Har oyda 2 ta muvaffaqiyatli talabaning kontraktini to'laymiz. Eng faol va muvaffaqiyatli talabalar tanlanadi.",
    },
    {
      question: "Talimci qanday pul topadi?",
      answer:
        "Biz universitetlardan bonus olmaymiz, faqat sizdan xizmat to'lovi olamiz. Shuning uchun sizga mos universitetni tanlaymiz.",
    },
    {
      question: "Agar mamnun bo'lmasam?",
      answer: "100% pul qaytarish kafolati. Agar va'da qilingan xizmatlar bajarilmasa, pulingiz to'liq qaytariladi.",
    },
    {
      question: "Qaysi davlatlarga yordam berasiz?",
      answer:
        "Dunyo bo'ylab - Yevropa, Osiyo, Amerika va boshqa mintaqalar. Sizning maqsadingizga qarab eng mos davlatni tanlaymiz.",
    },
  ]

  return (
    <section ref={ref} className="relative w-full px-4 py-8 md:px-8 md:py-12">
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Section header */}
        <div
          className={`mb-6 text-center transition-all duration-700 md:mb-10 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 md:px-4 md:py-2">
            <HelpCircle className="h-3 w-3 text-yellow-400 md:h-4 md:w-4" />
            <span className="text-xs font-medium text-yellow-400">Savollar</span>
          </div>
          <h2 className="text-2xl font-bold text-white md:text-4xl lg:text-5xl">
            Sizda <span className="text-yellow-400">savollar bormi?</span>
          </h2>
        </div>

        {/* FAQ accordion - compact on mobile */}
        <div className="space-y-2 md:space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass-card overflow-hidden rounded-xl transition-all duration-700 md:rounded-2xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              } ${openIndex === index ? "ring-1 ring-emerald-500/30" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-white/5 md:gap-4 md:p-5"
              >
                <h3 className="text-sm font-semibold text-white md:text-base">{faq.question}</h3>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 md:h-8 md:w-8 ${
                    openIndex === index ? "bg-emerald-500/20 rotate-180" : "bg-white/10"
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-colors md:h-5 md:w-5 ${openIndex === index ? "text-emerald-400" : "text-white/60"}`}
                  />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40" : "max-h-0"}`}
              >
                <p className="px-4 pb-4 text-xs leading-relaxed text-white/70 md:px-5 md:pb-5 md:text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
