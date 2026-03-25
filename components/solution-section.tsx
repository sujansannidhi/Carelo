"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import {
  Activity,
  Bell,
  Brain,
  FileText,
  Scale,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Activity,
    title: "Health Integration Hub",
    description: "Full Apple Health and smartwatch integration that automatically syncs vitals, activity data, and sleep into one organized dashboard with weekly caregiver reports.",
    highlight: true,
  },
  {
    icon: Bell,
    title: "Smart Medication System",
    description: "Full-screen reminders with caregiver-customizable schedules and large one-tap confirmation buttons. Missed doses trigger immediate alerts with pattern detection for consecutive nonadherence.",
    highlight: true,
  },
  {
    icon: Scale,
    title: "Phone-Scan Weight Tracking",
    description: "Place a reference sticker on any existing bathroom scale, hold your phone over the display, and the app reads and stores the weight automatically with daily reminders and trend monitoring.",
    highlight: true,
  },
  {
    icon: Brain,
    title: "Cognitive Mini-Tests",
    description: "Short, engaging brain exercises that quietly score cognitive performance over time, generating longitudinal reports for caregivers and physicians to detect early signs of decline like Alzheimer's.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Safety Check-In",
    description: "At caregiver-configured times each day, a large \"I'm Okay\" button appears. If the senior doesn't respond, the caregiver is notified immediately.",
    highlight: true,
  },
  {
    icon: Users,
    title: "Dual Interface Design",
    description: "Two completely separate experiences: an oversized, zero-navigation interface for seniors and a full data dashboard with alerts and reports for caregivers.",
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Wellness Score & Pattern Detection",
    description: "A composite score across medication adherence, weight stability, cognitive performance, and check-ins — plus automatic anomaly detection with instant caregiver alerts.",
    highlight: false,
  },
  {
    icon: FileText,
    title: "Weekly Health Reports",
    description: "Comprehensive weekly summaries covering weight trends, medication compliance, cognitive scores, check-in history, and flagged anomalies delivered to the caregiver.",
    highlight: false,
  },
]

function FeatureCard({
  feature,
  index,
  scrollYProgress,
}: {
  feature: (typeof features)[0]
  index: number
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" })

  // Icon floats at a slightly different rate than the card
  const iconY = useTransform(scrollYProgress, [0, 1], [0, -15 - (index % 4) * 5])

  // Determine entry direction: top row slides from top, bottom row from bottom
  const row = index < 4 ? 0 : 1

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: row === 0 ? -40 : 40,
        scale: 0.95,
      }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : {}
      }
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className={`group relative h-full rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          feature.highlight
            ? "border-primary/20 bg-card shadow-sm"
            : "border-border bg-card/60 hover:bg-card"
        }`}
      >
        <motion.div
          style={{ y: iconY }}
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
            feature.highlight
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
        >
          <feature.icon className="h-5 w-5" />
        </motion.div>
        <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
      </div>
    </motion.div>
  )
}

export function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-60px 0px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax background elements
  const bgOrb1Y = useTransform(scrollYProgress, [0, 1], [80, -80])
  const bgOrb2Y = useTransform(scrollYProgress, [0, 1], [50, -100])

  return (
    <section id="solution" ref={sectionRef} className="relative py-20 md:py-28 bg-muted/30 overflow-hidden">
      {/* Parallax decorative orbs */}
      <motion.div
        style={{ y: bgOrb1Y }}
        className="pointer-events-none absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: bgOrb2Y }}
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[350px] w-[350px] rounded-full bg-accent/8 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            The Solution
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet Carelo.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            One affordable subscription that handles medication tracking, weight monitoring, cognitive testing, daily check-ins, and a full caregiver dashboard — no hardware to purchase, no complex setup, and no learning curve for the senior.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
