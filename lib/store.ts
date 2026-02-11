/**
 * Client-side store using localStorage for RESPAWN game state.
 * Provides helpers to read/write profile, daily inputs, XP, tasks, etc.
 */

import type { Stats, DailyInput, Quest, Boss, XpInfo } from "./game-engine"

export interface Profile {
  gender: string
  avatar: string
  username: string
  email?: string
}

export interface GameState {
  profile: Profile | null
  dailyInputs: DailyInput | null
  xpData: XpInfo
  tasks: { title: string; createdAt: string }[]
  completed: { title: string; createdAt: string }[]
  calendarEvents: { name: string; daysLeft: number; pressure: string; xp: number }[]
  manualCompletions: string[]
  stats: Stats | null
  boss: Boss | null
  dailyLock: number | null
  lastDay: string | null
}

const DEFAULT_XP: XpInfo = {
  level: 1,
  total_xp: 0,
  xp_for_next_level: 100,
  xp_progress_in_level: 0,
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// ---- Profile ----
export function getProfile(): Profile | null {
  return safeGet<Profile | null>("respawn_profile", null)
}
export function setProfile(p: Profile) {
  safeSet("respawn_profile", p)
}

// ---- Daily Inputs ----
export function getDailyInputs(): DailyInput | null {
  return safeGet<DailyInput | null>("respawn_dailyInputs", null)
}
export function setDailyInputs(d: DailyInput) {
  safeSet("respawn_dailyInputs", d)
}

// ---- XP ----
export function getXpData(): XpInfo {
  return safeGet<XpInfo>("respawn_xpData", DEFAULT_XP)
}
export function setXpData(x: XpInfo) {
  safeSet("respawn_xpData", x)
}

// ---- Tasks ----
export function getTasks(): { title: string; createdAt: string }[] {
  return safeGet("respawn_tasks", [])
}
export function setTasks(t: { title: string; createdAt: string }[]) {
  safeSet("respawn_tasks", t)
}

export function getCompleted(): { title: string; createdAt: string }[] {
  return safeGet("respawn_completed", [])
}
export function setCompleted(c: { title: string; createdAt: string }[]) {
  safeSet("respawn_completed", c)
}

// ---- Calendar Events ----
export function getCalendarEvents() {
  return safeGet<{ name: string; daysLeft: number; pressure: string; xp: number }[]>("respawn_calendar", [])
}
export function setCalendarEvents(e: { name: string; daysLeft: number; pressure: string; xp: number }[]) {
  safeSet("respawn_calendar", e)
}

// ---- Manual Completions ----
export function getManualCompletions(): string[] {
  return safeGet<string[]>("respawn_manualCompletions", [])
}
export function setManualCompletions(m: string[]) {
  safeSet("respawn_manualCompletions", m)
}

// ---- Stats ----
export function getStats(): Stats | null {
  return safeGet<Stats | null>("respawn_stats", null)
}
export function setStats(s: Stats) {
  safeSet("respawn_stats", s)
}

// ---- Boss ----
export function getBoss(): Boss | null {
  return safeGet<Boss | null>("respawn_boss", null)
}
export function setBoss(b: Boss | null) {
  safeSet("respawn_boss", b)
}

// ---- Daily Lock ----
export function getDailyLock(): number | null {
  return safeGet<number | null>("respawn_dailyLock", null)
}
export function setDailyLock(t: number) {
  safeSet("respawn_dailyLock", t)
}

// ---- Day tracking for completed task reset ----
export function getLastDay(): string | null {
  return safeGet<string | null>("respawn_lastDay", null)
}
export function setLastDay(d: string) {
  safeSet("respawn_lastDay", d)
}
