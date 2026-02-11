"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/nav"
import { StatBar } from "@/components/stat-bar"
import { getProfile, getDailyInputs, getXpData, setStats as storeSetStats } from "@/lib/store"
import {
  calculateStats,
  determineEffects,
  determineCharacterState,
  type Stats,
  type Effect,
  type CharacterState,
} from "@/lib/game-engine"
import { cn } from "@/lib/utils"
import Image from "next/image"

const THEME_BG: Record<string, string> = {
  rain: "from-slate-900 to-slate-700",
  night: "from-indigo-950 to-slate-900",
  sunny: "from-emerald-900 to-teal-800",
  normal: "from-background to-muted",
}

const BUFF_LABELS: Record<string, { label: string; type: "buff" }> = {
  high_energy: { label: "High Energy", type: "buff" },
  high_focus: { label: "High Focus", type: "buff" },
  good_health: { label: "Good Health", type: "buff" },
  high_resilience: { label: "High Resilience", type: "buff" },
}

const DEBUFF_LABELS: Record<string, { label: string; type: "debuff" }> = {
  fatigue: { label: "Fatigue", type: "debuff" },
  low_focus: { label: "Low Focus", type: "debuff" },
  burnout_risk: { label: "Burnout Risk", type: "debuff" },
  low_resilience: { label: "Low Resilience", type: "debuff" },
}

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const [profileData, setProfileData] = useState<{
    username: string
    avatar: string
    gender: string
  } | null>(null)

  const [stats, setStats] = useState<Stats>({ health: 50, energy: 50, focus: 50, resilience: 50 })
  const [effects, setEffects] = useState<Effect[]>([])
  const [character, setCharacter] = useState<CharacterState>({
    character_state: "normal",
    theme: "normal",
  })
  const [xpData, setXpDataState] = useState(getXpData())

  useEffect(() => {
    setMounted(true)
    const profile = getProfile()
    if (!profile) {
      router.push("/avatar")
      return
    }
    setProfileData(profile)

    const input = getDailyInputs()
    if (!input) {
      router.push("/daily-input")
      return
    }

    const computed = calculateStats(input)
    const eff = determineEffects(computed)
    const charState = determineCharacterState(computed, eff)

    setStats(computed)
    setEffects(eff)
    setCharacter(charState)
    storeSetStats(computed)

    const xp = getXpData()
    setXpDataState(xp)
  }, [router])

  if (!mounted || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const buffs = effects.filter((e) => e in BUFF_LABELS)
  const debuffs = effects.filter((e) => e in DEBUFF_LABELS)

  // XP needed for current level bracket
  const xpNeededForCurrentLevel = xpData.xp_for_next_level - (xpData.total_xp - xpData.xp_progress_in_level)
  const xpWidth = xpNeededForCurrentLevel > 0
    ? Math.min(100, Math.round((xpData.xp_progress_in_level / xpNeededForCurrentLevel) * 100))
    : 0

  return (
    <div className={cn("min-h-screen bg-gradient-to-b", THEME_BG[character.theme])}>
      <AppNav showLogout />

      {/* Mini Profile + XP */}
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-3 px-4 py-3"
      >
        <Image
          src={`/images/${profileData.avatar}-normal.png`}
          alt={profileData.username}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full border-3 border-accent bg-secondary object-contain p-0.5"
        />
        <div>
          <p className="font-semibold text-foreground">{profileData.username}</p>
          <div className="mt-1 rounded-2xl border-2 border-accent bg-primary px-3 py-1">
            <div className="flex justify-between text-xs text-primary-foreground">
              <span>Level {xpData.level}</span>
              <span>{xpData.total_xp} XP</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.min(xpWidth, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 pb-10">
        {/* Hero avatar card */}
        <div className="rounded-2xl bg-card p-6 text-center">
          <Image
            src={`/images/${profileData.avatar}-${character.character_state}.png`}
            alt={`${profileData.username} - ${character.character_state}`}
            width={170}
            height={170}
            className="mx-auto h-40 w-40 rounded-full bg-secondary object-contain p-1"
          />
          <p className="mt-3 text-lg font-medium capitalize text-card-foreground">
            Mood: {character.character_state}
          </p>
        </div>

        {/* Stats + Effects */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          {/* Buffs */}
          <div className="flex-1 rounded-2xl bg-card p-4">
            <h3 className="mb-2 font-bold text-card-foreground">Buffs</h3>
            <div className="flex flex-wrap gap-2">
              {buffs.length === 0 && (
                <span className="text-sm text-muted-foreground">None active</span>
              )}
              {buffs.map((b) => (
                <span
                  key={b}
                  className="rounded-xl border border-accent bg-secondary px-3 py-1 text-xs font-semibold text-accent"
                >
                  {BUFF_LABELS[b]?.label}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Bars */}
          <div className="flex-1 rounded-2xl bg-card p-4">
            <h3 className="mb-2 font-bold text-card-foreground">Stats</h3>
            <StatBar label="Energy" value={stats.energy} />
            <StatBar label="Health" value={stats.health} />
            <StatBar label="Focus" value={stats.focus} />
            <StatBar label="Resilience" value={stats.resilience} />
          </div>

          {/* Debuffs */}
          <div className="flex-1 rounded-2xl bg-card p-4">
            <h3 className="mb-2 font-bold text-card-foreground">Debuffs</h3>
            <div className="flex flex-wrap gap-2">
              {debuffs.length === 0 && (
                <span className="text-sm text-muted-foreground">None active</span>
              )}
              {debuffs.map((d) => (
                <span
                  key={d}
                  className="rounded-xl border border-destructive bg-secondary px-3 py-1 text-xs font-semibold text-destructive"
                >
                  {DEBUFF_LABELS[d]?.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProfileOpen(false)
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-primary p-6">
            <h3 className="mb-4 text-xl font-bold text-primary-foreground">
              Player Profile
            </h3>
            <div className="flex justify-center">
              <Image
                src={`/images/${profileData.avatar}-normal.png`}
                alt={profileData.username}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full bg-secondary object-contain p-1"
              />
            </div>
            <div className="mt-4 space-y-2 text-primary-foreground">
              <p>
                <strong>Username:</strong> {profileData.username}
              </p>
              <p>
                <strong>Gender:</strong> {profileData.gender}
              </p>
              <p>
                <strong>Avatar:</strong> {profileData.avatar}
              </p>
            </div>
            <button
              onClick={() => setProfileOpen(false)}
              className="mt-4 w-full rounded-xl bg-foreground px-4 py-2 font-bold text-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
