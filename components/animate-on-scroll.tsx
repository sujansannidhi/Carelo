"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  y = 32,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
