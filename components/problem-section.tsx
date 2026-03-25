"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { AlertTriangle, Eye, Pill, Globe, Briefcase, Users } from "lucide-react"

const problems = [
  {
    icon: Pill,
    title: "Medication Missed",
    description:
      "57% of caregivers can't confirm whether medication was taken. You're left guessing every single day.",
    direction: -1, // slide from left
  },
  {
    icon: AlertTriangle,
    title: "Sudden Health Changes",
    description:
      "Weight fluctuations and behavioral shifts go unnoticed until it's too late. No one is tracking the patterns between doctor visits.",
    direction: 0, // slide from bottom
  },
  {
    icon: Eye,
    title: "No Real-Time Visibility",
    description:
      "62% of caregivers lack daily health updates. Phone calls only tell you what they remember to share.",
    direction: 1, // slide from right
  },
]

const stats = [
  { number: "16.2M", label: "Seniors living alone in the U.S.", icon: Users },
  { number: "63M", label: "Americans serving as family caregivers", icon: Briefcase },
  { number: "281M", label: "International migrants away from aging parents", icon: Globe },
]

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px 0px" })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax for background decorative elements
  const bgOrb1Y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const bgOrb2Y = useTransform(scrollYProgress, [0, 1], [40, -80])

  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden">
      {/* Parallax background orbs */}
      <motion.div
        style={{ y: bgOrb1Y }}
        className="pointer-events-none absolute -top-20 -left-32 h-[350px] w-[350px] rounded-full bg-destructive/5 blur-3xl"
      />
      <motion.div
        style={{ y: bgOrb2Y }}
        className="pointer-events-none absolute -bottom-20 -right-32 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl"
      />

      <div ref={sectionRef} className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Caring Shouldn&apos;t Mean Constant Worry.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
            As families become more geographically separated by work, education, and immigration, adult children are left worrying about aging parents they can&apos;t check on in person. 66% of caregivers say anxiety due to distance is their top challenge — and the tools available today aren&apos;t designed for modern families.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((item, i) => (
            <ParallaxCard key={item.title} item={item} index={i} isInView={isInView} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/60 p-6 text-center"
            >
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{stat.number}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ParallaxCard({
  item,
  index,
  isInView,
  scrollYProgress,
}: {
  item: (typeof problems)[0]
  index: number
  isInView: boolean
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  // Each card has slightly different parallax depth
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -20 - index * 10])

  return (
    <motion.div
      style={{ y: cardY }}
      initial={{
        opacity: 0,
        x: item.direction * 60,
        y: item.direction === 0 ? 50 : 0,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {}
      }
      transition={{
        duration: 0.8,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="group relative h-full rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
          <item.icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {item.title}
        </h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}
