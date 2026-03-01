"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import { MousePointerClick } from "lucide-react"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { DashboardPreview } from "@/components/dashboard-preview"

const screens = [
  {
    image: "/images/hero-phones.jpg",
    label: "Caregiver Dashboard",
    title: "Everything at a Glance.",
    description:
      "A single dashboard that gives you a real-time snapshot of your loved one's health — medication status, activity levels, weight trends, and cognitive scores. No more guessing, no more anxiety between visits.",
  },
  {
    image: "/images/hero-phones.jpg",
    label: "Smart Medication Reminders",
    title: "Never Miss a Dose.",
    description:
      "Full-screen, elder-friendly reminders with large one-tap buttons — \"Took Medicine\" or \"I'm Okay.\" If a dose is missed, you get an instant alert. Customizable by the caregiver, effortless for the elderly.",
  },
  {
    image: "/images/peace-of-mind-screen.jpg",
    label: "Peace of Mind Score",
    title: "One Number You Can Trust.",
    description:
      "Carelo distills medication adherence, activity levels, weight stability, and cognitive health into a single Peace of Mind Score out of 100. At a glance, you know exactly how your loved one is doing.",
  },
]

function ShowcasePanel({
  screen,
  index,
}: {
  screen: (typeof screens)[number]
  index: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const isEven = index % 2 === 0

  return (
    <div
      ref={panelRef}
      className="mx-auto max-w-6xl px-6 py-20 md:py-32"
    >
      <div
        className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
          isEven ? "" : "lg:[direction:rtl]"
        }`}
      >
        {/* Phone image */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -80 : 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:[direction:ltr]"
        >
          <motion.div style={{ y: imageY }} className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" />
            <Image
              src={screen.image}
              alt={screen.label}
              width={500}
              height={500}
              className="relative w-full max-w-[400px] rounded-2xl shadow-2xl shadow-primary/10"
            />
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="flex flex-col gap-4 lg:[direction:ltr]">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            {screen.label}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {screen.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            {screen.description}
          </motion.p>
        </div>
      </div>
    </div>
  )
}

function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2"
      >
        <MousePointerClick className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap [writing-mode:vertical-lr]">
          Scroll &amp; interact with the dashboard
        </span>
      </motion.div>
    </motion.div>
  )
}

export function AppShowcase() {
  return (
    <section className="relative overflow-hidden">
      {/* First screen: 3D container scroll reveal */}
      <div className="relative">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                {screens[0].label}
              </span>
              <h3
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[3.5rem] leading-tight text-balance"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {screens[0].title}
              </h3>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {screens[0].description}
              </p>
            </div>
          }
        >
          <DashboardPreview />
        </ContainerScroll>
        <ScrollHint />
      </div>

      {/* Remaining screens: alternating parallax panels */}
      {screens.slice(1).map((screen, i) => (
        <ShowcasePanel key={screen.label} screen={screen} index={i + 1} />
      ))}
    </section>
  )
}
