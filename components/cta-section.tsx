"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 shadow-lg sm:px-12 md:py-20">
          {/* Background accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-xl text-center">
            <h2
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Launching Soon.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Be the first to experience smarter elderly care. Join our waitlist and get notified when we launch.
            </p>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {"You're on the list!"}
                </p>
                <p className="text-muted-foreground">
                  {"We'll notify you as soon as CultivAid is ready."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-full px-5 text-base flex-1"
                  aria-label="Email address"
                />
                <Button type="submit" size="lg" className="rounded-full px-6" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Notify Me
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
