"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AlertTriangle, Eye, Pill } from "lucide-react"

const problems = [
  {
    icon: Pill,
    title: "Medication Missed",
    description:
      "Without real-time confirmation, you're left wondering if their medication was taken on time.",
  },
  {
    icon: AlertTriangle,
    title: "Sudden Health Changes",
    description:
      "Weight fluctuations and behavioral shifts can go unnoticed until it's too late to act.",
  },
  {
    icon: Eye,
    title: "No Real-Time Visibility",
    description:
      "Most caregivers have zero insight into their loved one's daily health between visits.",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" })

  return (
    <section id="problem" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
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
            Millions of families struggle to balance their careers with the
            responsibility of caring for aging parents. The emotional toll is
            real — and the tools available today aren&apos;t designed for modern
            families.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {problems.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
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
          ))}
        </motion.div>
      </div>
    </section>
  )
}
