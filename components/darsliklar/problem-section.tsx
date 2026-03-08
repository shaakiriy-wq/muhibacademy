"use client"

export function ProblemSection() {
  const problems = [
    {
      icon: (
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      text: "Ba'zilar arab harflarini umuman bilmaydi.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "Ba'zilar mustaqil o'rganishga harakat qiladi, lekin tez charchaydi.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      text: "Ba'zilar esa yaxshi ustoz topolmaydi.",
    },
  ]

  return (
    <section className="min-h-screen flex items-center bg-white px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] leading-tight mb-4 text-balance text-center">
          {"Ko'pchilik Qur'on o'qishni o'rganishni xohlaydi, lekin boshlashga ikkilanadi"}
        </h2>

        {/* Problem cards */}
        <div className="flex flex-col gap-4 mt-10 mb-10">
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border-2 border-red-100 bg-red-50/50 p-5 sm:p-6"
            >
              <div className="flex-shrink-0 mt-0.5">{problem.icon}</div>
              <p className="text-base sm:text-lg text-[#374151] leading-relaxed">{problem.text}</p>
            </div>
          ))}
        </div>

        {/* Result text */}
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center mb-10">
          <p className="text-base sm:text-lg text-red-800 font-medium">
            {"Natijada Qur'on o'rganish orzusi ortga surilib ketaveradi."}
          </p>
        </div>

        {/* Solution intro */}
        <div className="rounded-2xl bg-[#064e3b] p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Muhib Academy aynan shu muammoni hal qilish uchun tashkil qilingan.
          </h3>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed">
            {"Biz sizga Qur'on o'qishni bosqichma-bosqich, sodda va tushunarli usulda o'rgatamiz."}
          </p>
        </div>
      </div>
    </section>
  )
}
