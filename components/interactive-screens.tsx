"use client"

import { useState } from "react"
import {
  Activity,
  ArrowRight,
  Brain,
  Check,
  ChevronLeft,
  Droplets,
  Heart,
  Moon,
  Pill,
  Scale,
  Thermometer,
  TrendingUp,
  Wind,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Shared phone wrapper                                               */
/* ------------------------------------------------------------------ */

function PhoneFrame({ children, statusBar = "4:18 PM" }: { children: React.ReactNode; statusBar?: string }) {
  return (
    <div className="relative w-[280px] md:w-[310px] select-none">
      {/* Outer frame */}
      <div className="rounded-[2.5rem] border-[3px] border-foreground/10 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
        {/* Notch area */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-[10px] font-semibold text-muted-foreground">{statusBar}</span>
          <div className="h-5 w-20 rounded-full bg-foreground/10" />
          <div className="flex items-center gap-1">
            <div className="h-2 w-3 rounded-sm bg-muted-foreground/40" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <div className="h-2.5 w-4 rounded-sm border border-muted-foreground/40 relative">
              <div className="absolute inset-[2px] rounded-[1px] bg-muted-foreground/40" />
            </div>
          </div>
        </div>
        {/* Screen content */}
        <div className="px-5 pb-6">
          {children}
        </div>
        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="h-1 w-28 rounded-full bg-foreground/10" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  1. Senior Home Screen                                              */
/* ------------------------------------------------------------------ */

export function SeniorHomeScreen() {
  const [tapped, setTapped] = useState<string | null>(null)

  const actions = [
    { id: "medicine", label: "Take Medicine", sub: "1 dose due now", icon: Pill, color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", iconColor: "text-amber-600", badge: true },
    { id: "okay", label: "I'm Okay", sub: "Daily check-in", icon: Heart, color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", iconColor: "text-blue-600", badge: false },
    { id: "weight", label: "Check Weight", sub: "Tap to scan", icon: Scale, color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", iconColor: "text-emerald-600", badge: false },
    { id: "brain", label: "Brain Exercise", sub: "Today's activity", icon: Brain, color: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800", iconColor: "text-pink-600", badge: false },
  ]

  return (
    <PhoneFrame>
      <div className="pt-2 space-y-5">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Good Afternoon,</p>
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Dorothy</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Wellness card */}
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3.5 flex items-center gap-3 transition-all duration-300 hover:bg-primary/15 hover:scale-[1.02] cursor-default">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">84</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Your Wellness Today</p>
            <p className="text-sm font-bold text-primary">Doing Great!</p>
            <p className="text-[10px] text-muted-foreground">Sarah is monitoring your health</p>
          </div>
        </div>

        {/* What would you like to do? */}
        <p className="text-xs font-medium text-muted-foreground">What would you like to do?</p>

        {/* Action grid */}
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setTapped(tapped === action.id ? null : action.id)}
              className={`relative rounded-2xl border ${action.color} p-4 text-left transition-all duration-300 ${
                tapped === action.id
                  ? "scale-95 ring-2 ring-primary shadow-lg"
                  : "hover:scale-[1.04] hover:shadow-md"
              }`}
            >
              {action.badge && (
                <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
              )}
              <action.icon className={`h-6 w-6 ${action.iconColor} mb-2`} />
              <p className="text-sm font-bold text-foreground">{action.label}</p>
              <p className="text-[10px] text-muted-foreground">{action.sub}</p>
              {tapped === action.id && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-primary">
                  <Check className="h-3 w-3" /> Tap to open
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Connected status */}
        <div className="rounded-xl bg-muted/50 border border-border p-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-foreground">Connected to Sarah</p>
            <p className="text-[9px] text-muted-foreground">She can see your health data</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Health Vitals Screen                                            */
/* ------------------------------------------------------------------ */

export function HealthVitalsScreen() {
  const [hoveredVital, setHoveredVital] = useState<string | null>(null)

  const vitals = [
    { id: "hr", icon: Heart, label: "Heart Rate", value: "72", unit: "bpm", status: "Normal", statusColor: "text-emerald-600", bgColor: "bg-red-50 dark:bg-red-950/30", iconColor: "text-red-500" },
    { id: "bp", icon: Activity, label: "Blood Pressure", value: "128/82", unit: "mmHg", status: "Slightly High", statusColor: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/30", iconColor: "text-amber-500" },
    { id: "o2", icon: Droplets, label: "Blood Oxygen", value: "97", unit: "%", status: "Normal", statusColor: "text-emerald-600", bgColor: "bg-blue-50 dark:bg-blue-950/30", iconColor: "text-blue-500" },
    { id: "rr", icon: Wind, label: "Resp. Rate", value: "16", unit: "breaths/min", status: "Normal", statusColor: "text-emerald-600", bgColor: "bg-teal-50 dark:bg-teal-950/30", iconColor: "text-teal-500" },
    { id: "temp", icon: Thermometer, label: "Temperature", value: "98.4", unit: "\u00B0F", status: "Normal", statusColor: "text-emerald-600", bgColor: "bg-orange-50 dark:bg-orange-950/30", iconColor: "text-orange-500" },
    { id: "sleep", icon: Moon, label: "Sleep", value: "6.8", unit: "hrs", status: "Good", statusColor: "text-emerald-600", bgColor: "bg-indigo-50 dark:bg-indigo-950/30", iconColor: "text-indigo-500" },
  ]

  return (
    <PhoneFrame statusBar="9:45 AM">
      <div className="pt-2 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Health</p>
          </div>
          <div className="relative">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">2</span>
            </div>
          </div>
        </div>

        {/* Today's Vitals label */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today&apos;s Vitals</p>

        {/* Vitals grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {vitals.map((vital) => (
            <div
              key={vital.id}
              onMouseEnter={() => setHoveredVital(vital.id)}
              onMouseLeave={() => setHoveredVital(null)}
              className={`rounded-xl border border-border ${vital.bgColor} p-3 transition-all duration-300 cursor-default ${
                hoveredVital === vital.id
                  ? "scale-[1.05] shadow-lg ring-2 ring-primary/30 z-10"
                  : "hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <vital.icon className={`h-4 w-4 ${vital.iconColor}`} />
                <span className={`text-[9px] font-semibold ${vital.statusColor}`}>{vital.status}</span>
              </div>
              <p className="text-xl font-bold text-foreground leading-tight">{vital.value}</p>
              <p className="text-[9px] text-muted-foreground">{vital.unit}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{vital.label}</p>
              {hoveredVital === vital.id && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50">
                  <p className="text-[9px] font-medium text-primary flex items-center gap-0.5">
                    <TrendingUp className="h-2.5 w-2.5" /> View 7-day trend
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apple Health badge */}
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-muted/50 border border-border py-2">
          <span className="text-[10px] font-medium text-primary">Pulled from Apple Health</span>
          <Check className="h-3 w-3 text-primary" />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  3. Weight Tracking Screen                                          */
/* ------------------------------------------------------------------ */

export function WeightTrackingScreen() {
  const [step, setStep] = useState(0)

  const steps = [
    { num: 1, text: "Put your phone aside \u2014 face down or on a surface" },
    { num: 2, text: "Step onto your weighing scale" },
    { num: 3, text: "Look straight ahead and stand still" },
  ]

  return (
    <PhoneFrame statusBar="8:30 AM">
      <div className="pt-2 space-y-5">
        {/* Back button */}
        <button className="flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scale illustration */}
        <div className="flex justify-center">
          <div className="relative h-24 w-24 rounded-2xl bg-muted/50 flex items-center justify-center transition-all duration-500 hover:bg-primary/10 hover:scale-105">
            <Scale className="h-12 w-12 text-muted-foreground/60" />
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Step on the Scale</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Put your phone down nearby, step on the scale, and stand up straight.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div
              key={s.num}
              onMouseEnter={() => setStep(i)}
              className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-300 cursor-default ${
                step === i
                  ? "bg-primary/10 border border-primary/20 scale-[1.02]"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${
                step === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {s.num}
              </span>
              <p className={`text-sm transition-colors duration-300 ${
                step === i ? "text-foreground font-medium" : "text-muted-foreground"
              }`}>
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/20">
            <span className="text-2xl font-bold text-primary">2</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Your phone will vibrate when ready</p>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  4. Safety Check-In Screen                                          */
/* ------------------------------------------------------------------ */

export function CheckInScreen() {
  const [pressed, setPressed] = useState(false)

  return (
    <PhoneFrame statusBar="7:00 AM">
      <div className="pt-6 flex flex-col items-center gap-6 min-h-[420px] justify-center">
        {/* Greeting */}
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Good Morning,
          </p>
          <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Dorothy!
          </p>
        </div>

        {/* Subtitle */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">Sarah wants to know you&apos;re okay.</p>
          <p className="text-xs text-muted-foreground">Please press the button below.</p>
        </div>

        {/* I'm Okay button */}
        <button
          onClick={() => setPressed(!pressed)}
          className={`relative h-32 w-32 rounded-full transition-all duration-500 ${
            pressed
              ? "bg-emerald-500 scale-95 shadow-lg shadow-emerald-500/30"
              : "bg-primary shadow-xl shadow-primary/30 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 active:scale-95"
          }`}
        >
          {/* Pulse ring */}
          {!pressed && (
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          )}
          <span className="relative flex flex-col items-center justify-center gap-1">
            {pressed ? (
              <>
                <Check className="h-8 w-8 text-white" />
                <span className="text-sm font-bold text-white">Done!</span>
              </>
            ) : (
              <>
                <Heart className="h-8 w-8 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">I&apos;m Okay!</span>
              </>
            )}
          </span>
        </button>

        {/* Helper text */}
        <p className="text-[10px] text-muted-foreground text-center">
          {pressed
            ? "Sarah has been notified. Have a great day!"
            : "If you don't respond, Sarah will be notified."
          }
        </p>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  5. Cognitive Mini-Test Screen                                      */
/* ------------------------------------------------------------------ */

export function CognitiveTestScreen() {
  const [selected, setSelected] = useState<number | null>(null)

  const answers = [
    { id: 0, text: "Rose", correct: false },
    { id: 1, text: "Daisy", correct: true },
    { id: 2, text: "Tulip", correct: false },
    { id: 3, text: "Lily", correct: false },
  ]

  return (
    <PhoneFrame statusBar="2:15 PM">
      <div className="pt-2 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-pink-500" />
            <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Brain Exercise</p>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">3 of 5</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-500" />
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 p-3">
          <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
            <span className="text-sm font-bold text-pink-600">78</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Current Score</p>
            <p className="text-[10px] text-muted-foreground">+3 from last week</p>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-xl bg-muted/50 border border-border p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">Memory Recall</p>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            Earlier, we showed you a picture of a flower. Which flower was it?
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-2.5">
          {answers.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className={`w-full rounded-xl border p-3.5 text-left text-sm font-medium transition-all duration-300 ${
                selected === a.id
                  ? a.correct
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-700 dark:text-emerald-400 scale-[1.02] shadow-md"
                    : "bg-red-50 dark:bg-red-950/30 border-red-400 text-red-700 dark:text-red-400 scale-[0.98]"
                  : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{a.text}</span>
                {selected === a.id && (
                  <span className="text-xs">
                    {a.correct ? <Check className="h-4 w-4 text-emerald-600" /> : "\u2717"}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {selected !== null && (
          <p className="text-[10px] text-center text-muted-foreground">
            {answers[selected].correct
              ? "Great job! Your memory recall is strong."
              : "Not quite \u2014 the correct answer was Daisy. Keep practicing!"
            }
          </p>
        )}
      </div>
    </PhoneFrame>
  )
}
