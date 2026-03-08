"use client"

export function CurriculumSection() {
  const items = [
    "Arab harflarini to'g'ri tanishni",
    "Harflarni to'g'ri talaffuz qilishni",
    "Hijjalab Qur'on o'qishni",
    "Tajvid asoslarini",
    "Qur'onni mustaqil o'qishni o'rganasiz.",
  ]

  return (
    <section className="min-h-screen flex items-center bg-white px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] leading-tight mb-4 text-center text-balance">
          {"Muhib Academy kursi Qur'on o'qishni noldan boshlab o'rgatish uchun ishlab chiqilgan"}
        </h2>
        <p className="text-[#6b7280] text-center mb-12 text-base sm:text-lg">
          Kurs davomida siz:
        </p>

        {/* Curriculum items */}
        <div className="flex flex-col gap-4 mb-10">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl bg-[#f0fdf4] border border-[#a7f3d0] p-5 sm:p-6"
            >
              <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#059669] flex items-center justify-center">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-base sm:text-lg text-[#111827] font-medium">{item}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="rounded-2xl bg-[#064e3b] p-6 sm:p-8 text-center">
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            {"Ko'plab o'quvchilarimiz qisqa vaqt ichida Qur'on o'qishni o'rganib, o'zlari mustaqil o'qiy boshlashgan."}
          </p>
        </div>
      </div>
    </section>
  )
}
