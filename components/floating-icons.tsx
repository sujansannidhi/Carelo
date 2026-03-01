"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Heart, Pill, Scale, Brain, Shield, Activity } from "lucide-react"

interface FloatingIcon {
  icon: React.ElementType
  x: string
  y: string
  size: number
  speed: number
  opacity: number
  rotate: number
}

const icons: FloatingIcon[] = [
  { icon: Heart, x: "8%", y: "15%", size: 20, speed: -150, opacity: 0.12, rotate: 12 },
  { icon: Pill, x: "85%", y: "25%", size: 24, speed: -200, opacity: 0.1, rotate: -20 },
  { icon: Scale, x: "12%", y: "45%", size: 18, speed: -100, opacity: 0.08, rotate: 8 },
  { icon: Brain, x: "90%", y: "55%", size: 22, speed: -180, opacity: 0.1, rotate: -15 },
  { icon: Shield, x: "5%", y: "70%", size: 16, speed: -120, opacity: 0.08, rotate: 25 },
  { icon: Activity, x: "92%", y: "80%", size: 20, speed: -160, opacity: 0.1, rotate: -10 },
  { icon: Heart, x: "18%", y: "90%", size: 14, speed: -90, opacity: 0.06, rotate: 30 },
  { icon: Pill, x: "78%", y: "10%", size: 16, speed: -140, opacity: 0.08, rotate: -25 },
  { icon: Brain, x: "50%", y: "35%", size: 18, speed: -110, opacity: 0.06, rotate: 5 },
  { icon: Scale, x: "65%", y: "65%", size: 14, speed: -170, opacity: 0.07, rotate: -18 },
]

function FloatingIcon({ icon: Icon, x, y, size, speed, opacity, rotate }: FloatingIcon) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, speed])
  const rotateTransform = useTransform(scrollYProgress, [0, 1], [0, rotate])

  return (
    <motion.div
      ref={ref}
      style={{
        left: x,
        top: y,
        y: yTransform,
        rotate: rotateTransform,
      }}
      className="pointer-events-none absolute"
    >
      <Icon
        style={{ width: size, height: size, opacity }}
        className="text-primary"
      />
    </motion.div>
  )
}

export function FloatingIcons() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {icons.map((icon, i) => (
        <FloatingIcon key={i} {...icon} />
      ))}
    </div>
  )
}
