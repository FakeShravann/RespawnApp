/**
 * RESPAWN - Core Game Logic Engine (TypeScript port)
 * Stats calculation, buffs/debuffs, quest generation, boss evaluation, XP/level system.
 */

// ---- CONFIG & CONSTANTS ----

const STAT_MIN = 0
const STAT_MAX = 100

export const BASE_STATS: Stats = {
  health: 50,
  energy: 50,
  focus: 50,
  resilience: 50,
}

const BASE_XP = 100
const XP_INCREMENT = 40

// ---- TYPES ----

export interface Stats {
  health: number
  energy: number
  focus: number
  resilience: number
}

export interface DailyInput {
  sleep_hours: number
  screen_time: number
  stress_level: number
  water_intake: number
  exercise: boolean
}

export type Effect =
  | "fatigue"
  | "high_energy"
  | "low_focus"
  | "high_focus"
  | "burnout_risk"
  | "good_health"
  | "low_resilience"
  | "high_resilience"

export interface CharacterState {
  character_state: "stressed" | "tired" | "energetic" | "normal"
  theme: "rain" | "night" | "sunny" | "normal"
}

export interface Quest {
  id: string
  title: string
  type: "corrective" | "support" | "preventive"
  completion_type: "input" | "manual"
  condition?: Record<string, number>
  xp: number
  targets: string[]
  cooldown: number
}

export interface Boss {
  name: string
  type: "stat" | "calendar"
  hp: number
  max_hp: number
  days_remaining: number
  active: boolean
  defeated: boolean
}

export interface XpInfo {
  level: number
  total_xp: number
  xp_for_next_level: number
  xp_progress_in_level: number
}

export interface ProcessDayResult {
  stats: Stats
  effects: Effect[]
  character: CharacterState
  quests: { active: Quest[]; completed: Quest[] }
  xp: XpInfo
  boss: Boss | null
  penalty: { effect: string; energy_penalty: number; focus_penalty: number; duration_days: number } | null
}

// ---- HELPERS ----

function clamp(value: number, min = STAT_MIN, max = STAT_MAX) {
  return Math.max(min, Math.min(value, max))
}

// ---- STAT CALCULATION ----

export function calculateStats(input: DailyInput): Stats {
  const stats = { ...BASE_STATS }

  const sleep = clamp(input.sleep_hours, 0, 12)
  const screen = clamp(input.screen_time, 0, 16)
  const stress = clamp(input.stress_level, 0, 5)
  const water = clamp(input.water_intake, 0, 6)
  const exercise = input.exercise

  // Sleep
  if (sleep >= 7 && sleep <= 9) {
    stats.energy += 15
    stats.focus += 10
  } else if (sleep < 5) {
    stats.energy -= 20
    stats.focus -= 15
  } else if (sleep > 10) {
    stats.energy -= 5
  }

  // Screen time
  if (screen < 2) stats.focus += 15
  else if (screen <= 4) stats.focus += 5
  else if (screen > 6) stats.focus -= 15
  else if (screen > 4) stats.focus -= 10

  // Exercise
  if (exercise) {
    stats.health += 15
    stats.energy += 10
    stats.resilience += 5
  }

  // Stress
  if (stress >= 4) {
    stats.focus -= 15
    stats.health -= 10
    stats.resilience -= 5
  } else if (stress <= 1) {
    stats.resilience += 10
  }

  // Resilience
  if (sleep >= 7 && exercise) stats.resilience += 10
  if (stress >= 4 && sleep < 6) stats.resilience -= 15

  // Water
  if (water < 2) stats.energy -= 10
  else if (water >= 4) stats.energy += 10
  else if (water >= 3) stats.energy += 5

  // Clamp
  for (const key of Object.keys(stats) as (keyof Stats)[]) {
    stats[key] = clamp(stats[key])
  }

  return stats
}

// ---- EFFECTS ----

