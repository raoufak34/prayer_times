"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true)
  const [calculationMethod, setCalculationMethod] = useState<string>("ISNA")
  const [asrSchoolHanafi, setAsrSchoolHanafi] = useState<boolean>(true)
  const [timeFormat24h, setTimeFormat24h] = useState<boolean>(false)
  const [hijriAdjust, setHijriAdjust] = useState<number>(0)
  const [lead15, setLead15] = useState<boolean>(true)
  const [lead5, setLead5] = useState<boolean>(true)
  const [lead0, setLead0] = useState<boolean>(true)
  const [useLocation, setUseLocation] = useState<boolean>(false)

  const resetDefaults = () => {
    setDarkMode(false)
    setAlertsEnabled(true)
    setCalculationMethod("ISNA")
    setAsrSchoolHanafi(true)
    setTimeFormat24h(false)
    setHijriAdjust(0)
    setLead15(true)
    setLead5(true)
    setLead0(true)
    setUseLocation(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/islamic-bg.png)" }} />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/75 via-gray-900/70 to-slate-900/75" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        <Card className="bg-white/12 backdrop-blur-3xl border border-white/25 rounded-3xl shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Appearance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4">
                <Label htmlFor="theme" className="text-white">Dark Mode</Label>
                <Switch id="theme" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4">
                <Label htmlFor="timefmt" className="text-white">24-hour Time</Label>
                <Switch id="timefmt" checked={timeFormat24h} onCheckedChange={setTimeFormat24h} />
              </div>
            </div>

            {/* Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                <Label className="text-white mb-2 block">Calculation Method</Label>
                <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ISNA">ISNA (North America)</SelectItem>
                    <SelectItem value="MWL">MWL (Muslim World League)</SelectItem>
                    <SelectItem value="UOIF">UOIF (France)</SelectItem>
                    <SelectItem value="EGAS">Egyptian General Authority</SelectItem>
                    <SelectItem value="UAQ">Umm al-Qura, Makkah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4">
                <Label htmlFor="asr" className="text-white">Asr School (Hanafi)</Label>
                <Switch id="asr" checked={asrSchoolHanafi} onCheckedChange={setAsrSchoolHanafi} />
              </div>
            </div>

            {/* Hijri Adjustment */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <Label htmlFor="hijri" className="text-white mb-2 block">Hijri Date Adjustment (days)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="hijri"
                  type="number"
                  min={-2}
                  max={2}
                  value={hijriAdjust}
                  onChange={(e) => setHijriAdjust(Number(e.target.value))}
                  className="w-24 bg-white/20 border-white/30 text-white"
                />
                <span className="text-white/75 text-sm">Range: -2 to +2</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="alerts" className="text-white">Prayer Alerts</Label>
                <Switch id="alerts" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/20">
                  <span className="text-white">15 min before</span>
                  <Switch checked={lead15} onCheckedChange={setLead15} />
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/20">
                  <span className="text-white">5 min before</span>
                  <Switch checked={lead5} onCheckedChange={setLead5} />
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/20">
                  <span className="text-white">At prayer time</span>
                  <Switch checked={lead0} onCheckedChange={setLead0} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4">
              <Label htmlFor="loc" className="text-white">Use Device Location</Label>
              <Switch id="loc" checked={useLocation} onCheckedChange={setUseLocation} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="ghost" className="border border-white/25" onClick={resetDefaults}>Reset</Button>
              <Button className="px-6">Save Settings</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg" className="px-8">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


