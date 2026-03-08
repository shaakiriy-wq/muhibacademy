"use client"

export function StepsSection() {
  const steps = [
    {
      number: "1",
      title: "Ro'yxatdan o'tasiz",
      description: "Pastdagi tugmani bosib, 3 daqiqada ro'yxatdan o'ting.",
      color: "bg-amber-400 text-[#064e3b]",
    },
    {
      number: "2",
      title: "3 ta bepul sinov darsida qatnashasiz",
      description: "Hech qanday to'lov qilmasdan darslarni sinab ko'ring.",
      color: "bg-[#059669] text-white",
    },
    {
      number: "3",
      title: "Agar darslar sizga yoqsa, to'liq kursni boshlaysiz",
      description: "Faqat sizga mos kelganidan keyin qaror qilasiz.",
      color: "bg-[#064e3b] text-white",
    },
  ]

  return (
    <section className="min-h-screen flex items-center bg-[#f0fdf4] px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] leading-tight mb-4 text-center text-balance">
          {"Muhib Academy'da o'qishni boshlash juda oson"}
        </h2>
        <p className="text-[#6b7280] text-center mb-12 text-base sm:text-lg">
          Faqat 3 ta oddiy qadam
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-5 sm:gap-6 rounded-2xl bg-white border border-[#e5e7eb] p-6 sm:p-8 shadow-sm"
            >
              <div
                className={`flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ${step.color} flex items-center justify-center text-xl sm:text-2xl font-bold`}
              >
                {step.number}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-1">
                  {step.number}-qadam
                </h3>
                <p className="text-base sm:text-lg text-[#374151] font-medium mb-1">
                  {step.title}
                </p>
                <p className="text-sm sm:text-base text-[#6b7280]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 rounded-2xl bg-white border-2 border-[#a7f3d0] p-6 text-center">
          <p className="text-base sm:text-lg text-[#064e3b] font-medium">
            {"Shunday qilib siz hech qanday risklarsiz darslarni sinab ko'rishingiz mumkin."}
          </p>
        </div>
      </div>
    </section>
  )
}
