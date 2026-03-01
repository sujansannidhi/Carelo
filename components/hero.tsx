"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // === Parallax on content ===
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80])

  // === Background parallax orbs ===
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -150])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden pt-32 pb-20">
      {/* Yellow corner accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-yellow-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-yellow-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-yellow-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-yellow-400/15 blur-[120px]" />

      {/* Parallax background orbs */}
      <motion.div
        style={{ y: orb1Y }}
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl"
      />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6"
      >
        {/* === Logo === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/cultivaid-logo.png"
            alt="CultivAid logo"
            width={120}
            height={120}
            className="h-24 w-24 object-contain mix-blend-multiply dark:mix-blend-screen sm:h-28 sm:w-28 md:h-32 md:w-32"
            priority
          />
        </motion.div>

        {/* === Company name — letter-by-letter stagger === */}
        <h1
          className="mt-3 flex text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {"Cultiv".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
              className="text-foreground"
            >
              {letter}
            </motion.span>
          ))}
          {"Aid".split("").map((letter, i) => (
            <motion.span
              key={i + 6}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.1 + (i + 6) * 0.045, ease: [0.22, 1, 0.36, 1] }}
              className="text-primary"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* === Headline === */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl text-balance"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Care Without Compromise.
        </motion.h2>

        {/* === Subheadline === */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          A family ecosystem that protects the people who once protected you.
        </motion.p>

        {/* === Launch date === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Launching Summer 2026
        </motion.div>

        {/* === CTA Buttons === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

      </motion.div>

      {/* === Scroll indicator === */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#problem" className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground" aria-label="Scroll to learn more">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </motion.div>
    </section>
  )
}

