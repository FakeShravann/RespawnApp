"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { setProfile } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

const MALE_AVATARS = ["m1", "m2", "m3", "m4"]
const FEMALE_AVATARS = ["f1", "f2", "f3", "f4"]

/* Since the original project uses local image files that don't exist in our Next.js build,
   we'll use colored SVG placeholders representing each avatar */
const AVATAR_COLORS: Record<string, { bg: string; label: string }> = {
  m1: { bg: "bg-emerald-700", label: "Warrior" },
  m2: { bg: "bg-teal-700", label: "Mage" },
  m3: { bg: "bg-cyan-700", label: "Rogue" },
  m4: { bg: "bg-green-700", label: "Knight" },
  f1: { bg: "bg-emerald-600", label: "Huntress" },
  f2: { bg: "bg-teal-600", label: "Sorceress" },
  f3: { bg: "bg-cyan-600", label: "Ranger" },
  f4: { bg: "bg-green-600", label: "Paladin" },
}

export default function AvatarPage() {
  const router = useRouter()
  const [gender, setGender] = useState<"male" | "female" | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [toast, setToast] = useState("")

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 5000)
  }

  function save() {
    if (!gender) {
      showToast("Please select gender first")
      return
    }
    if (!selectedAvatar) {
      showToast("Please select an avatar")
      return
    }
    if (!username.trim()) {
      showToast("Please enter a username")
      return
    }

    setProfile({
      gender,
      avatar: selectedAvatar,
      username: username.trim(),
    })

    router.push("/daily-input")
  }

  const avatarList = gender === "male" ? MALE_AVATARS : gender === "female" ? FEMALE_AVATARS : []

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link
        href="/"
        className="fixed left-4 top-4 flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        {/* Toast */}
        {toast && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-pulse rounded-xl border border-border bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg">
            {toast}
          </div>
        )}

        <h2 className="mb-4 text-center text-xl font-bold text-card-foreground">
          Step 1 &ndash; Select Gender
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setGender("male")
              setSelectedAvatar(null)
            }}
            className={cn(
              "flex-1 rounded-xl border-2 border-border py-3 text-center font-semibold transition-colors",
              gender === "male" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}
          >
            Male
          </button>
          <button
            onClick={() => {
              setGender("female")
              setSelectedAvatar(null)
            }}
            className={cn(
              "flex-1 rounded-xl border-2 border-border py-3 text-center font-semibold transition-colors",
              gender === "female" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}
          >
            Female
          </button>
        </div>

        {gender && (
          <div className="mt-6">
            <h2 className="mb-3 text-center text-xl font-bold text-card-foreground">
              Step 2 &ndash; Choose Your Hero
            </h2>

            <div className="flex justify-center gap-3">
              {avatarList.map((av) => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={cn(
                    "flex w-24 flex-col items-center gap-1 rounded-xl border-2 p-2 transition-all",
                    selectedAvatar === av
                      ? "border-foreground shadow-[0_0_14px_rgba(255,255,255,0.5)] bg-primary"
                      : "border-border bg-secondary"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-foreground",
                      AVATAR_COLORS[av].bg
                    )}
                  >
                    {av.toUpperCase()}
                  </div>
                  <span className="text-xs text-card-foreground">
                    {AVATAR_COLORS[av].label}
                  </span>
                </button>
              ))}
            </div>

            <input
              placeholder="Enter avatar name / username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-4 w-full rounded-lg border-2 border-border bg-input px-4 py-3 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <button
              onClick={save}
              className="mt-4 w-full rounded-xl bg-foreground px-4 py-3 font-bold text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
