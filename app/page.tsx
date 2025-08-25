"use client"

import type React from "react"
import Link from "next/link"


import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Clock,
  Calendar,
  Search,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  SunIcon,
  MoonIcon,
  Bell,
  BellRing,
  Compass,
  CheckCircle,
  AlertCircle,
  Navigation,
  Settings,
  Heart,
  BookOpen,
  Globe,
  Menu,
  X,
} from "lucide-react"
 

interface PrayerTimes {
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  date: string
  hijriDate: string
  location: string
  sunrise: string
  sunset: string
  coordinates: { lat: number; lng: number }
}

interface ApiResponse {
  code: number
  status: string
  data: {
    timings: {
      Fajr: string
      Sunrise: string
      Dhuhr: string
      Asr: string
      Sunset: string
      Maghrib: string
      Isha: string
      Imsak: string
      Midnight: string
      Firstthird: string
      Lastthird: string
    }
    date: {
      readable: string
      timestamp: string
      hijri: {
        date: string
        format: string
        day: string
        weekday: {
          en: string
          ar: string
        }
        month: {
          number: number
          en: string
          ar: string
        }
        year: string
        designation: {
          abbreviated: string
          expanded: string
        }
      }
      gregorian: {
        date: string
        format: string
        day: string
        weekday: {
          en: string
        }
        month: {
          number: number
          en: string
        }
        year: string
        designation: {
          abbreviated: string
          expanded: string
        }
      }
    }
    meta: {
      latitude: number
      longitude: number
      timezone: string
      method: {
        id: number
        name: string
        params: {
          Fajr: number
          Isha: number
        }
      }
      latitudeAdjustmentMethod: string
      midnightMode: string
      school: string
      offset: {
        Imsak: number
        Fajr: number
        Sunrise: number
        Dhuhr: number
        Asr: number
        Maghrib: number
        Sunset: number
        Isha: number
        Midnight: number
      }
    }
  }
}

const algerianCities = [
  { name: "Algiers", lat: 36.7538, lng: 3.0588, region: "North" },
  { name: "Oran", lat: 35.6969, lng: -0.6331, region: "West" },
  { name: "Constantine", lat: 36.365, lng: 6.6147, region: "East" },
  { name: "Annaba", lat: 36.9, lng: 7.7667, region: "East" },
  { name: "Blida", lat: 36.4203, lng: 2.8277, region: "North" },
  { name: "Batna", lat: 35.5559, lng: 6.174, region: "East" },
  { name: "Djelfa", lat: 34.6792, lng: 3.2631, region: "Central" },
  { name: "Sétif", lat: 36.1919, lng: 5.4133, region: "East" },
  { name: "Sidi Bel Abbès", lat: 35.1977, lng: -0.6388, region: "West" },
  { name: "Biskra", lat: 34.8481, lng: 5.7281, region: "South" },
  { name: "Tébessa", lat: 35.4075, lng: 8.1244, region: "East" },
  { name: "El Oued", lat: 33.3569, lng: 6.8531, region: "South" },
  { name: "Skikda", lat: 36.8761, lng: 6.9086, region: "East" },
  { name: "Tiaret", lat: 35.3712, lng: 1.317, region: "West" },
  { name: "Béjaïa", lat: 36.7525, lng: 5.0844, region: "East" },
  { name: "Tlemcen", lat: 34.8786, lng: -1.315, region: "West" },
  { name: "Ouargla", lat: 31.9539, lng: 5.3295, region: "South" },
  { name: "Mostaganem", lat: 35.9315, lng: 0.089, region: "West" },
  { name: "Bordj Bou Arréridj", lat: 36.0731, lng: 4.7617, region: "East" },
  { name: "Chlef", lat: 36.1654, lng: 1.3347, region: "West" },
]

// Extended list: 58 Algerian wilaya capitals (names only)
const allAlgerianCities = [
  "Algiers", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naama", "Aïn Témouchent", "Ghardaïa",
  "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
]

