"use client"

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  Brain,
  ChevronDown,
  Download,
  Eye,
  Heart,
  Phone,
  Pill,
  Scale,
  Send,
  Shield,
  CheckCircle2,
  XCircle,
  User,
  CircleAlert,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Tiny inline SVG charts (no Recharts dependency — pure markup)     */
/* ------------------------------------------------------------------ */

function MiniLineChart() {
  // 7 data points representing weight over the last week
  const points = [151.2, 151.8, 152.0, 151.6, 152.1, 152.4, 152.4]
  const min = Math.min(...points) - 0.5
  const max = Math.max(...points) + 0.5
  const w = 120
  const h = 32

  const pathData = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((p - min) / (max - min)) * h
      return `${i === 0 ? "M" : "L"}${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8EC8E8" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#8EC8E8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${pathData} L${w},${h} L0,${h} Z`} fill="url(#lineGrad)" />
      <path d={pathData} fill="none" stroke="#8EC8E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MiniBarChart() {
  const bars = [4200, 3800, 5100, 2900, 4600, 3200, 4800]
  const max = Math.max(...bars)
  return (
    <div className="flex items-end gap-[3px] h-8 w-full">
      {bars.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-primary/60"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function CircularProgress({ value, size = 40, stroke = 3.5 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-muted/30" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-foreground text-[9px] font-bold">
        {value}%
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Dashboard Preview                                                  */
/* ------------------------------------------------------------------ */

export function DashboardPreview() {
  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden text-[10px] md:text-xs select-none">

      {/* ── Top Navigation Bar ── */}
      <header className="flex items-center justify-between px-3 md:px-5 py-2 md:py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 md:h-6 md:w-6 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm md:text-base tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            <span className="text-foreground">Care</span>
            <span className="text-primary">lo</span>
          </span>
        </div>
        <span className="hidden sm:block text-muted-foreground text-[10px] md:text-xs">
          Welcome back, <span className="font-medium text-foreground">Sarah</span>
        </span>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <Bell className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-[7px] font-bold text-white flex items-center justify-center">3</span>
          </div>
          <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" />
          </div>
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">

        {/* ── Account Switcher + Sync ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
            <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-700">M</div>
            <span className="font-medium">Mom (Margaret)</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] md:text-[10px] font-medium">Synced just now</span>
          </div>
        </div>

        {/* ── Primary Overview: Patient Status + Today's Summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Patient Status */}
          <div className="rounded-xl border border-border bg-card p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg md:text-xl">👵</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base truncate">Margaret Chen</p>
                <p className="text-muted-foreground text-[10px] md:text-xs">Age 78</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[9px] md:text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Stable
              </span>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="rounded-xl border border-border bg-card p-3 md:p-4">
            <p className="font-semibold mb-2">Today&apos;s Summary</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <Pill className="h-3 w-3 text-primary shrink-0" />
                <span>Medication: <span className="font-semibold text-foreground">2/3</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="h-3 w-3 text-primary shrink-0" />
                <span>Weight: <span className="font-semibold text-foreground">152.4 lbs</span> <span className="text-amber-600 text-[9px]">(+0.8)</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-emerald-500 shrink-0" />
                <span>Check-in: <span className="font-semibold text-emerald-600">Done</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Brain className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>Cognitive: <span className="font-semibold text-amber-600">Not Taken</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Health Insights (4 metric cards) ── */}
        <div>
          <p className="font-semibold text-sm md:text-base mb-2" style={{ fontFamily: "var(--font-heading)" }}>Health Insights</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">

            {/* Weight Trends */}
            <div className="rounded-xl border border-border bg-card p-2.5 md:p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground flex items-center gap-1">
                  <Scale className="h-3 w-3" /> Weight
                </span>
                <ArrowUp className="h-3 w-3 text-amber-500" />
              </div>
              <MiniLineChart />
              <p className="text-[9px] md:text-[10px] text-amber-600 font-medium leading-tight">
                Slight upward trend detected.
              </p>
            </div>

            {/* Medication Adherence */}
            <div className="rounded-xl border border-border bg-card p-2.5 md:p-3 space-y-1.5">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <Pill className="h-3 w-3" /> Medication
              </span>
              <div className="flex items-center gap-2">
                <CircularProgress value={86} />
                <div>
                  <p className="font-bold text-sm text-foreground">86%</p>
                  <p className="text-[9px] text-muted-foreground">This week</p>
                </div>
              </div>
              <p className="text-[9px] md:text-[10px] text-destructive font-medium leading-tight flex items-center gap-0.5">
                <XCircle className="h-2.5 w-2.5 shrink-0" /> 1 missed dose today
              </p>
            </div>

            {/* Cognitive Score */}
            <div className="rounded-xl border border-border bg-card p-2.5 md:p-3 space-y-1.5">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <Brain className="h-3 w-3" /> Cognitive
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-foreground">74</span>
                <span className="text-muted-foreground text-[10px]">/100</span>
                <ArrowDown className="h-3 w-3 text-destructive ml-auto" />
              </div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">
                Slight decline — monitor this week.
              </p>
            </div>

            {/* Activity Levels */}
            <div className="rounded-xl border border-border bg-card p-2.5 md:p-3 space-y-1.5">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3" /> Activity
              </span>
              <MiniBarChart />
              <p className="text-[9px] md:text-[10px] text-amber-600 font-medium leading-tight">
                Below weekly average by 18%.
              </p>
            </div>
          </div>
        </div>

        {/* ── Alerts & AI Detection ── */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 md:p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" />
            <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Alerts &amp; AI Detection</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg bg-background/80 border border-border px-2.5 py-2">
              <CircleAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
              <span className="flex-1 font-medium">3 consecutive missed medications</span>
              <div className="flex gap-1 shrink-0">
                <button className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[9px] font-semibold hover:bg-primary/20 transition-colors">
                  <Eye className="h-2.5 w-2.5 inline mr-0.5" />View
                </button>
                <button className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-[9px] font-semibold hover:bg-primary/90 transition-colors">
                  <Phone className="h-2.5 w-2.5 inline mr-0.5" />Call
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 border border-border px-2.5 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="flex-1 font-medium">Unusual weight fluctuation detected</span>
              <button className="rounded-md bg-muted text-muted-foreground px-2 py-0.5 text-[9px] font-semibold hover:bg-muted/80 transition-colors shrink-0">Mark Resolved</button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 border border-border px-2.5 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="flex-1 font-medium">Cognitive score dropped 12% this week</span>
              <button className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[9px] font-semibold hover:bg-primary/20 transition-colors shrink-0">
                <Eye className="h-2.5 w-2.5 inline mr-0.5" />Details
              </button>
            </div>
          </div>
        </div>

        {/* ── Weekly AI Report ── */}
        <div className="rounded-xl border border-border bg-card p-3 md:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Carelo Weekly Health Summary
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-[9px] font-semibold text-amber-700 dark:text-amber-400">
              Moderate Risk
            </span>
          </div>
          <ul className="space-y-1 text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Medication adherence dipped to 86% — 2 evening doses missed.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Weight increased 1.2 lbs over 7 days — slight upward trend.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Cognitive score dropped from 84 to 74 — recommend daily exercises.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Activity levels 18% below weekly average — encourage light walks.</span>
            </li>
          </ul>
          <div className="flex gap-2 pt-1">
            <button className="inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-[10px] md:text-xs font-semibold hover:bg-primary/90 transition-colors">
              <Download className="h-3 w-3" /> Download PDF
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-card text-foreground px-3 py-1.5 text-[10px] md:text-xs font-semibold hover:bg-muted transition-colors">
              <Send className="h-3 w-3" /> Send to Doctor
            </button>
          </div>
        </div>
      </div>

      {/* ── Emergency Contact FAB ── */}
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20">
        <button className="flex items-center gap-1.5 rounded-full bg-destructive text-white px-3 py-2 text-[10px] md:text-xs font-semibold shadow-lg shadow-destructive/30 hover:bg-destructive/90 transition-colors">
          <Phone className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">Emergency</span>
        </button>
      </div>
    </div>
  )
}
