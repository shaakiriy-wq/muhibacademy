"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { track } from "@vercel/analytics"

// Icons as inline SVG components
const MuhibLogo = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
  </svg>
)

// Material Icons as text
const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Load Material Icons
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    track("page_view", { page: "home" })
  }, [])

  const courses = [
    {
      id: 1,
      title: "0 dan Qur'on o'qish (2 oy)",
      category: "QUR'ON ILMLARI",
      instructor: "Shayx Ahmad Al-Sayid",
      level: "Boshlang'ich",
      duration: "8 Hafta",
      description: "Qur'on misollari orqali arab tili grammatikasi (Nahv) va morfologiyasi (Sarf) asoslarini o'rganing.",
      image: "/quran-reading-islamic-education.jpg",
      badge: "ENG KO'P SOTILGAN",
    },
    {
      id: 2,
      title: "Tajvid va Tartiyl asosi",
      category: "QUR'ON ILMLARI",
      instructor: "Ustoz Maryam Xon",
      level: "O'rta",
      duration: "12 Hafta",
      description: "Maxorij va Sifot bo'yicha shaxsiy fikr-mulohazalar bilan qiroatingizni mukammallashtiring.",
      image: "/arabic-language-learning-islamic-calligraphy.jpg",
    },
    {
      id: 3,
      title: "Arab tili: Muallimi Soniy",
      category: "ARAB TILI",
      instructor: "Dr. Omar Faruq",
      level: "Barcha darajalar",
      duration: "10 Hafta",
      description: "Klassik arab tili grammatikasi va zamonaviy muloqot metodikasi bo'yicha yetakchi mutaxassis.",
      image: "/islamic-studies-mosque-education.jpg",
    },
  ]

  const instructors = [
    {
      name: "Shayx Ahmad Al-Sayid",
      specialty: "Qur'on va Tajvid ustozi",
      description: "Misrning Al-Azhar universiteti bitiruvchisi, 15 yillik xalqaro dars berish tajribasiga ega mutaxassis.",
      image: "/islamic-scholar-beard-1.jpg",
      verified: true,
    },
    {
      name: "Ustoz Maryam Xon",
      specialty: "Arab tili va Adabiyoti",
      description: "Klassik arab tili grammatikasi va zamonaviy muloqot metodikasi bo'yicha yetakchi mutaxassis.",
      image: "/islamic-teacher-quran.jpg",
      verified: true,
    },
    {
      name: "Dr. Omar Faruq",
      specialty: "Fiqh va Usul al-Fiqh",
      description: "Islom huquqshunosligi fanlari doktori, zamonaviy masalalar bo'yicha ko'plab ilmiy ishlar muallifi.",
      image: "/islamic-scholar-beard-2.jpg",
      verified: true,
    },
    {
      name: "Shayx Yusuf Al-Amin",
      specialty: "Islom tarixi va Siyrat",
      description: "Payg'ambarimiz alayhissalom hayotlari va Islom sivilizatsiyasi tarixi bo'yicha mahoratli ma'ruzachi.",
      image: "/islamic-scholar-beard-3.jpg",
      verified: true,
    },
  ]

  const features = [
    {
      icon: "support_agent",
      title: "24/7 Support",
      description: "Istalgan vaqtda savollaringizga javob olishingiz uchun texnik va ilmiy yordam guruhi.",
    },
    {
      icon: "ad_units",
      title: "Mobile App Access",
      description: "Darslarni istalgan joyda, smartfoningiz orqali qulay formatda o'rganing.",
    },
    {
      icon: "workspace_premium",
      title: "Certified Certificates",
      description: "Kurs yakunida olgan bilimlaringizni tasdiqlovchi rasmiy sertifikatga ega bo'ling.",
    },
    {
      icon: "groups",
      title: "Community of Seekers",
      description: "Minglab hamfikr talabalar bilan birga rivojlaning va tajriba almashing.",
    },
  ]

  const testimonials = [
    {
      name: "Abdulla Karimov",
      role: "O'quvchi",
      text: "3 ta bepul darsdan so'ng, Qur'on o'qishni o'rganishim mumkinligiga amin bo'ldim. Hozir kursni muvaffaqiyatli tugatdim!",
      rating: 5,
    },
    {
      name: "Madina Azimova",
      role: "O'quvchi",
      text: "Academiyaning sifatli ustozlari va zamonaviy o'qitish usullari bilan 2 oy ichida mustaqil o'qiydigan darajaga yetdim.",
      rating: 5,
    },
    {
      name: "Sardor Rahmonov",
      role: "O'quvchi",
      text: "5 ta bepul darsdan keyin qaroriy qildim. Hozir guruhimda eng yaxshi natijani ko'rsatmoqdaman!",
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: "Bepul darslardan keyin nima bo'ladi?",
      answer: "3 ta bepul sinov darsidan keyin, agar sizga yoqsa, to'liq kursga yozilishingiz mumkin. Agar yoqmasa, hech qanday majburiyat yo'q.",
    },
    {
      question: "Darslarni o'tkazib yuborsam nima bo'ladi?",
      answer: "Barcha darslar yozib olinadi va arxivda saqlanadi. Siz istalgan vaqtda qayta ko'rishingiz mumkin.",
    },
    {
      question: "Sertifikat olgan keyin nima qilish mumkin?",
      answer: "Sertifikat sizning bilimlaringizni tasdiqlovchi hujjat. Uni rezyumengizga qo'shishingiz yoki keyingi darajadagi kurslarga yozilishingiz mumkin.",
    },
    {
      question: "Umra safariga qanday qatnashish mumkin?",
      answer: "Kurs davomida eng faol va eng yaxshi natija ko'rsatgan o'quvchi Umra safari yutib olish imkoniyatiga ega bo'ladi.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="text-primary">
                <MuhibLogo />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">Muhib Academy</span>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <Link href="#kurslar" className="text-sm font-medium hover:text-primary transition-colors">Kurslar</Link>
              <Link href="#ustozlar" className="text-sm font-medium hover:text-primary transition-colors">Ustozlar</Link>
              <Link href="#haqida" className="text-sm font-medium hover:text-primary transition-colors">Akademiya haqida</Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/darsliklar"
                className="hidden sm:flex btn-primary text-sm"
              >
                3 ta bepul darsni boshlash
              </Link>
              <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col p-4 gap-4">
              <Link href="#kurslar" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Kurslar</Link>
              <Link href="#ustozlar" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Ustozlar</Link>
              <Link href="#haqida" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Akademiya haqida</Link>
              <Link href="#faq" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Link href="/darsliklar" className="btn-primary text-center text-sm mt-2">3 ta bepul darsni boshlash</Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Announcement Bar */}
        <div className="bg-card border-b border-border py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              <span className="text-accent-gold inline-flex items-center gap-2 mr-2">
                <Icon name="coffee" className="text-lg" />
              </span>
              Bir kunlik qahva pulini tejab, kelajagingiz uchun ilmga sarmoya qiling
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 hero-gradient z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/islamic-studies-mosque-education.jpg')" }}
            />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-16">
            <div className="max-w-2xl flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary border border-primary/30 rounded-full bg-primary/10 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Bepul sinov darslari mavjud
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8">
                2 oyda Qur'on o'qishni <span className="text-primary italic">0 dan</span> o'rganing
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-light">
                Muhib Academy bilan tajribali ustozlar yordamida qisqa vaqt ichida muqaddas kitobimizni to'g'ri o'qishni o'zlashtiring.{" "}
                <span className="text-white font-semibold">Dastlabki 3 ta dars mutlaqo bepul!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                <Link
                  href="/darsliklar"
                  className="bg-primary text-primary-foreground px-10 py-5 rounded-xl font-black text-lg hover:shadow-[0_0_30px_rgba(19,236,73,0.5)] transition-all transform hover:-translate-y-1 text-center"
                >
                  3 ta bepul darsni boshlash
                </Link>
                <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-5 rounded-xl font-bold text-lg transition-all">
                  O'quv rejasini ko'rish
                </button>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-background bg-card"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-white font-bold">5,000+</span> talaba bepul darslar bilan boshlagan
                </p>
              </div>
            </div>

            {/* Umra Card */}
            <div className="flex-1 w-full max-w-md">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold to-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-card border border-accent-gold/30 rounded-2xl p-8 umrah-card-glow overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Icon name="mosque" className="text-9xl text-accent-gold" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-accent-gold/20 text-accent-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-accent-gold/30">
                        Premium Mukofot
                      </span>
                    </div>
                    <h3 className="text-3xl font-black mb-2 italic uppercase">Umra safariga</h3>
                    <h4 className="text-4xl font-black text-accent-gold mb-6">YO'LLANMA!</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                      Kursni muvaffaqiyatli tamomlagan talabalar orasida Umra safari yo'llanmasi o'ynaladi. Ilm oling va muqaddas zaminni ziyorat qiling.
                    </p>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-sm">
                        <Icon name="verified" className="text-accent-gold text-lg" />
                        <span>To'liq bepul sayohat</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Icon name="verified" className="text-accent-gold text-lg" />
                        <span>Premium mehmonxonalar</span>
                      </div>
                    </div>
                    <Link
                      href="/darsliklar"
                      className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                    >
                      IMKONIYATNI QO'LGA KIRITING
                      <Icon name="flight_takeoff" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="kurslar" className="py-24 bg-background/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">Asosiy Kurslarimiz</h2>
                <p className="text-muted-foreground">Dastlabki 3 darsni sinab ko'rish orqali o'zingizga mos kursni tanlang.</p>
              </div>
              <Link href="/kurslar" className="text-primary font-bold flex items-center gap-2 group border-b border-primary/30 pb-1">
                Barcha kurslarni ko'rish
                <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="group course-card">
                  <div className="relative aspect-video overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center course-image"
                      style={{ backgroundImage: `url('${course.image}')` }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                        3 dars bepul
                      </span>
                    </div>
                    {course.badge && (
                      <div className="absolute bottom-3 right-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 uppercase">
                        <Icon name="star" className="text-xs" /> {course.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="signal_cellular_alt" className="text-sm" /> {course.level}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="schedule" className="text-sm" /> {course.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{course.description}</p>
                    <Link
                      href="/darsliklar"
                      className="w-full bg-card hover:bg-primary hover:text-primary-foreground font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      3 ta bepul darsni boshlash
                      <Icon name="play_arrow" className="text-lg" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Muhib Academy Section */}
        <section id="haqida" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Nega aynan Muhib Academy?</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6" />
              <p className="text-muted-foreground text-lg">
                Biz faqat dars bermaymiz, balki sizning ilm yo'lingizdagi hamrohingizga aylanamiz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-8 card-dark text-center group">
                  <div className="feature-icon mx-auto mb-6">
                    <Icon name={feature.icon} className="text-4xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">O'quvchilarimiz fikrlari</h2>
              <p className="text-muted-foreground">Bizning muvaffaqiyatimiz — o'quvchilarimizning natijalari.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="star" className="text-yellow-500 text-lg" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors Section */}
        <section id="ustozlar" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
                Bizning malakali <span className="text-primary">ustozlarimiz</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dunyoning yetakchi ilm dargohlarida tahsil olgan, ko'p yillik tajribaga ega bo'lgan va o'z sohasining mutaxassisi bo'lgan ustozlar jamoasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {instructors.map((instructor, index) => (
                <div key={index} className="instructor-card p-6 text-center">
                  <div className="relative mb-6 mx-auto w-32">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 overflow-hidden">
                      <div
                        className="w-full h-full rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${instructor.image}')` }}
                      />
                    </div>
                    {instructor.verified && (
                      <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                        <Icon name="verified" className="text-sm font-bold" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-background text-xl font-bold mb-1">{instructor.name}</h3>
                  <p className="text-primary font-bold text-sm mb-4">{instructor.specialty}</p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-6">{instructor.description}</p>
                  <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-background hover:text-primary transition-colors">
                    Batafsil ma'lumot
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="stats-card">
                <p className="text-4xl md:text-5xl font-black text-primary mb-2">10k+</p>
                <p className="text-muted-foreground text-sm">Faol o'quvchilar</p>
              </div>
              <div className="stats-card">
                <p className="text-4xl md:text-5xl font-black text-primary mb-2">98%</p>
                <p className="text-muted-foreground text-sm">Qoniqish darajasi</p>
              </div>
              <div className="stats-card">
                <p className="text-4xl md:text-5xl font-black text-primary mb-2">450+</p>
                <p className="text-muted-foreground text-sm">Video darslar</p>
              </div>
              <div className="stats-card">
                <p className="text-4xl md:text-5xl font-black text-primary mb-2">50+</p>
                <p className="text-muted-foreground text-sm">Malakali ustozlar</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Tez-tez beriladigan savollar</h2>
              <p className="text-muted-foreground">Sizda savollar bor, bizda javoblar.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="faq-item group">
                  <summary className="flex items-center justify-between cursor-pointer p-6">
                    <span className="font-bold pr-4">{faq.question}</span>
                    <Icon name="expand_more" className="text-primary transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-card to-background relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-5" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">Nega kechiktirmoqdasiz?</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Bugunoq <span className="text-primary">bepul</span> o'rganishni boshlang
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Bizni hozir sinov mafkuriyadlar kutmoqdi. Shunchaki platformaga a'zo bo'ling va ilm sari birinchi qadamingizni bugun qo'ying.
            </p>
            <Link
              href="/darsliklar"
              className="inline-flex bg-primary text-primary-foreground px-12 py-5 rounded-xl font-black text-lg hover:shadow-[0_0_40px_rgba(19,236,73,0.5)] transition-all transform hover:-translate-y-1"
            >
              3 ta bepul darsni boshlash
            </Link>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Icon name="check_circle" className="text-primary" />
                Ro'yxatdan o'tish bepul
              </span>
              <span className="flex items-center gap-2">
                <Icon name="check_circle" className="text-primary" />
                Zo'r ishlatish oson
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="text-primary">
                <MuhibLogo />
              </div>
              <span className="text-lg font-bold">Muhib Academy</span>
            </div>
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
              <li><Link href="#haqida" className="hover:text-primary">Akademiya haqida</Link></li>
              <li><Link href="#ustozlar" className="hover:text-primary">Ustozlarimiz</Link></li>
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

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-wrap justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">2024 Muhib Academy. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6 text-muted-foreground text-xs">
            <Link href="#" className="hover:text-primary">Maxfiylik siyosati</Link>
            <Link href="#" className="hover:text-primary">Xizmat ko'rsatish shartlari</Link>
            <Link href="#" className="hover:text-primary">Yordam</Link>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link href="/darsliklar" className="fab flex items-center gap-3">
        <Icon name="headset_mic" />
        <span className="hidden sm:inline">Bog'lanish</span>
      </Link>
    </div>
  )
}
