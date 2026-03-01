"use client"

import { motion } from "framer-motion"

interface CareloLogoAnimatedProps {
  className?: string
}

const drawTransition = (delay: number) => ({
  pathLength: {
    duration: 0.6,
    delay,
    ease: [0.65, 0, 0.35, 1] as const,
  },
  strokeOpacity: {
    duration: 0.3,
    delay,
    ease: "easeOut" as const,
  },
})

export function CareloLogoAnimated({ className }: CareloLogoAnimatedProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/*
        Two interlocking hollow L-shapes.
        Each arm is a U/C-shaped outline path with thick stroke (no fill),
        creating the pill-like hollow arms seen in the actual logo.

        Z-order (SVG document order = back to front):
        1. Blue left arm (back)
        2. Yellow right arm
        3. Yellow bottom arm (in front of blue left)
        4. Blue top arm (in front of yellow right)
      */}

      {/* Blue left arm — C-shape, open on right */}
      <motion.path
        d="M 128 94 L 48 94 A 18 18 0 0 0 48 130 L 128 130"
        stroke="#8EC8E8"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{ pathLength: 1, strokeOpacity: 1 }}
        transition={drawTransition(0)}
      />

      {/* Yellow right arm — reversed C-shape, open on left */}
      <motion.path
        d="M 112 110 L 192 110 A 18 18 0 0 1 192 146 L 112 146"
        stroke="#E8D44D"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{ pathLength: 1, strokeOpacity: 1 }}
        transition={drawTransition(0.7)}
      />

      {/* Yellow bottom arm — U-shape, open on top */}
      <motion.path
        d="M 130 128 L 130 200 A 18 18 0 0 1 94 200 L 94 128"
        stroke="#E8D44D"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{ pathLength: 1, strokeOpacity: 1 }}
        transition={drawTransition(1.0)}
      />

      {/* Blue top arm — inverted U-shape, open on bottom */}
      <motion.path
        d="M 110 112 L 110 40 A 18 18 0 0 1 146 40 L 146 112"
        stroke="#8EC8E8"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{ pathLength: 1, strokeOpacity: 1 }}
        transition={drawTransition(0.3)}
      />
    </svg>
  )
}
