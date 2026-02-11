"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function AppNav({ showLogout = false }: { showLogout?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground md:px-10">
      <Link href="/" className="text-xl font-bold tracking-wide">
        RESPAWN
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-4 md:flex">
        {showLogout ? (
          <>
            <Link href="/dashboard" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/quests" className="hover:text-accent transition-colors">Quests</Link>
            <Link href="/calendar-boss" className="hover:text-accent transition-colors">Calendar</Link>
            <Link href="/work" className="hover:text-accent transition-colors">Work</Link>
            <Link
              href="/"
              className="rounded-lg border-2 border-secondary bg-secondary/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/40"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <a href="#how" className="hover:text-accent transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-accent transition-colors">FAQ</a>
            <a href="#support" className="hover:text-accent transition-colors">Support</a>
            <Link
              href="/login"
              className="rounded-lg border-2 border-secondary bg-secondary/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/40"
            >
              Log In
            </Link>
          </>
        )}
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute right-4 top-16 z-50 flex flex-col gap-2 rounded-2xl bg-foreground p-4 shadow-xl md:hidden">
          {showLogout ? (
            <>
              <Link href="/dashboard" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/quests" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Quests</Link>
              <Link href="/calendar-boss" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Calendar</Link>
              <Link href="/work" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Work</Link>
              <Link href="/" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Logout</Link>
            </>
          ) : (
            <>
              <a href="#how" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>How it Works</a>
              <a href="#faq" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="#support" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Support</a>
              <Link href="/login" className="rounded-lg px-4 py-2 text-primary font-semibold hover:bg-accent/20" onClick={() => setMenuOpen(false)}>Log In</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
