"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Heart, Quote } from "lucide-react"

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px 0px" })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const bgOrb1Y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const bgOrb2Y = useTransform(scrollYProgress, [0, 1], [40, -80])

  return (
    <section id="story" ref={sectionRef} className="relative py-20 md:py-28 bg-muted/30 overflow-hidden">
      {/* Parallax decorative orbs */}
      <motion.div
        style={{ y: bgOrb1Y }}
        className="pointer-events-none absolute -top-24 -left-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: bgOrb2Y }}
        className="pointer-events-none absolute -bottom-24 -right-32 h-[350px] w-[350px] rounded-full bg-accent/8 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Story
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Born From a Family&apos;s Struggle.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 relative"
        >
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm">
            <Quote className="h-8 w-8 text-primary/20 mb-4" />
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Carelo started with late-night phone calls. Our founder, Sujan, watched his father juggle a demanding career in America while making calls across time zones to India — just to confirm whether his grandfather took his medication and was physically safe. The same thing, over and over: <span className="text-foreground font-medium">Did he eat? Is he active? Did he take his medicine?</span>
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              That helplessness of being far away with no reliable way to check on a loved one is what Carelo was built to solve. No family should have to choose between their career and caring for their parents&apos; health.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Today, approximately <span className="text-foreground font-medium">16.2 million seniors in America live alone</span>, and that number is climbing every year. With <span className="text-foreground font-medium">55% of workers globally</span> reporting increasingly intense jobs, and over <span className="text-foreground font-medium">281 million international migrants</span> living far from aging parents — the need for a solution has never been more urgent.
            </p>

            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Sujan Sannidhi</p>
                <p className="text-sm text-muted-foreground">Founder & CEO, Carelo</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-center"
        >
          <p className="text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Carelo is driven by a simple mission: prevent health issues before they become emergencies, preserve independence for aging adults, and give every caregiver the peace of mind they deserve — no matter the distance.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
