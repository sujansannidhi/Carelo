"use client"

import { useRef, lazy, Suspense } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { MousePointerClick } from "lucide-react"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { DashboardPreview } from "@/components/dashboard-preview"

const SeniorHomeScreen = lazy(() => import("@/components/interactive-screens").then(m => ({ default: m.SeniorHomeScreen })))
const HealthVitalsScreen = lazy(() => import("@/components/interactive-screens").then(m => ({ default: m.HealthVitalsScreen })))
const WeightTrackingScreen = lazy(() => import("@/components/interactive-screens").then(m => ({ default: m.WeightTrackingScreen })))
const CheckInScreen = lazy(() => import("@/components/interactive-screens").then(m => ({ default: m.CheckInScreen })))
const CognitiveTestScreen = lazy(() => import("@/components/interactive-screens").then(m => ({ default: m.CognitiveTestScreen })))

const screens = [
  {
    label: "Caregiver Dashboard",
    title: "Everything at a Glance.",
    description:
      "A single dashboard that gives you a real-time snapshot of your loved one's health — wellness score, medication status, weight trends, and cognitive scores. Real-time alerts and weekly reports mean no more guessing between visits.",
  },
  {
    label: "Senior Experience",
    title: "Designed for Simplicity.",
    description:
      "Oversized buttons, friendly greetings, and zero navigation. Your loved one sees exactly four things they can do — and each one takes a single tap. No learning curve, no confusion.",
    component: SeniorHomeScreen,
  },
  {
    label: "Health Integration Hub",
    title: "All Vitals in One Place.",
    description:
      "Full Apple Health and smartwatch integration that automatically syncs heart rate, blood pressure, blood oxygen, temperature, and sleep data. Hover over any vital to explore trends.",
    component: HealthVitalsScreen,
  },
  {
    label: "Phone-Scan Weight Tracking",
    title: "No New Devices Needed.",
    description:
      "Place a reference sticker on any existing bathroom scale, and the app guides your loved one step by step. Weight is logged automatically with daily reminders and trend monitoring.",
    component: WeightTrackingScreen,
  },
  {
    label: "Cognitive Mini-Tests",
    title: "Keep the Mind Sharp.",
    description:
      "Short, engaging brain exercises that quietly score cognitive performance over time, generating longitudinal reports for caregivers and physicians to detect early signs of decline.",
    component: CognitiveTestScreen,
  },
  {
    label: "Safety Check-In",
    title: "One Tap. Total Peace of Mind.",
    description:
      "At caregiver-configured times each day, a large button appears. If your loved one doesn't respond within the window, you're notified immediately. Try pressing it yourself.",
    component: CheckInScreen,
  },
]

function PhonePlaceholder() {
  return (
    <div className="w-[280px] md:w-[310px] rounded-[2.5rem] border-[3px] border-foreground/10 bg-card animate-pulse">
      <div className="h-[520px] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    </div>
  )
}

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

  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const isEven = index % 2 === 0
  const ScreenComponent = screen.component

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
        {/* Interactive phone screen */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -80 : 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:[direction:ltr]"
        >
          <motion.div style={{ y: phoneY }} className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-primary/5 blur-2xl" />
            <div className="relative">
              {ScreenComponent && (
                <Suspense fallback={<PhonePlaceholder />}>
                  <ScreenComponent />
                </Suspense>
              )}
            </div>
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2 mt-2 text-sm text-primary/70"
          >
            <MousePointerClick className="h-4 w-4" />
            <span>Interactive — try hovering and clicking</span>
          </motion.div>
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
      {/* First screen: 3D container scroll reveal — Caregiver Dashboard */}
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

      {/* Remaining screens: alternating interactive phone panels */}
      {screens.slice(1).map((screen, i) => (
        <ShowcasePanel key={screen.label} screen={screen} index={i + 1} />
      ))}
    </section>
  )
}