export function determineEffects(stats: Stats): Effect[] {
  const effects: Effect[] = []

  if (stats.energy < 40) effects.push("fatigue")
  if (stats.energy >= 65) effects.push("high_energy")
  if (stats.focus < 40) effects.push("low_focus")
  if (stats.focus >= 60) effects.push("high_focus")
  if (stats.health < 40) effects.push("burnout_risk")
  if (stats.health >= 60) effects.push("good_health")
  if (stats.resilience < 40) effects.push("low_resilience")
  if (stats.resilience >= 60) effects.push("high_resilience")

  return effects
}

// ---- CHARACTER & THEME ----

export function determineCharacterState(stats: Stats, effects: Effect[]): CharacterState {
  const set = new Set(effects)

  if (set.has("low_resilience") || set.has("burnout_risk"))
    return { character_state: "stressed", theme: "rain" }

  if (set.has("fatigue"))
    return { character_state: "tired", theme: "night" }

  if (set.has("high_energy") && set.has("high_focus"))
    return { character_state: "energetic", theme: "sunny" }

  return { character_state: "normal", theme: "normal" }
}

// ---- XP & LEVEL ----

export function xpRequiredForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0
  let total = 0
  let increment = BASE_XP
  for (let level = 2; level <= targetLevel; level++) {
    total += increment
    increment += XP_INCREMENT
  }
  return total
}

export function calculateLevelFromXp(totalXp: number): XpInfo {
  let level = 1
  while (totalXp >= xpRequiredForLevel(level + 1)) level++

  return {
    level,
    total_xp: totalXp,
    xp_for_next_level: xpRequiredForLevel(level + 1),
    xp_progress_in_level: totalXp - xpRequiredForLevel(level),
  }
}

// ---- QUESTS ----

export const QUEST_POOL: Quest[] = [
  { id: "sleep_7h", title: "Sleep at least 7 hours", type: "corrective", completion_type: "input", condition: { sleep_hours: 7 }, xp: 25, targets: ["energy", "focus"], cooldown: 1 },
  { id: "screen_under_4h", title: "Keep screen time under 4 hours", type: "corrective", completion_type: "input", condition: { screen_time_max: 4 }, xp: 20, targets: ["focus"], cooldown: 1 },
  { id: "water_3l", title: "Drink at least 3L of water", type: "support", completion_type: "input", condition: { water_intake: 3 }, xp: 15, targets: ["energy"], cooldown: 1 },
  { id: "breathing_10min", title: "10-minute breathing exercise", type: "support", completion_type: "manual", xp: 10, targets: ["resilience"], cooldown: 1 },
  { id: "short_walk", title: "Take a short walk", type: "preventive", completion_type: "manual", xp: 10, targets: ["health", "resilience"], cooldown: 2 },
  { id: "plan_day", title: "Plan tomorrow's tasks", type: "preventive", completion_type: "manual", xp: 10, targets: [], cooldown: 2 },
]

function detectWeakStats(stats: Stats): string[] {
  const weak: string[] = []
  if (stats.energy < 45) weak.push("energy")
  if (stats.focus < 45) weak.push("focus")
  if (stats.resilience < 45) weak.push("resilience")
  return weak
}

export function generateDailyQuests(stats: Stats, effects: Effect[], recentQuests: string[] = []): Quest[] {
  const weakStats = detectWeakStats(stats)
  const selected: Quest[] = []

  // Corrective quests for weak stats
  for (const stat of weakStats) {
    for (const quest of QUEST_POOL) {
      if (quest.targets.includes(stat) && !recentQuests.includes(quest.id) && !selected.includes(quest) && quest.type === "corrective") {
        selected.push(quest)
        break
      }
    }
  }

  // Support quests
  for (const quest of QUEST_POOL) {
    if (quest.type === "support" && !recentQuests.includes(quest.id) && !selected.includes(quest)) {
      selected.push(quest)
    }
    if (selected.length >= 3) break
  }

  // Preventive quest
  for (const quest of QUEST_POOL) {
    if (quest.type === "preventive" && !recentQuests.includes(quest.id) && !selected.includes(quest)) {
      selected.push(quest)
      break
    }
  }

  return selected.slice(0, 4)
}

