"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    // For now, skip actual registration and proceed to avatar selection
    router.push("/avatar")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-2xl bg-card p-7 shadow-xl"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
          Create Account
        </h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border-2 border-border bg-input px-4 py-3 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg border-2 border-border bg-input px-4 py-3 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border-2 border-border bg-input px-4 py-3 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-foreground px-4 py-3 font-bold text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Create Account
        </button>

        <button
          type="button"
          className="mt-3 w-full rounded-xl border-2 border-foreground/30 px-4 py-3 font-medium text-foreground/90 transition-colors hover:border-accent hover:text-accent"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-card-foreground/70">
          Already have an account?{" "}
          <Link href="/login" className="text-muted-foreground hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
