import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "RESPAWN - Restart. Reload. Rise.",
  description:
    "A gamified health & wellness app that turns your daily habits into RPG stats. Track sleep, stress, water intake, and more to level up your real life.",
}

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
