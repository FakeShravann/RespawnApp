"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // For now, skip auth and proceed directly
    router.push("/avatar")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-card p-7 shadow-xl"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
            Welcome Back
          </h2>

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
            Login
          </button>

          <button
            type="button"
            className="mt-3 w-full rounded-xl border-2 border-foreground/30 px-4 py-3 font-medium text-foreground/90 transition-colors hover:border-accent hover:text-accent"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-center text-sm text-card-foreground/70">
            New here?{" "}
            <Link href="/signup" className="text-muted-foreground hover:underline">
              Create Account
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  )
}
