"use client"

export function UmraSection() {
  return (
    <section className="min-h-screen flex items-center bg-[#064e3b] px-4 py-20 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url(/images/umra-prize.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/70 via-[#064e3b]/85 to-[#064e3b]" />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#064e3b] mb-8">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Maxsus sovrin
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 text-balance">
          Eng yaxshi o{"'"}quvchi Umra safari yutib olishi mumkin
        </h2>

        <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
          {"Muhib Academy o'quvchilarini yanada rag'batlantirish uchun maxsus sovrin joriy qilingan."}
        </p>

        {/* Prize details card */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 sm:p-8 md:p-10 max-w-2xl mx-auto mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-amber-400 flex items-center justify-center">
                <svg className="h-5 w-5 text-[#064e3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                {"Kurs davomida eng faol va eng yaxshi natija ko'rsatgan o'quvchi Umra safari yutib olish imkoniyatiga ega bo'ladi."}
              </p>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-amber-400 flex items-center justify-center">
                <svg className="h-5 w-5 text-[#064e3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                {"Bu imkoniyat o'quvchilarni yanada ko'proq harakat qilishga va Qur'on o'rganishga ilhomlantiradi."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
