"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const MuhibLogo = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
  </svg>
)

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

const instructors = [
  {
    id: 1,
    name: "Shayx Ahmad Al-Sayid",
    specialty: "Qur'on va Tajvid ustozi",
    description: "Misrning Al-Azhar universiteti bitiruvchisi, 15 yillik xalqaro dars berish tajribasiga ega mutaxassis.",
    image: "/islamic-scholar-beard-1.jpg",
    verified: true,
    courses: 12,
    students: 2500,
  },
  {
    id: 2,
    name: "Ustoz Maryam Xon",
    specialty: "Arab tili va Adabiyoti",
    description: "Klassik arab tili grammatikasi va zamonaviy muloqot metodikasi bo'yicha yetakchi mutaxassis.",
    image: "/islamic-teacher-quran.jpg",
    verified: true,
    courses: 8,
    students: 1800,
  },
  {
    id: 3,
    name: "Dr. Omar Faruq",
    specialty: "Fiqh va Usul al-Fiqh",
    description: "Islom huquqshunosligi fanlari doktori, zamonaviy masalalar bo'yicha ko'plab ilmiy ishlar muallifi.",
    image: "/islamic-scholar-beard-2.jpg",
    verified: true,
    courses: 6,
    students: 1200,
  },
  {
    id: 4,
    name: "Shayx Yusuf Al-Amin",
    specialty: "Islom tarixi va Siyrat",
    description: "Payg'ambarimiz alayhissalom hayotlari va Islom sivilizatsiyasi tarixi bo'yicha mahoratli ma'ruzachi.",
    image: "/islamic-scholar-beard-3.jpg",
    verified: true,
    courses: 10,
    students: 2100,
  },
  {
    id: 5,
    name: "Dr. Amina Qureshi",
    specialty: "Islomiy Psixologiya",
    description: "Ruhiy salomatlik va islomiy tarbiya uyg'unligi bo'yicha kurslar muallifi va maslahatchi.",
    image: "/arabic-teacher-professor.jpg",
    verified: false,
    courses: 4,
    students: 900,
  },
  {
    id: 6,
    name: "Ustoz Bilol Ali",
    specialty: "Aqida va Mantiq",
    description: "Kalom ilmi va islomiy mantiq asoslarini sodda va tushunarli tilda yetkazib beruvchi ustoz.",
    image: "/islamic-scholar-teacher.jpg",
    verified: false,
    courses: 5,
    students: 750,
  },
]

export default function UstozlarPage() {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }, [])

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <Link href="/kurslar" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Kurslar</Link>
              <Link href="/ustozlar" className="text-white hover:text-primary transition-colors text-sm font-medium">Ustozlarimiz</Link>
              <Link href="/#haqida" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Akademiya haqida</Link>
              <Link href="/#faq" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Blog</Link>
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
                  placeholder="Ustozlarni qidirish..."
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

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden bg-background py-20 border-b border-border">
          <div className="absolute inset-0 hero-pattern" />
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
              Bizning malakali <span className="text-primary">ustozlarimiz</span>
            </h1>
            <p className="text-muted-foreground text-lg font-normal leading-normal max-w-2xl mx-auto">
              Dunyoning yetakchi ilm dargohlarida tahsil olgan, ko'p yillik tajribaga ega bo'lgan va o'z sohasining mutaxassisi bo'lgan ustozlar jamoasi.
            </p>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredInstructors.map((instructor) => (
              <div key={instructor.id} className="instructor-card group">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 overflow-hidden">
                      <div
                        className="w-full h-full rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${instructor.image}')` }}
                      />
                    </div>
                    {instructor.verified && (
                      <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                        <Icon name="verified" className="text-lg font-bold" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-background text-xl font-bold mb-1">{instructor.name}</h3>
                  <p className="text-primary font-bold text-sm mb-4">{instructor.specialty}</p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {instructor.description}
                  </p>
                  <div className="flex items-center justify-center gap-6 mb-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon name="play_circle" className="text-base" />
                      {instructor.courses} kurs
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="group" className="text-base" />
                      {instructor.students.toLocaleString()} talaba
                    </span>
                  </div>
                  <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-background hover:text-primary transition-colors">
                    Batafsil ma'lumot
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredInstructors.length === 0 && (
            <div className="text-center py-16">
              <Icon name="search_off" className="text-6xl text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Hech narsa topilmadi</p>
            </div>
          )}
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
        <div className="bg-white text-background px-4 py-2 rounded-lg shadow-2xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1 pointer-events-none border-r-4 border-primary">
          Ustozlarimiz bilan bog'lanishni istaysizmi?
        </div>
        <Link
          href="/darsliklar"
          className="flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform active:scale-95"
        >
          <Icon name="headset_mic" />
          <span className="truncate">Bog'lanish</span>
        </Link>
      </div>
    </div>
  )
}