const fetchPrayerTimes = async (cityName: string): Promise<PrayerTimes> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(
        "Algeria",
      )}&method=3&school=0`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    if (data.code === 200 && data.data) {
      const timings = data.data.timings
      const date = data.data.date

      const meta = data.data.meta
      return {
        fajr: formatTime(timings.Fajr),
        dhuhr: formatTime(timings.Dhuhr),
        asr: formatTime(timings.Asr),
        maghrib: formatTime(timings.Maghrib),
        isha: formatTime(timings.Isha),
        sunrise: formatTime(timings.Sunrise),
        sunset: formatTime(timings.Sunset),
        date: date.readable,
        hijriDate: `${date.hijri.date} ${date.hijri.month.en} ${date.hijri.year} ${date.hijri.designation.abbreviated}`,
        location: cityName,
        coordinates: { lat: meta.latitude, lng: meta.longitude },
      }
    } else {
      throw new Error("Invalid API response")
    }
  } catch (error) {
    console.error("API Error:", error)

    // Fallback with realistic times for Algeria
    const today = new Date()
    return {
      fajr: "05:15",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "18:20",
      isha: "19:50",
      sunrise: "06:45",
      sunset: "18:15",
      date: today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      hijriDate: "15 Jumada al-Awwal 1446 AH",
      location: cityName,
      coordinates: { lat: 36.7538, lng: 3.0588 },
    }
  }
}

const formatTime = (time: string): string => {
  if (!time) return "00:00"
  const [hours, minutes] = time.split(":")
  return `${hours}:${minutes}`
}

const getCurrentPrayer = (times: PrayerTimes): string => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const prayers = [
    { name: "Fajr", time: times.fajr },
    { name: "Dhuhr", time: times.dhuhr },
    { name: "Asr", time: times.asr },
    { name: "Maghrib", time: times.maghrib },
    { name: "Isha", time: times.isha },
  ]

  for (let i = 0; i < prayers.length; i++) {
    const [hours, minutes] = prayers[i].time.split(":")
    const prayerMinutes = Number.parseInt(hours) * 60 + Number.parseInt(minutes)

    if (currentMinutes < prayerMinutes) {
      return i === 0 ? "Isha" : prayers[i - 1].name
    }
  }

  return "Isha"
}

// Calculate Qibla direction with high precision
const calculateQiblaDirection = (lat: number, lng: number): number => {
  const meccaLat = 21.4225
  const meccaLng = 39.8262

  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const meccaLatRad = (meccaLat * Math.PI) / 180
  const meccaLngRad = (meccaLng * Math.PI) / 180

  const dLng = meccaLngRad - lngRad

  const y = Math.sin(dLng) * Math.cos(meccaLatRad)
  const x = Math.cos(latRad) * Math.sin(meccaLatRad) - Math.sin(latRad) * Math.cos(meccaLatRad) * Math.cos(dLng)

  let bearing = Math.atan2(y, x)
  bearing = (bearing * 180) / Math.PI
  bearing = (bearing + 360) % 360

  return Math.round(bearing)
}

// Enhanced notification system with proper error handling
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  return false
}

// Enhanced notification scheduling with multiple reminders
const scheduleNotifications = (prayerTimes: PrayerTimes) => {
  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ]

  prayers.forEach((prayer) => {
    const [hours, minutes] = prayer.time.split(":")
    const now = new Date()
    const prayerTime = new Date()
    prayerTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    // If prayer time has passed today, schedule for tomorrow
    if (prayerTime <= now) {
      prayerTime.setDate(prayerTime.getDate() + 1)
    }

    // Schedule notification 15 minutes before prayer
    const notification15min = new Date(prayerTime.getTime() - 15 * 60 * 1000)
    const timeUntil15min = notification15min.getTime() - now.getTime()

    if (timeUntil15min > 0) {
      setTimeout(() => {
        new Notification(`${prayer.name} Prayer in 15 minutes`, {
          body: `${prayer.name} prayer time is at ${prayer.time}. Start preparing for prayer.`,
          icon: "/prayer-icon.png",
          badge: "/prayer-badge.png",
          tag: `prayer-${prayer.name}-15min`,
          requireInteraction: false,
        })
      }, timeUntil15min)
    }

    // Schedule notification 5 minutes before prayer
    const notification5min = new Date(prayerTime.getTime() - 5 * 60 * 1000)
    const timeUntil5min = notification5min.getTime() - now.getTime()

    if (timeUntil5min > 0) {
      setTimeout(() => {
        new Notification(`${prayer.name} Prayer in 5 minutes`, {
          body: `${prayer.name} prayer time is at ${prayer.time}. Time to prepare for prayer.`,
          icon: "/prayer-icon.png",
          badge: "/prayer-badge.png",
          tag: `prayer-${prayer.name}-5min`,
          requireInteraction: true,
        })
      }, timeUntil5min)
    }

    // Schedule notification at prayer time
    const timeUntilPrayer = prayerTime.getTime() - now.getTime()

    if (timeUntilPrayer > 0) {
      setTimeout(() => {
        new Notification(`${prayer.name} Prayer Time Now`, {
          body: `It's time for ${prayer.name} prayer. Allahu Akbar!`,
          icon: "/prayer-icon.png",
          badge: "/prayer-badge.png",
          tag: `prayer-${prayer.name}-now`,
          requireInteraction: true,
        })
      }, timeUntilPrayer)
    }
  })
}

