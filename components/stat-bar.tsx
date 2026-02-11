import { cn } from "@/lib/utils"

export function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-card-foreground">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-500", {
            "bg-accent": value >= 60,
            "bg-yellow-400": value >= 40 && value < 60,
            "bg-destructive": value < 40,
          })}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
