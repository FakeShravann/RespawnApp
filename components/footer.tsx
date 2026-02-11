export function Footer() {
  return (
    <footer className="bg-muted px-6 py-8 text-primary-foreground">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-16 text-left">
        <div className="flex flex-col gap-1">
          <span className="mb-1 font-bold text-muted-foreground">Support</span>
          <span>FAQ</span>
          <span>Help Center</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="mb-1 font-bold text-muted-foreground">Social</span>
          <span>Instagram</span>
          <span>Discord</span>
          <span>Twitter</span>
        </div>
      </div>
      <p className="mt-6 text-center text-sm opacity-80">
        Made with love by Team Rocket
      </p>
      <p className="mt-1 text-center text-xs opacity-60">
        &copy; 2026 Respawn. All rights reserved.
      </p>
    </footer>
  )
}
