import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Muhib Academy — 2 oyda Qur'on o'qishni 0 dan o'rganing",
  description:
    "Qur'on va Arab tili ta'limida 10 yillik tajriba. Malakali o'qituvchilar, zamonaviy usullar, qulay jadval. 3 ta dars BEPUL!",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/muhib-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/muhib-icon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/muhib-icon.png",
    shortcut: "/muhib-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RPVZYYC9DB" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RPVZYYC9DB', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
      </head>
      <body className={`${poppins.className} font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
