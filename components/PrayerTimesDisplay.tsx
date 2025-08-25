import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar } from "lucide-react"

interface PrayerTime {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface PrayerTimesData {
  data: {
    timings: PrayerTime
    date: {
      readable: string
      hijri: {
        date: string
        month: {
          en: string
          ar: string
        }
        year: string
      }
    }
    meta: {
      timezone: string
    }
  }
}

async function getPrayerTimes(state: string): Promise<PrayerTimesData> {
  const response = await fetch(
    `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(state)}&country=Algeria&method=2`,
    { next: { revalidate: 3600 } }, // Cache for 1 hour
  )

  if (!response.ok) {
    throw new Error("Failed to fetch prayer times")
  }

  return response.json()
}

const PRAYER_NAMES = {
  Fajr: { en: "Fajr", ar: "الفجر", icon: "🌅" },
  Dhuhr: { en: "Dhuhr", ar: "الظهر", icon: "☀️" },
  Asr: { en: "Asr", ar: "العصر", icon: "🌤️" },
  Maghrib: { en: "Maghrib", ar: "المغرب", icon: "🌅" },
  Isha: { en: "Isha", ar: "العشاء", icon: "🌙" },
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function getCurrentPrayer(timings: PrayerTime): string | null {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const prayers = Object.entries(timings).map(([name, time]) => {
    const [hours, minutes] = time.split(":")
    return {
      name,
      minutes: Number.parseInt(hours) * 60 + Number.parseInt(minutes),
    }
  })

  prayers.sort((a, b) => a.minutes - b.minutes)

  for (let i = 0; i < prayers.length; i++) {
    const current = prayers[i]
    const next = prayers[i + 1] || prayers[0] // Wrap to next day

    if (currentTime >= current.minutes && (next.minutes > current.minutes ? currentTime < next.minutes : true)) {
      return current.name
    }
  }

  return null
}

export default async function PrayerTimesDisplay({ state }: { state: string }) {
  try {
    const data = await getPrayerTimes(state)
    const { timings, date, meta } = data.data
    const currentPrayer = getCurrentPrayer(timings)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{state}, Algeria</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{date.readable}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">
            {date.hijri.date} {date.hijri.month.en} {date.hijri.year} AH
          </div>
          <div className="text-xs text-gray-500">Timezone: {meta.timezone}</div>
        </div>

        <div className="space-y-3">
          {Object.entries(PRAYER_NAMES).map(([prayerKey, prayerInfo]) => {
            const time = timings[prayerKey as keyof PrayerTime]
            const isCurrentPrayer = currentPrayer === prayerKey

            return (
              <Card
                key={prayerKey}
                className={`transition-all ${isCurrentPrayer ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{prayerInfo.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{prayerInfo.en}</div>
                        <div className="text-sm text-gray-600 font-arabic">{prayerInfo.ar}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentPrayer && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-lg font-mono font-semibold">
                        <Clock className="w-4 h-4" />
                        {formatTime(time)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center text-xs text-gray-500 mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">🕌 Prayer times calculated using ISNA method</p>
          <p>Times are automatically updated daily</p>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold">Unable to fetch prayer times</h3>
          <p className="text-sm text-gray-600 mt-2">
            Please check the state name and try again. Make sure you have an internet connection.
          </p>
        </div>
      </div>
    )
  }
}
