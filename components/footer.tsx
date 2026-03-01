import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Partnership CTA */}
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <p className="text-muted-foreground">
          Interested in early partnerships or caregiving services?
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfJNoIufBkdJlIuWec9IxGm1CAeINMjjS_Hq-ACdbD38tRJCg/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium shadow-xs transition-all hover:bg-accent hover:text-accent-foreground"
        >
          Partner With Us
        </a>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/images/carelo-logo.png"
              alt="Carelo logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Carelo
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Founder: Sujan Sannidhi || Co-Founder: Aarthi Padavala
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </a>
            <a href="/founders" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Founders
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