export function checkQuestCompletion(quests: Quest[], dailyInput: DailyInput, manualCompletions: string[] = []) {
  const completed: Quest[] = []
  let xpGained = 0

  for (const quest of quests) {
    if (quest.completion_type === "manual") {
      if (manualCompletions.includes(quest.id)) {
        completed.push(quest)
        xpGained += quest.xp
      }
    } else if (quest.completion_type === "input" && quest.condition) {
      let done = true
      for (const [key, value] of Object.entries(quest.condition)) {
        if (key.endsWith("_max")) {
          const realKey = key.replace("_max", "") as keyof DailyInput
          if ((dailyInput[realKey] as number) > value) done = false
        } else {
          const k = key as keyof DailyInput
          if ((dailyInput[k] as number) < value) done = false
        }
      }
      if (done) {
        completed.push(quest)
        xpGained += quest.xp
      }
    }
  }

  return { completed_quests: completed, xp_gained: xpGained }
}

// ---- BOSS ----

export function createBoss(name: string, bossType: "stat" | "calendar" = "stat", daysRemaining = 3): Boss {
  return { name, type: bossType, hp: 100, max_hp: 100, days_remaining: daysRemaining, active: true, defeated: false }
}

export function calculateStatTrend(prev: Stats, curr: Stats): number {
  let score = 0
  const tracked: (keyof Stats)[] = ["energy", "focus", "resilience"]
  for (const stat of tracked) {
    if (curr[stat] > prev[stat]) score++
    else if (curr[stat] < prev[stat]) score--
  }
  return score
}

export function updateBoss(boss: Boss, prev: Stats, curr: Stats): Boss {
  const trend = calculateStatTrend(prev, curr)
  if (trend >= 1) boss.hp -= 30
  else if (trend === 0) boss.hp -= 10
  else boss.hp += 15

  boss.hp = clamp(boss.hp, 0, boss.max_hp)
  boss.days_remaining--

  if (boss.hp <= 0) {
    boss.defeated = true
    boss.active = false
  } else if (boss.days_remaining <= 0) {
    boss.active = false
  }

  return boss
}

export function bossFailurePenalty(boss: Boss) {
  if (!boss.defeated && boss.days_remaining <= 0) {
    return { effect: "demotivated", energy_penalty: 5, focus_penalty: 5, duration_days: 1 }
  }
  return null
}

export function checkCalendarEvent(event: { name: string; days_left: number }): Boss | null {
  if (event.days_left <= 3) {
    return createBoss(`${event.name} Stress`, "calendar", event.days_left)
  }
  return null
}

// ---- MASTER DAILY PROCESSOR ----

interface PreviousState {
  stats?: Stats
  xp?: { total_xp: number }
  boss?: Boss | null
  active_quests?: Quest[]
  calendar_event?: { name: string; days_left: number } | null
}

export function processDay(dailyInput: DailyInput, previousState: PreviousState, manualCompletions: string[] = []): ProcessDayResult {
  const prevStats = previousState.stats || { ...BASE_STATS }
  let totalXp = previousState.xp?.total_xp || 0
  let activeBoss = previousState.boss || null
  const recentQuests = (previousState.active_quests || []).map(q => q.id)
  const calendarEvent = previousState.calendar_event || null

  const stats = calculateStats(dailyInput)
  const effects = determineEffects(stats)
  const character = determineCharacterState(stats, effects)

  const activeQuests = generateDailyQuests(stats, effects, recentQuests)
  const questResult = checkQuestCompletion(activeQuests, dailyInput, manualCompletions)

  totalXp += questResult.xp_gained
  const xpInfo = calculateLevelFromXp(totalXp)

  let penalty = null

  if (calendarEvent && !activeBoss) {
    activeBoss = checkCalendarEvent(calendarEvent)
  }

  if (activeBoss && activeBoss.active) {
    activeBoss = updateBoss(activeBoss, prevStats, stats)
    penalty = bossFailurePenalty(activeBoss)
  }

  return {
    stats,
    effects,
    character,
    quests: { active: activeQuests, completed: questResult.completed_quests },
    xp: xpInfo,
    boss: activeBoss,
    penalty,
  }
}