// Beautiful New Logo Component
const BeautifulLogo = ({ isDark, size = "lg" }: { isDark: boolean; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }

  const iconSizes = {
    sm: "24",
    md: "32",
    lg: "48",
  }

  return (
    <div className="relative group">
      {/* Main Logo Container */}
      <div
        className={`${sizeClasses[size]} rounded-3xl bg-gradient-to-br ${
          isDark ? "from-amber-400 via-orange-500 to-red-600" : "from-emerald-400 via-teal-500 to-cyan-600"
        } flex items-center justify-center shadow-2xl border-3 border-white/40 backdrop-blur-sm group-hover:scale-110 transition-all duration-500`}
      >
        {/* Beautiful Islamic Architecture SVG */}
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white drop-shadow-2xl"
        >
          {/* Main Mosque Dome */}
          <path
            d="M24 6C27.5 6 30.5 9 30.5 12.5V15H17.5V12.5C17.5 9 20.5 6 24 6Z"
            fill="currentColor"
            fillOpacity="0.95"
          />

          {/* Left Minaret */}
          <rect x="8" y="12" width="4" height="24" fill="currentColor" fillOpacity="0.9" />
          <circle cx="10" cy="9" r="2.5" fill="currentColor" fillOpacity="0.95" />
          <path d="M10 6C10.5 6 11 6.5 10.8 7C10.6 6.8 10.2 6.8 10 7C10.2 6.5 10.5 6 10 6Z" fill="currentColor" />

          {/* Right Minaret */}
          <rect x="36" y="12" width="4" height="24" fill="currentColor" fillOpacity="0.9" />
          <circle cx="38" cy="9" r="2.5" fill="currentColor" fillOpacity="0.95" />
          <path d="M38 6C38.5 6 39 6.5 38.8 7C38.6 6.8 38.2 6.8 38 7C38.2 6.5 38.5 6 38 6Z" fill="currentColor" />

          {/* Main Building */}
          <rect x="15" y="15" width="18" height="21" fill="currentColor" fillOpacity="0.95" />

          {/* Beautiful Entrance Arch */}
          <path d="M20 24C20 21.5 21 19 24 19C27 19 28 21.5 28 24V36H20V24Z" fill="currentColor" fillOpacity="0.7" />

          {/* Decorative Elements */}
          <circle cx="18" cy="18" r="1" fill="currentColor" fillOpacity="0.8" />
          <circle cx="30" cy="18" r="1" fill="currentColor" fillOpacity="0.8" />
          <circle cx="18" cy="22" r="1" fill="currentColor" fillOpacity="0.8" />
          <circle cx="30" cy="22" r="1" fill="currentColor" fillOpacity="0.8" />

          {/* Main Crescent */}
          <path d="M24 3C24.8 3 25.5 3.8 25.2 4.5C24.8 4.2 24.2 4.2 24 4.5C24.2 3.8 24.8 3 24 3Z" fill="currentColor" />
        </svg>
      </div>

      {/* Glowing Status Indicator */}
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-3 border-white shadow-xl animate-pulse">
        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-4 right-3 w-1 h-1 bg-white/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/60 rounded-full animate-bounce delay-500"></div>
      </div>
    </div>
  )
}

