"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion"
import Image from "next/image"
import { Check } from "lucide-react"

const benefits = [
  "Transforms raw health data into a single clarity score",
  "Actionable insights, not just numbers",
  "Real-time alerts when something needs attention",
  "Designed for families, not hospitals",
]

function AnimatedCounter({ target, isInView }: { target: number; isInView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return () => controls.stop()
  }, [isInView, target])

  return <span>{count}</span>
}

export function EdgeSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const isScoreInView = useInView(scoreRef, { once: true, margin: "-100px 0px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Image parallax — moves slower than scroll (creates depth)
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 2])

  // Text content parallax — subtle upward drift
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30])

  // Background glow parallax
  const glowY = useTransform(scrollYProgress, [0, 1], [40, -80])
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9])

  return (
    <section id="edge" ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      {/* Parallax background glow */}
      <motion.div
        style={{ y: glowY, scale: glowScale }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Image mockup with parallax */}
          <motion.div
            style={{ y: imageY, rotate: imageRotate }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <Image
                src="/images/peace-of-mind-screen.jpg"
                alt="Peace of Mind Score showing a 92 out of 100 health score with medication, activity, and weight status indicators"
                width={450}
                height={450}
                className="relative rounded-2xl shadow-xl shadow-primary/10"
              />
            </div>
          </motion.div>

          {/* Right: Text with counter and parallax */}
          <motion.div style={{ y: textY }} className="flex flex-col gap-6">
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm font-semibold uppercase tracking-widest text-primary"
            >
              Competitive Edge
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More Than Monitoring. Real Peace of Mind.
            </motion.h2>

            {/* Animated Peace of Mind Score */}
            <motion.div
              ref={scoreRef}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-6xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                <AnimatedCounter target={92} isInView={isScoreInView} />
              </span>
              <span className="text-2xl font-medium text-muted-foreground">/100</span>
              <span className="ml-2 text-sm font-medium text-muted-foreground">Peace of Mind Score</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg leading-relaxed text-muted-foreground"
            >
              CultivAid transforms raw health data into simple, actionable insights — giving caregivers clarity, not just numbers. Our Peace of Mind Score distills everything into one number you can trust.
            </motion.p>

            <ul className="flex flex-col gap-3 pt-2">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
