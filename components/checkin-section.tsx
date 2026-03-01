"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Bell, Clock, Heart, SmilePlus } from "lucide-react"

const highlights = [
  {
    icon: Bell,
    title: "Caregiver Gets Notified Instantly",
    description: "Every check-in sends a real-time confirmation to the caregiver's dashboard.",
  },
  {
    icon: Clock,
    title: "Missed Check-In Alerts",
    description: "If a check-in is missed, the caregiver is alerted immediately.",
  },
  {
    icon: SmilePlus,
    title: "Customizable Schedule",
    description: "Caregivers set the time and frequency — morning, evening, or both.",
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
  const phoneY = useTransform(scrollYProgress, [0, 1], [40, -40])

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
            Daily Check-In
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            One Tap. Total Peace of Mind.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            At the end of each day, your loved one taps a single button to let you know they&apos;re okay. No typing, no complexity — just one tap.
          </p>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          style={{ y: phoneY }}
          className="mt-16 flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Glow behind phone */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/5 blur-2xl" />

            {/* Phone frame */}
            <div className="relative w-[280px] rounded-[2.5rem] border-2 border-border bg-card p-6 pt-10 pb-8 shadow-xl shadow-primary/10">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-muted" />

              {/* Screen content */}
              <div className="flex flex-col items-center gap-6 pt-4">
                <p className="text-sm font-medium text-muted-foreground">Good evening, Mom</p>
                <p className="text-center text-base font-medium text-foreground">How are you feeling today?</p>

                {/* I'm Okay button */}
                <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <Heart className="h-6 w-6" />
                  I&apos;m Okay
                </button>

                {/* Took Medicine button */}
                <button className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 py-4 text-lg font-semibold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Took Medicine
                </button>

                <p className="text-xs text-muted-foreground">Last check-in: Today, 6:30 PM</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature highlights */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
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
