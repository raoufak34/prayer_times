import type React from "react"
import type { Metadata } from "next"
import { Inter, Amiri } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
})

export const metadata: Metadata = {
  title: "MasjidTime Algeria | أوقات الصلاة الجزائر - Premium Islamic Prayer Times",
  description:
    "Premium Islamic prayer times service for Algeria with notifications and Qibla direction. Get accurate, real-time Salah schedules for all major cities using authentic Aladhan API.",
  keywords:
    "MasjidTime, prayer times, Algeria, Islamic, Salah, mosque, notifications, Qibla, أوقات الصلاة, الجزائر, مواقيت الصلاة, Aladhan API, prayer notifications, Islamic compass",
  authors: [{ name: "MasjidTime Algeria" }],
  openGraph: {
    title: "MasjidTime Algeria - Premium Islamic Prayer Times with Notifications",
    description:
      "Premium Islamic prayer times service for Algeria with prayer notifications and Qibla direction using authentic calculation methods",
    type: "website",
    siteName: "MasjidTime Algeria",
    images: [
      {
        url: "/islamic-bg.png",
        width: 1200,
        height: 630,
        alt: "MasjidTime Algeria - Premium Islamic Prayer Times Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MasjidTime Algeria - Premium Islamic Prayer Times",
    description: "Premium Islamic prayer times service with notifications and Qibla direction",
    images: ["/islamic-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MasjidTime Algeria" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
