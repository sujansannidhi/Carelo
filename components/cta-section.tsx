"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax background orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], [80, -60])
  const orb1X = useTransform(scrollYProgress, [0, 1], [-20, 20])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [60, -80])
  const orb2X = useTransform(scrollYProgress, [0, 1], [20, -20])
  const orb3Y = useTransform(scrollYProgress, [0, 1], [40, -40])

  // Card itself has subtle parallax
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -10])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="cta" ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          style={{ y: cardY }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 shadow-lg sm:px-12 md:py-20"
        >
          {/* Parallax background accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              style={{ y: orb1Y, x: orb1X }}
              className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl"
            />
            <motion.div
              style={{ y: orb2Y, x: orb2X }}
              className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/12 blur-3xl"
            />
            <motion.div
              style={{ y: orb3Y }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-xl text-center"
          >
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {"You're on the list!"}
                </p>
                <p className="text-muted-foreground">
                  {"We'll notify you as soon as Carelo is ready."}
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
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
              </motion.form>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-xs text-muted-foreground"
            >
              We respect your privacy. No spam, ever.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
