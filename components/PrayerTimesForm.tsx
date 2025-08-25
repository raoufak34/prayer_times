"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"

const ALGERIA_STATES = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Algiers",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
]

export default function PrayerTimesForm() {
  const [selectedState, setSelectedState] = useState("")
  const [customState, setCustomState] = useState("")
  const [isCustomInput, setIsCustomInput] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stateToSearch = isCustomInput ? customState : selectedState
    if (stateToSearch.trim()) {
      router.push(`/?state=${encodeURIComponent(stateToSearch.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            type="button"
            variant={!isCustomInput ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomInput(false)}
          >
            Select from List
          </Button>
          <Button
            type="button"
            variant={isCustomInput ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomInput(true)}
          >
            Custom Input
          </Button>
        </div>

        {!isCustomInput ? (
          <div className="space-y-2">
            <Label htmlFor="state-select">Select Your State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="state-select">
                <SelectValue placeholder="Choose a state in Algeria" />
              </SelectTrigger>
              <SelectContent>
                {ALGERIA_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {state}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="custom-state">Enter Your State Name</Label>
            <Input
              id="custom-state"
              type="text"
              placeholder="e.g., Algiers, Oran, Constantine..."
              value={customState}
              onChange={(e) => setCustomState(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={!isCustomInput ? !selectedState : !customState.trim()}>
        <Search className="w-4 h-4 mr-2" />
        Get Prayer Times
      </Button>

      <div className="text-xs text-gray-500 text-center">
        <p>💡 Tip: You can search for any city or state in Algeria</p>
      </div>
    </form>
  )
}
