"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const MuhibLogo = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
  </svg>
)

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

type Category = "all" | "arab" | "quran" | "fiqh" | "zamonaviy" | "tarix"
type Level = "all" | "beginner" | "intermediate" | "advanced"

const courses = [
  {
    id: 1,
    title: "Klassik Arab tili: 1-daraja",
    category: "arab",
    categoryLabel: "ARAB TILI",
    instructor: "Shayx Ahmad Al-Sayid",
    instructorImage: "/islamic-scholar-beard-1.jpg",
    level: "beginner",
    description: "Qur'on misollari orqali arab tili grammatikasi (Nahv) va morfologiyasi (Sarf) asoslarini o'rganing.",
    image: "/arabic-language-learning-islamic-calligraphy.jpg",
    badge: "ENG KO'P SOTILGAN",
    freeLessons: 3,
  },
  {
    id: 2,
    title: "Tajvid asoslari",
    category: "quran",
    categoryLabel: "QUR'ON ILMLARI",
    instructor: "Ustoz Maryam Xon",
    instructorImage: "/islamic-teacher-quran.jpg",
    level: "intermediate",
    description: "Maxorij va Sifot bo'yicha shaxsiy fikr-mulohazalar bilan qiroatingizni mukammallashtiring.",
    image: "/quran-reading-islamic-education.jpg",
    freeLessons: 3,
  },
  {
    id: 3,
    title: "Usul al-Fiqh: Tamoyillar",
    category: "fiqh",
    categoryLabel: "FIQH VA AQIDA",
    instructor: "Dr. Omar Faruq",
    instructorImage: "/islamic-scholar-beard-2.jpg",
    level: "advanced",
    description: "Islomiy hukmlar va qonunlar ortidagi huquqiy asos va metodologiyani tushuning.",
    image: "/islamic-studies-mosque-education.jpg",
    freeLessons: 3,
  },
  {
    id: 4,
    title: "Ilm-fanning oltin davri",
    category: "tarix",
    categoryLabel: "ISLOM TARIXI",
    instructor: "Shayx Yusuf Al-Amin",
    instructorImage: "/islamic-scholar-beard-3.jpg",
    level: "beginner",
    description: "Musulmon olimlarining matematika, tibbiyot va astronomiyaga qo'shgan ulkan hissalarini o'rganing.",
    image: "/islamic-pattern.jpg",
    freeLessons: 3,
  },
  {
    id: 5,
    title: "Islomiy xulq-atvor psixologiyasi",
    category: "zamonaviy",
    categoryLabel: "ZAMONAVIY FANLAR",
    instructor: "Dr. Amina Qureshi",
    instructorImage: "/islamic-teacher-quran.jpg",
    level: "intermediate",
    description: "Zamonaviy terapevtik amaliyotlarni Nafs haqidagi an'anaviy islomiy tushunchalar bilan birlashtiring.",
    image: "/arabic-teacher-professor.jpg",
    freeLessons: 3,
  },
  {
    id: 6,
    title: "So'zlashuv Arab tili",
    category: "arab",
    categoryLabel: "ARAB TILI",
    instructor: "Ustoz Bilol Ali",
    instructorImage: "/islamic-scholar-beard-1.jpg",
    level: "beginner",
    description: "Arab tilida ishonch bilan gapiring. Kundalik hayot senariyalari uchun amaliy so'zlashuv ko'nikmalari.",
    image: "/islamic-scholar-teacher.jpg",
    badge: "Bepul maslahat",
    freeLessons: 3,
  },
]

const categories = [
  { id: "all", label: "Barchasi", icon: "apps" },
  { id: "arab", label: "Arab tili", icon: "translate" },
  { id: "quran", label: "Qur'on ilmlari", icon: "menu_book" },
  { id: "fiqh", label: "Fiqh va Aqida", icon: "gavel" },
  { id: "zamonaviy", label: "Zamonaviy fanlar", icon: "science" },
  { id: "tarix", label: "Islom tarixi", icon: "history_edu" },
]

const levels = [
  { id: "all", label: "Barchasi" },
  { id: "beginner", label: "Boshlang'ich" },
  { id: "intermediate", label: "O'rta" },
  { id: "advanced", label: "Yuqori" },
]

