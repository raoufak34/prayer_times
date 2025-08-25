"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Bell, Compass, Clock, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function GuidePage() {
  const [isDark, setIsDark] = useState<boolean>(false)
  // Sync theme from localStorage
  if (typeof window !== "undefined") {
    // avoid hydration issues: read on client only
    try {
      const t = localStorage.getItem("theme")
      if (t === "dark" && !isDark) setIsDark(true)
      if (t === "light" && isDark) setIsDark(false)
    } catch {}
  }
  const steps = [
    {
      icon: <Clock className="w-6 h-6 text-emerald-500" />,
      title: "Check Prayer Times",
      desc: "Browse accurate daily prayer times for your city across Algeria.",
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-500" />,
      title: "Enable Notifications",
      desc: "Get smart alerts before each prayer so you never miss one.",
    },
    {
      icon: <Compass className="w-6 h-6 text-indigo-500" />,
      title: "Find Qibla Direction",
      desc: "Use the built-in compass to locate the exact Qibla direction.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-rose-500" />,
      title: "Read Daily Duas",
      desc: "Access a collection of authentic duas to enrich your prayers.",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/professional-islamic-bg.png)" }}
      />
      <div className={`fixed inset-0 ${isDark ? "bg-gradient-to-br from-slate-900/75 via-gray-900/70 to-slate-900/80" : "bg-gradient-to-br from-blue-900/60 via-indigo-900/55 to-purple-900/60"}`} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-2xl mb-3">Getting Started</h1>
          <p className="text-white/85 max-w-2xl mx-auto">
            A quick guide to help you get the most out of your Prayer Times experience.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {steps.map((step, idx) => (
            <Card
              key={idx}
              className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <CardHeader className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/80 shadow-inner">
                  {step.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-white text-center">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-white/85 text-sm text-center px-4">{step.desc}</CardContent>
            </Card>
          ))}
        </div>

        {/* Feature details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center"><MapPin className="w-5 h-5 mr-2" /> Cities & Regions</CardTitle>
            </CardHeader>
            <CardContent className="text-white/85 text-sm">
              Select your city from a curated Algerian list or search quickly by name or region. Times are calculated using reliable methods and adjusted by locale.
            </CardContent>
          </Card>

          <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center"><Bell className="w-5 h-5 mr-2" /> Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent className="text-white/85 text-sm">
              Enable notifications to receive timely reminders: 15 minutes, 5 minutes before, and exactly at prayer time—so you never miss Salah.
            </CardContent>
          </Card>

          <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center"><Compass className="w-5 h-5 mr-2" /> Qibla Compass</CardTitle>
            </CardHeader>
            <CardContent className="text-white/85 text-sm">
              Use the Qibla compass for precise direction to the Kaaba. On iOS, allow motion access when prompted to enable live orientation.
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl mb-10">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Helpful Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-white/85 text-sm space-y-2">
            <p>• Compare times with your local mosque if needed.</p>
            <p>• Keep notifications enabled to receive reminders even if the site is open in a background tab.</p>
            <p>• Accuracy is typically within ±2 minutes depending on your region.</p>
          </CardContent>
        </Card>

        {/* Back */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="px-8">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
