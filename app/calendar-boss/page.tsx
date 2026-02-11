"use client"

import { useEffect, useState } from "react"
import { AppNav } from "@/components/nav"
import { getCalendarEvents, setCalendarEvents } from "@/lib/store"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  name: string
  daysLeft: number
  pressure: string
  xp: number
}

export default function CalendarBossPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formName, setFormName] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formPressure, setFormPressure] = useState("Low")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEvents(getCalendarEvents())
  }, [])

  function save(updated: CalendarEvent[]) {
    setEvents(updated)
    setCalendarEvents(updated)
  }

  function openAddForm() {
    setEditIndex(null)
    setFormName("")
    setFormDate("")
    setFormPressure("Low")
    setShowForm(true)
  }

  function openEdit(i: number) {
    setEditIndex(i)
    const e = events[i]
    setFormName(e.name)
    const d = new Date()
    d.setDate(d.getDate() + e.daysLeft)
    setFormDate(d.toISOString().split("T")[0])
    setFormPressure(e.pressure)
    setShowForm(true)
  }

  function saveEvent() {
    if (!formName || !formDate) return

    const selectedDate = new Date(formDate)
    const today = new Date()
    const daysLeft = Math.ceil(
      (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
    const xp = formPressure === "High" ? 40 : formPressure === "Medium" ? 25 : 15

    const obj: CalendarEvent = { name: formName, daysLeft, pressure: formPressure, xp }

    const updated = [...events]
    if (editIndex !== null) {
      updated[editIndex] = obj
    } else {
      updated.push(obj)
    }

    save(updated)
    setShowForm(false)
  }

  function deleteEvent(i: number) {
    save(events.filter((_, idx) => idx !== i))
  }

  const today = new Date().toISOString().split("T")[0]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <AppNav showLogout />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Calendar Events */}
        <section className="rounded-2xl bg-card/80 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-card-foreground">Calendar Events</h2>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-accent px-5 py-2 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            + Add Event
          </button>

          {showForm && (
            <div className="mt-4 space-y-3">
              <input
                placeholder="Event name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-xl border-none bg-foreground/10 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="date"
                value={formDate}
                min={today}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-xl border-none bg-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={formPressure}
                onChange={(e) => setFormPressure(e.target.value)}
                className="w-full rounded-xl border-none bg-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                onClick={saveEvent}
                className="rounded-xl bg-accent px-5 py-2 font-semibold text-accent-foreground"
              >
                Save Event
              </button>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {events.length === 0 && (
              <p className="text-muted-foreground">No events yet. Add one above.</p>
            )}
            {events.map((e, i) => (
              <div
                key={i}
                className="rounded-xl border border-foreground/10 bg-foreground/10 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-card-foreground">{e.name}</strong>
                  <span className="font-bold text-accent">+{e.xp} XP</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Starts in {e.daysLeft} days &middot; {e.pressure} Pressure
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(i)}
                      className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(i)}
                      className="rounded-lg bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Boss */}
        <section className="mt-6 rounded-2xl bg-card/80 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-card-foreground">Active Boss</h2>

          <div className="rounded-xl border border-foreground/10 bg-foreground/10 p-5 backdrop-blur-sm">
            <strong className="text-lg text-card-foreground">Burnout Beast</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Energy and focus have been low for several days.
            </p>

            <div className="my-3 h-4 overflow-hidden rounded-full bg-foreground/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-destructive via-yellow-400 to-accent"
                style={{ width: "70%" }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-card-foreground">
              <span>HP: 70 / 100</span>
              <span>Days left: 2</span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Tip: Sleep well and reduce screen time
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
