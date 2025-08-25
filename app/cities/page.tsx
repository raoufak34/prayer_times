"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cities: string[] = [
  "Algiers", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Djelfa",
  "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine",
  "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naama", "Aïn Témouchent", "Ghardaïa", "Relizane",
  "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam",
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
]

export default function CitiesPage() {
  const [query, setQuery] = useState<string>("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cities
    return cities.filter((name) => name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/mosque-minaret-bg.png)" }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/55 to-purple-900/60" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-2xl mb-3">Explore Algerian Cities</h1>
          <p className="text-white/85 max-w-2xl mx-auto">
            Browse a curated list of cities across Algeria. Use the search to quickly find your city.
          </p>
        </div>

        <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-3xl shadow-2xl mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-xl sm:text-2xl font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" /> Cities Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city or region..."
                className="h-12 pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 text-sm">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((name) => (
                <Card
                  key={name}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/12 via-white/10 to-white/8 border border-white/25 rounded-2xl hover:from-white/20 hover:via-white/15 hover:to-white/12 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 opacity-70" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 mr-3" />
                        <h3 className="text-white font-semibold text-lg">{name}</h3>
                      </div>
                      <Badge className="bg-emerald-500/25 text-emerald-200 border border-emerald-500/40">Wilaya</Badge>
                    </div>
                    <div className="flex items-center text-white/85 text-sm"><MapPin className="w-4 h-4 mr-2 text-emerald-300" /> Algeria</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-10 text-white/80">No cities match your search.</div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg" className="px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


