import Link from "next/link"
import { AppNav } from "@/components/nav"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 md:flex-row md:justify-around md:px-10">
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Restart. Reload. Rise.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            One Task, One Step, One Better Version of You.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
          <h3 className="mb-4 text-center text-xl font-semibold text-card-foreground">
            Get Started
          </h3>
          <Link
            href="/signup"
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 font-bold text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="mt-3 flex w-full items-center justify-center rounded-xl border-2 border-foreground/30 px-4 py-3 font-medium text-foreground/90 transition-colors hover:border-accent hover:text-accent"
          >
            Log In
          </Link>
        </div>
      </main>

      {/* How it Works */}
      <section id="how" className="px-6 py-16 text-center">
        <h2 className="mb-8 text-3xl font-bold">How It Works</h2>
        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
          {[
            "1. Add daily inputs (study, sleep, stress)",
            "2. Avatar mood + background change",
            "3. Complete quests & earn XP",
            "4. Level up your real life",
          ].map((step) => (
            <div
              key={step}
              className="rounded-xl bg-card-foreground/80 px-6 py-4 font-medium text-muted"
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-16 text-center">
        <h2 className="mb-8 text-3xl font-bold">FAQ</h2>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="rounded-xl bg-card-foreground/80 px-6 py-4 text-left text-muted">
            <strong>Do we track other apps?</strong> &mdash; No, only your inputs.
          </div>
          <div className="rounded-xl bg-card-foreground/80 px-6 py-4 text-left text-muted">
            <strong>Is it beginner friendly?</strong> &mdash; Yes, micro steps only.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
