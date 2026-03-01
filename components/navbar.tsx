"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  // Navbar hidden at top, fades in after user scrolls ~300px
  const navOpacity = useTransform(scrollY, [200, 400], [0, 1])
  const navY = useTransform(scrollY, [200, 400], [-20, 0])

  return (
    <motion.header
      style={{ opacity: navOpacity, y: navY }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <Image
            src="/images/cultivaid-logo.png"
            alt="CultivAid logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            CultivAid
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#problem" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Why CultivAid
          </a>
          <a href="#solution" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#edge" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="#cta" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Early Access
          </a>
          <a href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </a>
        </div>

        <div className="hidden md:block">
          <Button asChild className="rounded-full px-6">
            <a href="#cta">Get Early Access</a>
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            <a href="#problem" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Why CultivAid
            </a>
            <a href="#solution" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#edge" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </a>
            <Button asChild className="rounded-full mt-2" onClick={() => setMobileOpen(false)}>
              <a href="#cta">Get Early Access</a>
            </Button>
          </div>
        </div>
      )}
    </motion.header>
  )
}
