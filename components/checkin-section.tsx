"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Bell, Clock, SmilePlus, Pill, Brain } from "lucide-react"

const highlights = [
  {
    icon: Bell,
    title: "Caregiver Gets Notified Instantly",
    description: "Every check-in sends a real-time confirmation to the caregiver's dashboard.",
  },
  {
    icon: Pill,
    title: "Missed Dose & Check-In Alerts",
    description: "If medication is missed or a check-in doesn't happen, the caregiver is alerted immediately.",
  },
  {
    icon: Clock,
    title: "Customizable Schedules",
    description: "Caregivers set medication times, check-in windows, and weight reminders — all from their dashboard.",
  },
  {
    icon: Brain,
    title: "Cognitive Trend Tracking",
    description: "Daily brain exercises quietly score performance over time to help detect early signs of decline.",
  },
  {
    icon: SmilePlus,
    title: "Zero Learning Curve",
    description: "Oversized buttons, full-screen prompts, and friendly greetings — designed so seniors never feel overwhelmed.",
  },
]

export function CheckInSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-60px 0px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const bgOrb1Y = useTransform(scrollYProgress, [0, 1], [70, -70])
  const bgOrb2Y = useTransform(scrollYProgress, [0, 1], [50, -90])

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      {/* Parallax decorative orbs */}
      <motion.div
        style={{ y: bgOrb1Y }}
        className="pointer-events-none absolute -top-24 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: bgOrb2Y }}
        className="pointer-events-none absolute -bottom-24 left-1/3 h-[350px] w-[350px] rounded-full bg-accent/8 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works for Seniors
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            So Simple, It Just Works.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Your loved one sees four large buttons and a friendly greeting — nothing more. Every interaction is a single tap. No menus, no confusion, no learning curve.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <HighlightCard key={item.title} item={item} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HighlightCard({
  item,
  index,
  scrollYProgress,
}: {
  item: (typeof highlights)[0]
  index: number
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" })
  const iconY = useTransform(scrollYProgress, [0, 1], [0, -12 - index * 5])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="group relative h-full rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-card">
        <motion.div
          style={{ y: iconY }}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <item.icon className="h-5 w-5" />
        </motion.div>
        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </motion.div>
  )
}
