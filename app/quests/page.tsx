"use client"

import { useEffect, useState } from "react"
import { AppNav } from "@/components/nav"
import {
  getDailyInputs,
  getManualCompletions,
  setManualCompletions,
  getXpData,
  setXpData,
} from "@/lib/store"
import {
  calculateStats,
  determineEffects,
  generateDailyQuests,
  checkQuestCompletion,
  calculateLevelFromXp,
  type Quest,
} from "@/lib/game-engine"
import { cn } from "@/lib/utils"

const TYPE_STYLES: Record<string, string> = {
  corrective: "bg-red-200 text-red-900",
  support: "bg-green-200 text-primary",
  preventive: "bg-blue-200 text-blue-900",
}

export default function QuestsPage() {
  const [activeQuests, setActiveQuests] = useState<Quest[]>([])
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([])
  const [manualDone, setManualDone] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const input = getDailyInputs()
    if (!input) return

    const stats = calculateStats(input)
    const effects = determineEffects(stats)
    const quests = generateDailyQuests(stats, effects)

    const manual = getManualCompletions()
    setManualDone(manual)

    const result = checkQuestCompletion(quests, input, manual)

    const completedIds = new Set(result.completed_quests.map((q) => q.id))
    setActiveQuests(quests.filter((q) => !completedIds.has(q.id)))
    setCompletedQuests(result.completed_quests)
  }, [])

  function completeQuest(questId: string) {
    const updated = [...manualDone, questId]
    setManualDone(updated)
    setManualCompletions(updated)

    // Re-evaluate
    const input = getDailyInputs()
    if (!input) return

    const stats = calculateStats(input)
    const effects = determineEffects(stats)
    const quests = generateDailyQuests(stats, effects)
    const result = checkQuestCompletion(quests, input, updated)

    const completedIds = new Set(result.completed_quests.map((q) => q.id))
    setActiveQuests(quests.filter((q) => !completedIds.has(q.id)))
    setCompletedQuests(result.completed_quests)

    // Award XP for the completed quest
    const xp = getXpData()
    const quest = quests.find((q) => q.id === questId)
    if (quest) {
      const updatedXp = calculateLevelFromXp(xp.total_xp + quest.xp)
      setXpData(updatedXp)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <AppNav showLogout />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Active Quests */}
        <section className="rounded-2xl bg-card/80 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-card-foreground">Active Quests</h2>

          {activeQuests.length === 0 && (
            <p className="text-muted-foreground">All quests completed! Nice work.</p>
          )}

          {activeQuests.map((quest) => (
            <div
              key={quest.id}
              className="mb-3 rounded-xl border border-foreground/10 bg-foreground/10 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <strong className="text-card-foreground">{quest.title}</strong>
                <span className="font-bold text-accent">+{quest.xp} XP</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-semibold capitalize",
                    TYPE_STYLES[quest.type]
                  )}
                >
                  {quest.type}
                </span>
                {quest.completion_type === "manual" ? (
                  <button
                    onClick={() => completeQuest(quest.id)}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    Mark Complete
                  </button>
                ) : (
                  <span className="rounded-lg bg-muted-foreground/30 px-4 py-2 text-sm font-semibold text-muted-foreground">
                    Auto-complete
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {quest.completion_type === "manual"
                  ? "Manual completion"
                  : "Completed automatically from daily input"}
              </p>
            </div>
          ))}
        </section>

        {/* Completed Quests */}
        <section className="mt-6 rounded-2xl bg-card/80 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-card-foreground">Completed Today</h2>

          {completedQuests.length === 0 && (
            <p className="text-muted-foreground">No quests completed yet.</p>
          )}

          {completedQuests.map((quest) => (
            <div
              key={quest.id}
              className="mb-3 rounded-xl border border-accent/20 bg-accent/10 p-4"
            >
              <div className="flex items-center justify-between">
                <strong className="text-card-foreground">{quest.title}</strong>
                <span className="font-bold text-accent">+{quest.xp} XP</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {quest.completion_type === "manual"
                  ? "Completed manually"
                  : "Completed via daily input"}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
