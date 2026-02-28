"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Logo: starts centered, scales up slightly, then shrinks and moves up
  const logoScale = useTransform(scrollYProgress, [0, 0.15, 0.4], [1.2, 1.35, 0.6])
  const logoY = useTransform(scrollYProgress, [0, 0.15, 0.4], [0, -10, -60])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.1, 0.35, 0.5], [1, 1, 1, 0])

  // Text: fades in after logo moves
  const headlineOpacity = useTransform(scrollYProgress, [0.12, 0.25], [0, 1])
  const headlineY = useTransform(scrollYProgress, [0.12, 0.25], [40, 0])
  const subheadlineOpacity = useTransform(scrollYProgress, [0.2, 0.32], [0, 1])
  const subheadlineY = useTransform(scrollYProgress, [0.2, 0.32], [30, 0])
  const ctaOpacity = useTransform(scrollYProgress, [0.28, 0.4], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.28, 0.4], [30, 0])

  // Phone mockup parallax — rises from below
  const phoneOpacity = useTransform(scrollYProgress, [0.32, 0.48], [0, 1])
  const phoneY = useTransform(scrollYProgress, [0.32, 0.55], [80, 0])
  const phoneScale = useTransform(scrollYProgress, [0.32, 0.55], [0.9, 1])

  // Background orbs parallax
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -80])

  // Scroll indicator fades out
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <section ref={sectionRef} className="relative min-h-[280vh]">
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Parallax background orbs */}
        <motion.div
          style={{ y: orb1Y }}
          className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          style={{ y: orb2Y }}
          className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6">
          {/* Animated Logo — starts centered */}
          <motion.div
            style={{
              scale: logoScale,
              y: logoY,
              opacity: logoOpacity,
            }}
            className="mb-8"
          >
            <Image
              src="/images/cultivaid-logo.png"
              alt="CultivAid logo"
              width={120}
              height={120}
              className="h-28 w-28 object-contain drop-shadow-lg md:h-36 md:w-36"
              priority
            />
          </motion.div>

          {/* Headline */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Coming Soon
            </div>
            <h1
              className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Care Without Compromise.
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            style={{ opacity: subheadlineOpacity, y: subheadlineY }}
            className="mt-6 max-w-xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            A family ecosystem that protects the people who once protected you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30">
              <a href="#cta">
                Get Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
              <a href="#solution">Learn More</a>
            </Button>
          </motion.div>

          {/* Phone mockup rises in with parallax */}
          <motion.div
            style={{ opacity: phoneOpacity, y: phoneY, scale: phoneScale }}
            className="mt-12 w-full max-w-lg lg:max-w-xl"
          >
            <Image
              src="/images/hero-phones.jpg"
              alt="CultivAid app screens showing Caregiver Dashboard, Medication Reminders, and Peace of Mind Score"
              width={600}
              height={500}
              className="rounded-2xl shadow-2xl shadow-primary/10"
              priority
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#problem" className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground" aria-label="Scroll to learn more">
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