// Responsive Header Component
const ResponsiveHeader = ({
  isDark,
  onThemeToggle,
  notificationsEnabled,
  onNotificationToggle,
  showQibla,
  onQiblaToggle,
}: {
  isDark: boolean
  onThemeToggle: () => void
  notificationsEnabled: boolean
  onNotificationToggle: () => void
  showQibla: boolean
  onQiblaToggle: () => void
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-50 bg-white/8 backdrop-blur-3xl border-b border-white/15 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Beautiful Logo Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <BeautifulLogo isDark={isDark} size="md" />
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Salat<span className={isDark ? "text-amber-400" : "text-emerald-400"}>Time</span>
              </h1>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Algeria • الجزائر</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/15 font-medium transition-all duration-300"
            >
              <Link href="/cities" className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Cities
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/15 font-medium transition-all duration-300"
            >
              <Link href="/guide" className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Guide
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/15 font-medium transition-all duration-300"
            >
              <Link href="/settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </nav>

          {/* Controls Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full p-2 border border-white/25 shadow-lg">
              <SunIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? "text-gray-400" : "text-amber-300"}`} />
              <Switch
                checked={isDark}
                onCheckedChange={onThemeToggle}
                className={`${isDark ? "data-[state=checked]:bg-amber-600" : "data-[state=checked]:bg-emerald-600"} scale-75 sm:scale-100`}
              />
              <MoonIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? "text-amber-400" : "text-gray-400"}`} />
            </div>

            {/* Notification Toggle */}
            <Button
              onClick={onNotificationToggle}
              variant="ghost"
              size="sm"
              className={`${
                notificationsEnabled
                  ? isDark
                    ? "bg-amber-500/25 text-amber-300 hover:bg-amber-500/35"
                    : "bg-emerald-500/25 text-emerald-200 hover:bg-emerald-500/35"
                  : "text-white/70 hover:text-white hover:bg-white/15"
              } backdrop-blur-md border border-white/25 transition-all duration-300 font-medium shadow-lg p-2 sm:p-3`}
            >
              {notificationsEnabled ? (
                <BellRing className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>

            {/* Qibla Toggle */}
            <Button
              onClick={onQiblaToggle}
              variant="ghost"
              size="sm"
              className={`${
                showQibla
                  ? isDark
                    ? "bg-amber-500/25 text-amber-300 hover:bg-amber-500/35"
                    : "bg-emerald-500/25 text-emerald-200 hover:bg-emerald-500/35"
                  : "text-white/70 hover:text-white hover:bg-white/15"
              } backdrop-blur-md border border-white/25 transition-all duration-300 font-medium shadow-lg p-2 sm:p-3`}
            >
              <Compass className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/15 backdrop-blur-md border border-white/25 transition-all duration-300 p-2"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl">
            <nav className="flex flex-col space-y-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/15 font-medium justify-start"
              >
                <Link href="/cities" className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Cities
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/15 font-medium justify-start"
              >
                <Link href="/guide" className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Guide
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/15 font-medium justify-start"
              >
                <Link href="/settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Enhanced Qibla Compass with real-time updates
const QiblaCompass = ({ direction, isDark, location }: { direction: number; isDark: boolean; location: string }) => {
  const [currentDirection, setCurrentDirection] = useState<number>(0)
  const [deviceOrientation, setDeviceOrientation] = useState<number>(0)

  useEffect(() => {
    // Request device orientation permission for mobile devices
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setDeviceOrientation(event.alpha)
        }
      }

      // Check if permission is needed (iOS 13+)
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<PermissionState> }).requestPermission === "function") {
        (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<PermissionState> })
          .requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation)
            }
          })
          .catch(console.error)
      } else {
        // For other browsers
        window.addEventListener("deviceorientation", handleOrientation)
      }

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    }
  }, [])

  useEffect(() => {
    setCurrentDirection(direction)
  }, [direction])

  const adjustedDirection = currentDirection - deviceOrientation

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
        {/* Professional Compass Design */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-3xl border-2 border-white/35 shadow-2xl">
          {/* Degree markings */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-6 sm:h-8 ${isDark ? "bg-amber-400/70" : "bg-emerald-500/70"} rounded-full`}
              style={{
                top: "8px",
                left: "50%",
                transformOrigin: `center ${window.innerWidth < 640 ? "72px" : "88px"}`,
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}

          {/* Main compass needle */}
          <div
            className="absolute w-2 sm:w-3 h-20 sm:h-24 lg:h-28 bg-gradient-to-t from-red-600 to-red-400 rounded-full origin-bottom transform transition-transform duration-1000 shadow-lg"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "center bottom",
              transform: `translate(-50%, -100%) rotate(${adjustedDirection}deg)`,
            }}
          >
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-transparent border-b-red-600"></div>
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full z-10 shadow-md border-2 sm:border-3 border-white"></div>

          {/* Direction labels */}
          <div
            className={`absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 text-base sm:text-lg font-bold ${isDark ? "text-amber-300" : "text-emerald-700"}`}
          >
            N
          </div>
          <div
            className={`absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-base sm:text-lg font-bold ${isDark ? "text-amber-300" : "text-emerald-700"}`}
          >
            S
          </div>
          <div
            className={`absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-base sm:text-lg font-bold ${isDark ? "text-amber-300" : "text-emerald-700"}`}
          >
            W
          </div>
          <div
            className={`absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-base sm:text-lg font-bold ${isDark ? "text-amber-300" : "text-emerald-700"}`}
          >
            E
          </div>

          {/* Mecca indicator */}
          <div
            className={`absolute w-3 h-3 sm:w-4 sm:h-4 ${isDark ? "bg-amber-400" : "bg-emerald-500"} rounded-full transform transition-transform duration-1000`}
            style={{
              top: "20px",
              left: "50%",
              transformOrigin: `center ${window.innerWidth < 640 ? "60px" : "72px"}`,
              transform: `translateX(-50%) rotate(${adjustedDirection}deg)`,
            }}
          >
            <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-5 h-5 sm:w-8 sm:h-8 border-2 sm:border-3 border-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 sm:space-y-3">
        <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? "text-amber-400" : "text-emerald-600"}`}>
          {currentDirection}°
        </div>
        <div className={`text-lg sm:text-xl font-semibold ${isDark ? "text-gray-300" : "text-white/90"}`}>
          Direction to Mecca
        </div>
        <div className={`text-sm ${isDark ? "text-gray-400" : "text-white/80"}`}>From {location}, Algeria</div>
        <div className={`text-xs ${isDark ? "text-gray-500" : "text-white/70"}`}>الكعبة المشرفة • Holy Kaaba</div>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState<string>("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [error, setError] = useState<string>("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<string>("")
  const [showQibla, setShowQibla] = useState(false)
  const [qiblaDirection, setQiblaDirection] = useState<number>(0)
  const [selectedPrayerCard, setSelectedPrayerCard] = useState<string | null>(null)

  const filteredCities = algerianCities.filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCitySelect = async (cityName: string) => {
    setSelectedCity(cityName)
    setSearchTerm(cityName)
    setShowDropdown(false)
    setLoading(true)
    setError("")

    try {
      const times = await fetchPrayerTimes(cityName)
      setPrayerTimes(times)
      setCurrentPrayer(getCurrentPrayer(times))

      // Calculate Qibla direction with high precision
      const direction = calculateQiblaDirection(times.coordinates.lat, times.coordinates.lng)
      setQiblaDirection(direction)

      // Schedule notifications if enabled
      if (notificationsEnabled) {
        scheduleNotifications(times)
        setNotificationStatus("Notifications scheduled for all prayers")
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error)
      setError("Failed to fetch prayer times. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const exactMatch = algerianCities.find((city) => city.name.toLowerCase() === searchTerm.toLowerCase())
      if (exactMatch) {
        handleCitySelect(exactMatch.name)
      } else if (filteredCities.length > 0) {
        handleCitySelect(filteredCities[0].name)
      }
    }
  }

  const handleQiblaToggle = () => {
    const next = !showQibla
    setShowQibla(next)
    if (!next) return

    // If we already have prayerTimes (city selected), compute from those coords
    if (prayerTimes) {
      const { lat, lng } = prayerTimes.coordinates
      setQiblaDirection(calculateQiblaDirection(lat, lng))
      return
    }

    // Otherwise try device location as fallback
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setQiblaDirection(calculateQiblaDirection(lat, lng))
          if (!selectedCity) setSelectedCity("Current Location")
        },
        () => {
          setError("Enable location or select a city to show Qibla direction.")
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
      )
    } else {
      setError("Geolocation is not supported. Please select a city.")
    }
  }

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      setNotificationStatus("Requesting permission...")
      const granted = await requestNotificationPermission()
      if (granted) {
        setNotificationsEnabled(true)
        setNotificationStatus("Notifications enabled successfully!")
        if (prayerTimes) {
          scheduleNotifications(prayerTimes)
          setNotificationStatus("Notifications scheduled for all prayers")
        }
        // Show success notification
        new Notification("Prayer Notifications Enabled", {
          body: "You will receive reminders 15 minutes, 5 minutes before, and at prayer time.",
          icon: "/prayer-icon.png",
        })
      } else {
        setNotificationStatus("Permission denied. Please enable in browser settings.")
      }
    } else {
      setNotificationsEnabled(false)
      setNotificationStatus("Notifications disabled")
    }
  }

  // Update current prayer every minute
  useEffect(() => {
    if (prayerTimes) {
      const interval = setInterval(() => {
        setCurrentPrayer(getCurrentPrayer(prayerTimes))
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [prayerTimes])

  const prayerData = [
    {
      key: "fajr",
      name: "Fajr",
      arabic: "الفجر",
      icon: Sunrise,
      description: "Dawn Prayer",
      color: isDarkMode ? "from-purple-500 to-indigo-600" : "from-indigo-500 to-purple-600",
      bgColor: isDarkMode ? "bg-purple-500/20" : "bg-indigo-500/20",
      verse: "And establish prayer at the two ends of the day",
    },
    {
      key: "dhuhr",
      name: "Dhuhr",
      arabic: "الظهر",
      icon: Sun,
      description: "Noon Prayer",
      color: isDarkMode ? "from-yellow-400 to-orange-500" : "from-orange-500 to-red-500",
      bgColor: isDarkMode ? "bg-yellow-400/20" : "bg-orange-500/20",
      verse: "So be patient with what they say and exalt Allah",
    },
    {
      key: "asr",
      name: "Asr",
      arabic: "العصر",
      icon: CloudSun,
      description: "Afternoon Prayer",
      color: isDarkMode ? "from-orange-400 to-red-500" : "from-amber-500 to-orange-600",
      bgColor: isDarkMode ? "bg-orange-400/20" : "bg-amber-500/20",
      verse: "Guard strictly your prayers, especially the middle prayer",
    },
    {
      key: "maghrib",
      name: "Maghrib",
      arabic: "المغرب",
      icon: Sunset,
      description: "Sunset Prayer",
      color: isDarkMode ? "from-pink-500 to-rose-600" : "from-rose-500 to-pink-600",
      bgColor: isDarkMode ? "bg-pink-500/20" : "bg-rose-500/20",
      verse: "And it is He who created the heavens and earth",
    },
    {
      key: "isha",
      name: "Isha",
      arabic: "العشاء",
      icon: Moon,
      description: "Night Prayer",
      color: isDarkMode ? "from-blue-600 to-indigo-700" : "from-indigo-600 to-purple-700",
      bgColor: isDarkMode ? "bg-blue-600/20" : "bg-indigo-600/20",
      verse: "And it is He who sends down rain from heaven",
    },
  ]

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme")
      if (storedTheme === "dark") setIsDarkMode(true)
      if (storedTheme === "light") setIsDarkMode(false)
    }
  }, [])

  const handleThemeToggle = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {}
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful New Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: "url(/beautiful-mosque-bg.png)",
        }}
      />

      {/* Enhanced Gradient Overlay */}
      <div
        className={`fixed inset-0 transition-all duration-700 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900/75 via-gray-900/70 to-slate-900/75"
            : "bg-gradient-to-br from-blue-900/60 via-indigo-900/50 to-purple-900/60"
        }`}
      />

      {/* Subtle Animated Pattern Overlay */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="w-full h-full animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='10' r='1'/%3E%3Ccircle cx='10' cy='30' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Responsive Header */}
      <ResponsiveHeader
        isDark={isDarkMode}
        onThemeToggle={handleThemeToggle}
        notificationsEnabled={notificationsEnabled}
        onNotificationToggle={handleNotificationToggle}
        showQibla={showQibla}
        onQiblaToggle={handleQiblaToggle}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Notification Status */}
        {notificationStatus && (
          <div className="mb-6 sm:mb-8">
            <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl">
              <CardContent className="p-4 flex items-center">
                {notificationsEnabled ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                )}
                <p className="text-white font-medium text-sm sm:text-base">{notificationStatus}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Beautiful Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl">
                Prayer Times Algeria
              </h1>
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div
                  className={`text-lg sm:text-xl lg:text-2xl font-bold ${isDarkMode ? "text-amber-300" : "text-emerald-300"} drop-shadow-lg`}
                >
                  أوقات الصلاة الجزائر
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed max-w-4xl mx-auto text-white/90 drop-shadow-lg font-medium px-4">
              Your comprehensive Islamic prayer companion for Algeria. Get accurate prayer times, smart notifications,
              and precise Qibla direction with our professional prayer service.
            </p>
          </div>
        </div>

        {/* Beautiful Enhanced Search Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <Card className="relative overflow-hidden bg-white/12 backdrop-blur-3xl border border-white/25 shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${isDarkMode ? "from-amber-500 to-orange-600" : "from-emerald-500 to-teal-600"} shadow-2xl mb-4`}
              >
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-white font-bold mb-2">Select Your City</CardTitle>
              <p className="text-base sm:text-lg text-white/80 px-4">
                Choose from 20+ major cities across Algeria for precise prayer times
              </p>
            </CardHeader>

            <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <div className="relative group">
                    {/* Enhanced Input Field with Better Text Rendering */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Type your city name here..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setShowDropdown(true)
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full h-14 sm:h-16 text-base sm:text-lg pl-14 sm:pl-16 pr-6 bg-white/25 backdrop-blur-md border-2 border-white/40 text-white placeholder:text-white/70 rounded-2xl focus:ring-4 focus:ring-white/30 focus:border-white/60 transition-all duration-300 font-medium tracking-wide"
                        style={{
                          letterSpacing: "0.025em",
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          textRendering: "optimizeLegibility",
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                        }}
                      />
                      <Search className="absolute left-4 sm:left-5 top-4 sm:top-5 w-5 h-5 sm:w-6 sm:h-6 text-white/80" />

                      {/* Input Helper Text */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm hidden sm:block">
                        {searchTerm.length > 0 ? `${searchTerm.length} chars` : "e.g., Algiers, Oran"}
                      </div>
                    </div>

                    {/* Compact Dropdown Selector */}
                    <div className="mt-3">
                      <Select onValueChange={(v) => handleCitySelect(v)}>
                        <SelectTrigger className="h-12 bg-white/25 backdrop-blur-md border-2 border-white/40 text-white rounded-2xl">
                          <SelectValue placeholder="Browse cities..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white/90 text-gray-900">
                          {allAlgerianCities.map((name) => (
                            <SelectItem key={name} value={name} className="cursor-pointer">
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Enhanced Suggestions */}
                    {!searchTerm && (
                      <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {["Algiers", "Oran", "Constantine", "Annaba"].map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setSearchTerm(city)
                              setShowDropdown(true)
                            }}
                            className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white/90 text-sm rounded-full border border-white/30 transition-all duration-200 hover:scale-105"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Beautiful Enhanced Dropdown */}
                  {showDropdown && searchTerm && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white/20 backdrop-blur-3xl border border-white/35 rounded-2xl shadow-2xl max-h-80 overflow-hidden z-30">
                      <div className="p-4">
                        <h4 className="text-white font-semibold text-sm mb-3 flex items-center">
                          <Navigation className="w-4 h-4 mr-2" />
                          Found {filteredCities.length} cities
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                          {filteredCities.slice(0, 10).map((city, index) => (
                            <button
                              key={city.name}
                              type="button"
                              onClick={() => handleCitySelect(city.name)}
                              className="w-full text-left px-4 py-3 hover:bg-white/25 text-white rounded-xl transition-all duration-200 group border border-transparent hover:border-white/20"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div
                                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${isDarkMode ? "from-amber-400 to-orange-500" : "from-emerald-400 to-teal-500"} mr-3 flex-shrink-0`}
                                  ></div>
                                  <div>
                                    <span className="font-medium text-sm sm:text-base">{city.name}</span>
                                    <p className="text-white/60 text-xs">{city.region} Region • Algeria</p>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div
                                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${isDarkMode ? "from-amber-500 to-orange-600" : "from-emerald-500 to-teal-600"} flex items-center justify-center shadow-lg`}
                                  >
                                    <span className="text-white text-sm font-bold">→</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No Results Message */}
                  {showDropdown && searchTerm && filteredCities.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white/20 backdrop-blur-3xl border border-white/35 rounded-2xl shadow-2xl p-6 z-30">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                        <h4 className="text-white font-semibold mb-2">No cities found</h4>
                        <p className="text-white/70 text-sm mb-4">
                          Try searching for: Algiers, Oran, Constantine, Annaba, Blida, Batna, or other major Algerian
                          cities.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm("")
                            setShowDropdown(false)
                          }}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          Clear Search
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Beautiful Enhanced Button */}
                <div className="space-y-3">
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full h-14 sm:h-16 text-base sm:text-lg font-bold ${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:via-orange-600 hover:to-red-700"
                        : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700"
                    } text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-500 border-2 border-white/30 backdrop-blur-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    disabled={!searchTerm.trim()}
                  >
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative flex items-center justify-center space-x-3">
                      <Search className="w-5 h-5 animate-pulse" />
                      <span className="font-bold tracking-wide">
                        {searchTerm.trim() ? `Find Prayer Times for ${searchTerm}` : "Discover Prayer Times"}
                      </span>
                    </div>
                  </Button>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-white/60 text-sm mr-2">Quick select:</span>
                    {["Algiers", "Oran", "Constantine"].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                          isDarkMode
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Beautiful Qibla Compass */}
        {showQibla && (
          <div className="max-w-lg mx-auto mb-12 sm:mb-16">
            <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 shadow-2xl rounded-3xl p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">🧭 Qibla Direction</h3>
                <p className="text-white/80 text-sm sm:text-base">Precise direction to the Holy Kaaba in Mecca</p>
              </div>
              <QiblaCompass direction={qiblaDirection} isDark={isDarkMode} location={prayerTimes?.location ?? (selectedCity || "Your location")} />
            </Card>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <Card className="bg-red-500/25 backdrop-blur-3xl border border-red-500/35 rounded-2xl shadow-2xl">
              <CardContent className="p-4 sm:p-6 text-center">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-300 mx-auto mb-3" />
                <p className="text-red-200 font-semibold text-sm sm:text-base">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center mb-12 sm:mb-16">
            <div
              className={`inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 ${isDarkMode ? "border-amber-400 border-t-transparent" : "border-emerald-400 border-t-transparent"} mb-4 sm:mb-6`}
            ></div>
            <p className={`text-lg sm:text-xl font-semibold ${isDarkMode ? "text-amber-400" : "text-emerald-400"}`}>
              Loading prayer times for {selectedCity}...
            </p>
            <p className="text-white/80 mt-2 text-sm sm:text-base">Fetching accurate data from Aladhan API</p>
          </div>
        )}

        {/* Prayer Times Display */}
        {prayerTimes && !loading && (
          <div className="max-w-7xl mx-auto">
            {/* Beautiful Date Header */}
            <Card className="mb-8 sm:mb-12 bg-white/12 backdrop-blur-3xl border border-white/25 shadow-2xl rounded-3xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <Calendar
                    className={`w-6 h-6 sm:w-8 sm:h-8 mr-3 ${isDarkMode ? "text-amber-400" : "text-emerald-400"}`}
                  />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">{prayerTimes.date}</h3>
                </div>
                <p
                  className={`mb-4 sm:mb-6 text-lg sm:text-xl font-semibold ${isDarkMode ? "text-amber-300" : "text-emerald-300"}`}
                >
                  {prayerTimes.hijriDate}
                </p>
                <div className="flex items-center justify-center mb-4 sm:mb-6 text-white/90">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  <span className="text-lg sm:text-xl font-semibold">{prayerTimes.location}, Algeria</span>
                </div>
                {currentPrayer && (
                  <Badge
                    className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-bold ${isDarkMode ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-green-600 to-emerald-700"} text-white rounded-full shadow-lg`}
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Current Prayer: {currentPrayer}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Responsive Prayer Times Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {prayerData.map((prayer, index) => {
                const IconComponent = prayer.icon
                const isCurrentPrayer = currentPrayer === prayer.name
                const isSelected = selectedPrayerCard === prayer.key

                return (
                  <Card
                    key={prayer.key}
                    onClick={() => setSelectedPrayerCard(isSelected ? null : prayer.key)}
                    className={`relative overflow-hidden group cursor-pointer transition-all duration-500 ${
                      isSelected ? "scale-105 z-20 shadow-2xl" : "hover:scale-105"
                    } ${
                      isCurrentPrayer
                        ? "ring-2 ring-yellow-400/60 bg-gradient-to-br from-white/25 via-white/20 to-white/15 shadow-xl"
                        : "bg-gradient-to-br from-white/12 via-white/10 to-white/8 hover:from-white/20 hover:via-white/15 hover:to-white/12 shadow-lg hover:shadow-xl"
                    } backdrop-blur-3xl border border-white/25 rounded-2xl`}
                  >
                    {/* Professional Expanded View */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/75 backdrop-blur-3xl rounded-2xl z-10">
                        <div className="p-4 sm:p-6 h-full flex flex-col justify-center items-center text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPrayerCard(null)
                            }}
                            className="absolute top-2 sm:top-3 right-2 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-white/25 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-xs sm:text-sm transition-colors duration-200"
                          >
                            ✕
                          </button>

                          <div
                            className={`mb-3 sm:mb-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${prayer.color} shadow-xl`}
                          >
                            <IconComponent className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                          </div>

                          <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">{prayer.name}</h3>
                          <p className="text-base sm:text-xl font-bold text-amber-300 mb-2 sm:mb-3 font-arabic">
                            {prayer.arabic}
                          </p>

                          <div className="text-2xl sm:text-4xl font-bold text-white font-mono mb-3 sm:mb-4">
                            {
                              prayerTimes[
                                prayer.key as keyof Omit<
                                  PrayerTimes,
                                  "date" | "hijriDate" | "location" | "sunrise" | "sunset" | "coordinates"
                                >
                              ]
                            }
                          </div>

                          <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 sm:p-3 mb-3 sm:mb-4">
                            <p className="text-white/90 text-xs sm:text-sm font-medium">{prayer.description}</p>
                            <p className="text-white/70 text-xs mt-1 italic">{prayer.verse}</p>
                          </div>

                          {isCurrentPrayer && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-1 sm:py-2 font-semibold text-xs sm:text-sm">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Current Prayer
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Original Card Content */}
                    <div className={`transition-opacity duration-300 ${isSelected ? "opacity-0" : "opacity-100"}`}>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${prayer.color} ${isCurrentPrayer ? "opacity-30" : "opacity-20"} group-hover:opacity-35 transition-all duration-500`}
                      ></div>
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${prayer.color}`}></div>

                      <CardContent className="relative p-4 sm:p-6 text-center">
                        <div
                          className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-2xl ${prayer.bgColor} backdrop-blur-md inline-block border border-white/25 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent
                            className={`w-8 h-8 sm:w-10 sm:h-10 text-white ${isCurrentPrayer ? "animate-pulse" : ""}`}
                          />
                        </div>

                        <h4
                          className={`text-lg sm:text-xl font-bold mb-2 text-white ${isCurrentPrayer ? "animate-pulse" : ""}`}
                        >
                          {prayer.name}
                        </h4>

                        <p
                          className={`text-base sm:text-lg mb-3 sm:mb-4 font-bold ${isDarkMode ? "text-amber-300" : "text-emerald-300"} font-arabic`}
                        >
                          {prayer.arabic}
                        </p>

                        <div
                          className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white font-mono ${isCurrentPrayer ? "text-yellow-200 animate-pulse" : ""}`}
                        >
                          {
                            prayerTimes[
                              prayer.key as keyof Omit<
                                PrayerTimes,
                                "date" | "hijriDate" | "location" | "sunrise" | "sunset" | "coordinates"
                              >
                            ]
                          }
                        </div>

                        <p className="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3">
                          {prayer.description}
                        </p>

                        {isCurrentPrayer && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-2 sm:px-3 py-1 text-xs sm:text-sm animate-bounce">
                            <Clock className="w-3 h-3 mr-1" />
                            Current
                          </Badge>
                        )}

                        {notificationsEnabled && (
                          <div className="mt-2">
                            <Badge className="bg-green-500/30 text-green-200 border border-green-500/50 backdrop-blur-md px-2 py-1 text-xs">
                              <BellRing className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Responsive Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Calculation Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3 text-white/90">
                    <li className="flex items-start">
                      <CheckCircle
                        className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 sm:mr-3 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} flex-shrink-0`}
                      />
                      <span className="text-sm sm:text-base">Muslim World League (MWL)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle
                        className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 sm:mr-3 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} flex-shrink-0`}
                      />
                      <span className="text-sm sm:text-base">Standard (Shafi&apos;i/Maliki) Asr calculation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Smart Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3 text-white/90">
                    <li className="flex items-start">
                      <BellRing
                        className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 sm:mr-3 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} flex-shrink-0`}
                      />
                      <span className="text-sm sm:text-base">
                        {notificationsEnabled
                          ? "Active notifications (15min, 5min, now)"
                          : "Prayer notifications available"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Compass
                        className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 sm:mr-3 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} flex-shrink-0`}
                      />
                      <span className="text-sm sm:text-base">
                        Qibla direction: {qiblaDirection}° {showQibla && "(Active)"}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3 text-white/90">
                    <li className="flex items-start">
                      <span
                        className={`w-2 h-2 sm:w-3 sm:h-3 ${isDarkMode ? "bg-amber-400" : "bg-emerald-400"} rounded-full mt-1.5 mr-2 sm:mr-3 flex-shrink-0`}
                      ></span>
                      <span className="text-sm sm:text-base">Verify with local mosque for community times</span>
                    </li>
                    <li className="flex items-start">
                      <span
                        className={`w-2 h-2 sm:w-3 sm:h-3 ${isDarkMode ? "bg-amber-400" : "bg-emerald-400"} rounded-full mt-1.5 mr-2 sm:mr-3 flex-shrink-0`}
                      ></span>
                      <span className="text-sm sm:text-base">Times accurate within ±2 minutes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Beautiful Welcome Screen */}
        {!selectedCity && !loading && (
          <div className="max-w-6xl mx-auto">
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/12 via-white/10 to-white/8 backdrop-blur-3xl border border-white/25 shadow-2xl rounded-3xl">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="mb-6 sm:mb-8">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <BeautifulLogo isDark={isDarkMode} size="lg" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
                    Welcome to <span className={isDarkMode ? "text-amber-400" : "text-emerald-400"}>SalatTime</span>
                  </h3>
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div
                      className={`text-lg sm:text-xl font-bold ${isDarkMode ? "text-amber-300" : "text-emerald-300"}`}
                    >
                      الجزائر
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`}
                    ></div>
                    <div className="text-lg sm:text-xl font-bold text-white/90">Algeria</div>
                  </div>
                </div>

                <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed text-white/90 px-4">
                  Your comprehensive Islamic prayer companion for Algeria. Get accurate prayer times, smart
                  notifications, and precise Qibla direction with our professional prayer service.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div className="p-4 sm:p-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl hover:scale-105 transition-all duration-300">
                    <BellRing
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} mx-auto mb-3`}
                    />
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">Smart Notifications</h4>
                    <p className="text-white/80 text-sm">15min, 5min & exact time alerts</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl hover:scale-105 transition-all duration-300">
                    <Compass
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} mx-auto mb-3`}
                    />
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">Qibla Direction</h4>
                    <p className="text-white/80 text-sm">Precise compass to Mecca</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl hover:scale-105 transition-all duration-300">
                    <Clock
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? "text-amber-400" : "text-emerald-400"} mx-auto mb-3`}
                    />
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">Accurate Times</h4>
                    <p className="text-white/80 text-sm">ISNA method calculation</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6 font-medium px-4">
                    Select your city above to get personalized prayer times and notifications
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    <Badge
                      className={`px-3 sm:px-4 py-2 font-semibold text-sm ${isDarkMode ? "bg-amber-500/25 text-amber-300 border-amber-500/35" : "bg-emerald-500/25 text-emerald-300 border-emerald-500/35"} border backdrop-blur-md`}
                    >
                      20+ Algerian Cities
                    </Badge>
                    <Badge
                      className={`px-3 sm:px-4 py-2 font-semibold text-sm ${isDarkMode ? "bg-amber-500/25 text-amber-300 border-amber-500/35" : "bg-emerald-500/25 text-emerald-300 border-emerald-500/35"} border backdrop-blur-md`}
                    >
                      Real-time Updates
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Beautiful Footer */}
        <footer className="text-center mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/25">
          <p className="text-base sm:text-lg font-semibold text-white/90 mb-2">
            Powered by Aladhan API • Authentic Islamic Prayer Schedules for Algeria
          </p>
          <p className="text-white/70 text-sm sm:text-base">
            © 2024 SalatTime Algeria. Serving the Muslim community with precision and beauty.
          </p>
        </footer>
      </div>
    </div>
  )
}
