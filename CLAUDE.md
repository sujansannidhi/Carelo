# CultivAid — Family Elderly Care Ecosystem

> "A family ecosystem to balance work-life without sacrificing your care for elderly loved ones."

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (CSS-based config, no tailwind.config)
- shadcn/ui (Radix UI primitives)
- Framer Motion (animations & parallax)
- React Hook Form + Zod (forms & validation)
- Recharts (charts/data viz)
- Lucide React (icons)
- Sonner (toasts)
- next-themes (dark mode)
- Vercel Analytics

## MVP Features

### 1. Health Integration Hub
- Apple Health + smartwatch integration
- Organized health data dashboard
- Weekly health reports sent to caregiver

### 2. Smart Medication & Daily Check-In
- Full-screen reminders (caregiver-customizable)
- One-tap large buttons: "Took Medicine" / "I'm Okay"
- Missed medication alerts to caregiver

### 3. Weight Tracking (NFC Sticker)
- Place sticker on existing weight machine
- Phone scan (NFC) to store weight data
- Trend tracking with anomaly detection

### 4. Cognitive Mini-Tests
- Fun daily brain exercises for elderly
- Track cognitive health over time
- Reports sent to caregiver for early detection (Alzheimer's etc.)

### 5. Dual Account System
- **Caregiver UI**: Dashboard, reports, alerts, settings, customization
- **Elderly UI**: Simplified, large text/buttons, minimal navigation, high contrast

### 6. Safety & Alerts
- Unusual pattern detection (weight changes, missed meds) — immediate alerts
- Phone location tracking (opt-in)
- Scam call detection — redirect to caregiver

## Design Principles
- **Elderly UI**: Extra-large buttons, high contrast, minimal cognitive load, full-screen interactions
- **Caregiver UI**: Information-dense dashboard, actionable alerts, detailed reports
- **Parallax scrolling** on landing page using Framer Motion scroll-driven animations
- Mobile-first responsive design
- Accessibility-first (WCAG AA minimum)

## Current State
- Landing page complete with: Navbar, Hero (parallax), Problem Section, Solution Section, Edge Section, CTA, Footer
- 60+ shadcn/ui components ready
- Scroll-based Framer Motion animations throughout

## Conventions
- Use `cn()` from `@/lib/utils` for merging Tailwind classes
- Server components by default; add `"use client"` only when needed
- Use shadcn/ui components before building custom ones
- Keep components small and focused
- Co-locate types with components unless shared

## File Structure
- `app/` — Pages and layouts (App Router)
- `components/ui/` — shadcn/ui components
- `components/` — Feature/page components (navbar, hero, sections)
- `hooks/` — Custom React hooks
- `lib/` — Utilities and helpers
- `public/images/` — Logos, mockups, screenshots
- `public/icons/` — App icons

## Key Files
- `app/page.tsx` — Homepage (landing page)
- `app/layout.tsx` — Root layout with fonts (Inter + Rubik)
- `app/globals.css` — Theme variables (OKLch colors), animations
- `components/hero.tsx` — Hero with parallax scroll animations
- `components/animate-on-scroll.tsx` — Reusable scroll animation wrapper