export default function KurslarPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [selectedLevel, setSelectedLevel] = useState<Level>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-primary">
                <MuhibLogo />
              </div>
              <span className="text-xl font-bold tracking-tight">Muhib Academy</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/kurslar" className="text-white hover:text-primary transition-colors text-sm font-medium">Barcha kurslar</Link>
              <Link href="/ustozlar" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Ustozlarimiz</Link>
              <Link href="/#haqida" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Akademiya haqida</Link>
              <Link href="/#contact" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Biz bilan bog'lanish</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-lg">
                  <Icon name="search" className="text-xl" />
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 border-none bg-muted text-white focus:ring-0 h-full placeholder:text-muted-foreground px-4 rounded-r-lg text-sm outline-none"
                  placeholder="Kurs qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
            <div className="flex gap-2">
              <Link href="/darsliklar" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                A'zo bo'lish
              </Link>
              <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-muted text-white text-sm font-bold hover:bg-muted/80 transition-colors">
                Kirish
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <div className="relative overflow-hidden bg-background py-12 border-b border-border">
          <div className="absolute inset-0 hero-pattern" />
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-wrap justify-between items-end gap-6">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
                  Muqaddas ilmlarni <br /><span className="text-primary">istalgan joyda o'rganing.</span>
                </h1>
                <p className="text-muted-foreground text-lg font-normal leading-normal max-w-lg">
                  An'ana va zamonaviy ta'limning oqlangan sintezi. Dunyo darajasidagi olimlar tomonidan olib boriladigan kurslarni kashf eting.
                </p>
              </div>
              <div className="flex gap-3 pb-2">
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                  <Icon name="verified" className="text-lg" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Akkreditatsiyalangan dasturlar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1440px] mx-auto w-full flex flex-1 px-4 md:px-10 py-8 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
            <div className="flex flex-col gap-6 sticky top-24">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icon name="filter_list" className="text-primary" />
                  Kategoriyalar
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as Category)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={cat.icon} className={selectedCategory === cat.id ? "text-primary" : ""} />
                        <span className={`text-sm font-medium ${selectedCategory === cat.id ? "text-white" : "text-white/70"}`}>
                          {cat.label}
                        </span>
                      </div>
                      {selectedCategory === cat.id && (
                        <Icon name="check_circle" className="text-xs text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div>
                <h3 className="text-lg font-bold mb-4">Daraja</h3>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedLevel(level.id as Level)}
                      className={`level-badge ${selectedLevel === level.id ? "level-badge-active" : ""}`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedLevel("all")
                  setSearchQuery("")
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity mt-4"
              >
                <Icon name="refresh" />
                Filtrlarni tozalash
              </button>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button type="button" className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-muted px-4 hover:bg-muted/80 transition-colors">
                  <span className="text-xs font-medium">Avval yangilari</span>
                  <Icon name="expand_more" className="text-lg" />
                </button>
                <button type="button" className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-muted px-4 hover:bg-muted/80 transition-colors">
                  <span className="text-xs font-medium">Yo'nalish</span>
                  <Icon name="filter_alt" className="text-lg" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm">
                Katalogdan {filteredCourses.length} ta natija ko'rsatilmoqda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="group course-card">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center course-image"
                      style={{ backgroundImage: `url('${course.image}')` }}
                    />
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase text-primary border border-primary/20 tracking-widest">
                      {course.categoryLabel}
                    </div>
                    {course.badge && (
                      <div className="absolute bottom-3 right-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter">
                        <Icon name="star" className="text-xs" /> {course.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-6 h-6 rounded-full bg-cover bg-center border border-primary/30"
                        style={{ backgroundImage: `url('${course.instructorImage}')` }}
                      />
                      <span className="text-xs text-muted-foreground">{course.instructor}</span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="mt-auto flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <Icon name="redeem" className="text-lg" />
                        {course.freeLessons} ta bepul dars mavjud
                      </div>
                      <Link
                        href="/darsliklar"
                        className="w-full rounded-lg h-11 px-4 bg-primary text-primary-foreground text-sm font-bold hover:bg-white transition-colors flex items-center justify-center"
                      >
                        3 ta bepul darsni boshlash
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredCourses.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <button type="button" className="pagination-btn pagination-btn-inactive">
                  <Icon name="chevron_left" />
                </button>
                <button type="button" className="pagination-btn pagination-btn-active">1</button>
                <button type="button" className="pagination-btn pagination-btn-inactive">2</button>
                <button type="button" className="pagination-btn pagination-btn-inactive">3</button>
                <button type="button" className="pagination-btn pagination-btn-inactive">
                  <Icon name="chevron_right" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 md:px-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-primary">
                <MuhibLogo />
              </div>
              <span className="text-lg font-bold">Muhib Academy</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Islomning boqiylik hikmati bilan ongni yoritish. Izlanuvchilarning global hamjamiyati uchun zamonaviy platforma.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Icon name="language" className="cursor-pointer hover:text-primary" />
              <Icon name="group" className="cursor-pointer hover:text-primary" />
              <Icon name="mail" className="cursor-pointer hover:text-primary" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Ta'lim</h4>
            <ul className="text-muted-foreground text-sm space-y-4">
              <li><Link href="/kurslar" className="hover:text-primary">Barcha kurslar</Link></li>
              <li><Link href="#" className="hover:text-primary">Ilmiy daraja dasturlari</Link></li>
              <li><Link href="#" className="hover:text-primary">Qisqa kurslar</Link></li>
              <li><Link href="/darsliklar" className="hover:text-primary">Bepul ma'ruzalar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Akademiya</h4>
            <ul className="text-muted-foreground text-sm space-y-4">
              <li><Link href="/#haqida" className="hover:text-primary">Akademiya haqida</Link></li>
              <li><Link href="/ustozlar" className="hover:text-primary">Ustozlarimiz</Link></li>
              <li><Link href="#" className="hover:text-primary">Qabul</Link></li>
              <li><Link href="#" className="hover:text-primary">Biz bilan bog'lanish</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Yangiliklardan xabardor bo'ling</h4>
            <p className="text-muted-foreground text-sm mb-4">Kurslar va yangiliklar uchun obuna bo'ling.</p>
            <div className="flex h-10">
              <input
                className="form-input-dark rounded-l-lg text-sm w-full"
                placeholder="Elektron pochta manzili"
                type="email"
              />
              <button className="bg-primary text-primary-foreground px-4 rounded-r-lg font-bold text-xs uppercase">
                Qo'shilish
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-border flex flex-wrap justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">2024 Muhib Academy. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6 text-muted-foreground text-xs">
            <Link href="#" className="hover:text-primary">Maxfiylik siyosati</Link>
            <Link href="#" className="hover:text-primary">Xizmat ko'rsatish shartlari</Link>
            <Link href="#" className="hover:text-primary">Yordam</Link>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <Link href="/darsliklar" className="fab flex items-center gap-3">
        <Icon name="headset_mic" />
        <span className="hidden sm:inline">Bog'lanish</span>
      </Link>
    </div>
  )
}
