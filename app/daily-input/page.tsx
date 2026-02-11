"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { setDailyInputs, setDailyLock } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

export default function DailyInputPage() {
  const router = useRouter()
  const [sleep, setSleep] = useState(6)
  const [screen, setScreen] = useState(4)
  const [water, setWater] = useState(2)
  const [stress, setStress] = useState(0)
  const [exercise, setExercise] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState(false)

  function getResetTime() {
    const reset = new Date()
    reset.setHours(4, 0, 0, 0)
    if (new Date() >= reset) reset.setDate(reset.getDate() + 1)
    return reset.getTime()
  }

  function saveInfo() {
    setSaved(true)
    setNotice(true)
    setTimeout(() => setNotice(false), 10000)

    setDailyInputs({
      sleep_hours: sleep,
      screen_time: screen,
      water_intake: water,
      stress_level: stress,
      exercise,
    })
    setDailyLock(getResetTime())
  }

  function confirmMove() {
    if (!saved) {
      alert("Please click SAVE INFO first!")
      return
    }
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link
        href="/"
        className="fixed left-4 top-4 flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        {notice && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 animate-pulse rounded-xl border border-border bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg">
            Once filled, info cannot be edited before 4 AM
          </div>
        )}

        <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
          Daily Power Log
        </h2>

        {/* Sleep */}
        <label className="mt-3 block font-bold text-card-foreground">Sleep Hours</label>
        <input
          type="range"
          min={0}
          max={12}
          value={sleep}
          onChange={(e) => setSleep(Number(e.target.value))}
          className="mt-1 w-full"
        />
        <p className="text-right text-sm text-muted-foreground">{sleep} hrs</p>

        {/* Screen Time */}
        <label className="mt-3 block font-bold text-card-foreground">Screen Time</label>
        <input
          type="range"
          min={0}
          max={16}
          value={screen}
          onChange={(e) => setScreen(Number(e.target.value))}
          className="mt-1 w-full"
        />
        <p className="text-right text-sm text-muted-foreground">{screen} hrs</p>

        {/* Water */}
        <label className="mt-3 block font-bold text-card-foreground">Water Intake</label>
        <input
          type="range"
          min={0}
          max={6}
          value={water}
          onChange={(e) => setWater(Number(e.target.value))}
          className="mt-1 w-full"
        />
        <p className="text-right text-sm text-muted-foreground">{water} L</p>

        {/* Stress */}
        <label className="mt-3 block font-bold text-card-foreground">
          Stress Level (0-5)
        </label>
        <div className="mt-2 flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => setStress(v)}
              className={cn(
                "flex-1 rounded-lg border-2 border-border py-2 text-center text-sm font-semibold transition-colors",
                stress === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Exercise */}
        <label className="mt-4 block font-bold text-card-foreground">Exercise</label>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => setExercise(!exercise)}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              exercise ? "bg-primary" : "bg-secondary"
            )}
            role="switch"
            aria-checked={exercise}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-foreground transition-transform",
                exercise ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
          <span className="text-sm text-card-foreground">
            {exercise ? "Done" : "Tap if done"}
          </span>
        </div>

        {/* Buttons */}
        <button
          onClick={saveInfo}
          className="mt-6 w-full rounded-xl bg-foreground px-4 py-3 font-bold text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Save Info
        </button>
        <button
          onClick={confirmMove}
          className="mt-3 w-full rounded-xl bg-accent px-4 py-3 font-bold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  )
}
