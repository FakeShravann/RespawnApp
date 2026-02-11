"use client"

import { useEffect, useState } from "react"
import { AppNav } from "@/components/nav"
import {
  getTasks,
  setTasks,
  getCompleted,
  setCompleted,
  getLastDay,
  setLastDay,
  getXpData,
  setXpData,
} from "@/lib/store"
import { calculateLevelFromXp } from "@/lib/game-engine"

interface Task {
  title: string
  createdAt: string
}

const FOCUS_TIPS: Record<string, string[]> = {
  low: [
    "Do one 25-min focus sprint",
    "Start the easiest task first",
    "Review notes for 10 min",
    "Keep phone away for 15 min",
  ],
  fatigue: [
    "Drink water and breathe",
    "Take a 5 min walk",
    "Stretch neck & shoulders",
    "Eat a small healthy snack",
  ],
  over: [
    "Write brain dump list",
    "Pick ONLY one priority",
    "Sit in silence 3 min",
    "Dim screen & close tabs",
  ],
}

export default function WorkPage() {
  const [tasks, setTasksState] = useState<Task[]>([])
  const [completed, setCompletedState] = useState<Task[]>([])
  const [taskInput, setTaskInput] = useState("")
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [focusType, setFocusType] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const today = new Date().toDateString()
    const savedDay = getLastDay()

    let comp = getCompleted()
    if (savedDay !== today) {
      comp = []
      setCompleted([])
      setLastDay(today)
    }

    setTasksState(getTasks())
    setCompletedState(comp)
  }, [])

  function save(t: Task[], c: Task[]) {
    setTasks(t)
    setCompleted(c)
    setTasksState(t)
    setCompletedState(c)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  function addTask() {
    if (!taskInput.trim()) return
    const updated = [...tasks, { title: taskInput.trim(), createdAt: new Date().toISOString() }]
    save(updated, completed)
    setTaskInput("")
  }

  function finishTask(i: number) {
    const task = tasks[i]
    const newTasks = tasks.filter((_, idx) => idx !== i)
    const newCompleted = [...completed, task]
    save(newTasks, newCompleted)

    if (newCompleted.length <= 3) {
      showToast("+5 XP Gained")
      const xp = getXpData()
      setXpData(calculateLevelFromXp(xp.total_xp + 5))
    }
  }

  function openEdit(i: number) {
    setEditIndex(i)
    setEditValue(tasks[i].title)
  }

  function saveEdit() {
    if (editIndex === null || !editValue.trim()) return
    const updated = [...tasks]
    updated[editIndex] = { ...updated[editIndex], title: editValue.trim() }
    save(updated, completed)
    setEditIndex(null)
    setEditValue("")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-primary">
      <AppNav showLogout />

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-xl border border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Add Task */}
        <div className="rounded-2xl bg-card p-5">
          <h3 className="mb-3 text-lg font-bold text-card-foreground">Add Task</h3>
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Task name..."
            className="w-full rounded-xl border-none bg-foreground/10 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={addTask}
            className="mt-3 rounded-xl bg-accent px-5 py-2 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Add Task
          </button>
        </div>

        {/* Edit Card */}
        {editIndex !== null && (
          <div className="mt-4 rounded-2xl bg-card p-5">
            <h3 className="mb-3 text-lg font-bold text-card-foreground">Edit Task</h3>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full rounded-xl border-none bg-foreground/10 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={saveEdit}
                className="rounded-xl bg-accent px-5 py-2 font-semibold text-accent-foreground"
              >
                Submit
              </button>
              <button
                onClick={() => setEditIndex(null)}
                className="rounded-xl bg-secondary px-5 py-2 font-semibold text-secondary-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Board */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Ongoing */}
          <div className="rounded-2xl bg-card p-5">
            <h4 className="mb-3 text-lg font-bold text-card-foreground">Ongoing Tasks</h4>
            {tasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No tasks yet. Add one above.</p>
            )}
            {tasks.map((t, i) => (
              <div
                key={i}
                className="mb-2 flex items-center justify-between rounded-xl border border-border bg-primary px-4 py-3 transition-all"
              >
                <span className="text-primary-foreground">{t.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(i)}
                    className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => finishTask(i)}
                    className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                  >
                    Finished
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed */}
          <div className="rounded-2xl bg-card p-5">
            <h4 className="mb-3 text-lg font-bold text-card-foreground">
              Completed Tasks (Today)
            </h4>
            {completed.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing completed yet.</p>
            )}
            {completed.map((t, i) => (
              <div
                key={i}
                className="mb-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3"
              >
                <span className="text-card-foreground">{t.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Compass */}
        <div className="mt-6 rounded-2xl bg-card p-5">
          <h3 className="mb-3 text-lg font-bold text-card-foreground">Focus Compass</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "low", label: "Low Focus" },
              { key: "fatigue", label: "Fatigued" },
              { key: "over", label: "Overstimulated" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFocusType(focusType === key ? null : key)}
                className={`rounded-xl border border-border px-3 py-3 text-center text-sm font-semibold transition-all ${
                  focusType === key
                    ? "bg-primary text-primary-foreground shadow-[0_0_14px_rgba(74,222,128,0.4)]"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {focusType && (
            <div className="mt-4 space-y-2">
              {FOCUS_TIPS[focusType]?.map((tip) => (
                <div
                  key={tip}
                  className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
