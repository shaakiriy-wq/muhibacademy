"use client"

import { X, Gift, Phone } from "lucide-react"
import { useEffect, useState } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (isOpen) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      document.body.style.overflow = "hidden"

      setCountdown(5)

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      const redirectTimer = setTimeout(() => {
        // Track bot start event in Google Analytics
        if (typeof window !== "undefined" && (window as any).gtag) {
          ;(window as any).gtag("event", "BotStart", {
            event_category: "Telegram",
            event_label: "Auto Redirect to Bot",
            value: 1,
          })
        }
        window.open("https://t.me/talimciuzBot?start=w48252332", "_blank", "noopener,noreferrer")
      }, 5000)

      const duration = 4000
      const animationEnd = Date.now() + duration
      const colors = ["#10b981", "#14b8a6", "#06b6d4", "#fbbf24", "#f59e0b", "#ec4899", "#a855f7"]

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(confettiInterval)
          return
        }

        const particleCount = 8

        for (let i = 0; i < particleCount; i++) {
          const confetti = document.createElement("div")
          const size = randomInRange(8, 15)
          confetti.className = "confetti-particle"
          confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -20px;
            left: ${randomInRange(0, 100)}%;
            opacity: 1;
            transform: rotate(${randomInRange(0, 360)}deg);
            animation: confetti-explosion ${randomInRange(2, 5)}s ease-out forwards;
            z-index: 9999;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
          `
          document.body.appendChild(confetti)

          setTimeout(() => {
            confetti.remove()
          }, 5000)
        }
      }, 30)

      return () => {
        clearInterval(confettiInterval)
        clearInterval(countdownInterval)
        clearTimeout(redirectTimer)
      }
    } else {
      document.body.style.overflow = "unset"
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleBotClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "BotStart", {
        event_category: "Telegram",
        event_label: "Manual Click to Bot",
        value: 1,
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      <style jsx global>{`
        @keyframes confetti-explosion {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(1080deg) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.95);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .telegram-pulse {
          animation: pulse-ring 1.5s ease-in-out infinite;
        }

        .telegram-redirect-badge {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>

      <div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div
          className="modal-bounce-in relative w-full max-w-sm rounded-2xl bg-white shadow-2xl md:max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 px-4 py-4 md:px-6 md:py-5 relative">
            <button
              onClick={onClose}
              className="absolute right-2 top-2 rounded-full p-1.5 text-white/80 transition-all hover:bg-white/20 hover:text-white md:right-3 md:top-3 md:p-2"
              aria-label="Yopish"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-white/20 p-2.5 shadow-lg animate-bounce backdrop-blur-sm md:p-3">
                <svg className="h-7 w-7 text-white md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-3 text-center text-xl font-extrabold text-white md:text-2xl">Tabriklaymiz! 🎉</h2>
            </div>
          </div>

          <div className="p-4 md:p-6 text-center">
            <p className="mb-3 text-xs text-gray-700 leading-relaxed md:text-sm md:mb-4">
              Arizangiz qabul qilindi! Siz eng yaxshi ta'lim imkoniyatlariga bir qadam yaqinlashdingiz.
            </p>

            <div className="mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 p-3 shadow-lg md:mb-4 md:p-4">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Gift className="h-4 w-4 text-white animate-bounce md:h-5 md:w-5" />
                <h3 className="text-sm font-bold text-white md:text-base">100% GRANT IMKONIYATI!</h3>
              </div>
              <p className="text-xs text-white/95 font-medium leading-relaxed">
                2 ta talabadan biri bo'lishingiz va to'liq bepul ta'lim olishingiz mumkin!
              </p>
            </div>

            <div className="telegram-redirect-badge mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg telegram-pulse md:mb-4 md:p-4 border-2 border-blue-300">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <svg className="h-4 w-4 text-white md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.782 13.98l-2.906-.907c-.63-.196-.64-.63.135-.93l11.316-4.36c.527-.196.99.12.817.927z" />
                </svg>
                <h3 className="text-sm font-bold text-white md:text-base">📢 Telegram Kanalga o'tish!</h3>
              </div>
              <p className="text-xs text-white/90 mb-2 leading-relaxed md:mb-3">
                Grant imkoniyatlari va suhbatga chaqirishlar haqida birinchi bo'lib xabardor bo'ling!
              </p>

              <div className="mb-2 flex items-center justify-center gap-2 md:mb-3">
                <div className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-sm md:px-3 md:py-1.5">
                  <p className="text-xs font-bold text-white md:text-sm">
                    ⏱️ Avtomatik: <span className="text-yellow-300 text-sm md:text-base">{countdown}</span> soniya
                  </p>
                </div>
              </div>

              <a
                href="https://t.me/talimciuzBot?start=w48252332"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBotClick}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-600 transition-all hover:scale-105 shadow-md hover:shadow-xl md:px-5 md:py-3 md:gap-2"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.782 13.98l-2.906-.907c-.63-.196-.64-.63.135-.93l11.316-4.36c.527-.196.99.12.817.927z" />
                </svg>
                🚀 Hozir o'tish
              </a>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 border border-emerald-200 md:p-4">
              <div className="flex items-center justify-center gap-1.5 mb-2.5 md:gap-2 md:mb-3">
                <Phone className="h-4 w-4 text-emerald-600 md:h-4 md:w-4" />
                <h3 className="text-sm font-bold text-emerald-800 md:text-base">Tezkor bog'lanish</h3>
              </div>

              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm flex-wrap">
                  <span className="text-lg">🇹🇷</span>
                  <span className="font-mono text-gray-900 font-semibold">+90 501 157 1111</span>
                  <div className="flex gap-1.5">
                    <a
                      href="https://wa.me/905011571111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white transition-all hover:scale-110 hover:bg-green-600 active:scale-95 shadow-md md:h-8 md:w-8"
                      aria-label="WhatsApp"
                    >
                      <svg className="h-4 w-4 md:h-4.5 md:w-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                    <a
                      href="https://t.me/+905011571111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white transition-all hover:scale-110 hover:bg-blue-600 active:scale-95 shadow-md md:h-8 md:w-8"
                      aria-label="Telegram"
                    >
                      <svg className="h-4 w-4 md:h-4.5 md:w-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.782 13.98l-2.906-.907c-.63-.196-.64-.63.135-.93l11.316-4.36c.527-.196.99.12.817.927z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs md:text-sm flex-wrap">
                  <span className="text-lg">🇺🇿</span>
                  <span className="font-mono text-gray-900 font-semibold">+998 88 883 3344</span>
                  <div className="flex gap-1.5">
                    <a
                      href="https://wa.me/998888833344"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white transition-all hover:scale-110 hover:bg-green-600 active:scale-95 shadow-md md:h-8 md:w-8"
                      aria-label="WhatsApp"
                    >
                      <svg className="h-4 w-4 md:h-4.5 md:w-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                    <a
                      href="https://t.me/+998888833344"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white transition-all hover:scale-110 hover:bg-blue-600 active:scale-95 shadow-md md:h-8 md:w-8"
                      aria-label="Telegram"
                    >
                      <svg className="h-4 w-4 md:h-4.5 md:w-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.782 13.98l-2.906-.907c-.63-.196-.64-.63.135-.93l11.316-4.36c.527-.196.99.12.817.927z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
