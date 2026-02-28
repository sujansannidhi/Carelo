import {
  Activity,
  Bell,
  Brain,
  MapPin,
  Phone,
  Scale,
  Shield,
  Users,
} from "lucide-react"
import { AnimateOnScroll } from "@/components/animate-on-scroll"

const features = [
  {
    icon: Activity,
    title: "Health Integration Hub",
    description: "Full Apple Health and smartwatch integration with organized weekly reports.",
    highlight: true,
  },
  {
    icon: Bell,
    title: "Smart Medication System",
    description: "Full-screen customizable reminders with one-tap confirmations.",
    highlight: false,
  },
  {
    icon: Scale,
    title: "Weight Tracking Made Simple",
    description: "Scan your scale with a smart sticker to log weight instantly.",
    highlight: false,
  },
  {
    icon: Brain,
    title: "Cognitive Mini Test",
    description: "Daily mental engagement with trend reporting for caregivers.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Unusual Pattern Detection",
    description: "Immediate alerts for weight changes or missed medication.",
    highlight: false,
  },
  {
    icon: Users,
    title: "Dual Account System",
    description: "Simple UI for elderly. Advanced dashboard for caregivers.",
    highlight: true,
  },
  {
    icon: Phone,
    title: "Scam Call Protection",
    description: "Suspicious calls can be redirected to caregivers for safety.",
    highlight: false,
  },
  {
    icon: MapPin,
    title: "Location Safety Mode",
    description: "Optional location sharing for additional peace of mind.",
    highlight: false,
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6">
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            The Solution
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet CultivAid.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            An intelligent care platform that bridges the gap between you and your elderly loved ones — no matter the distance.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 75}>
              <div
                className={`group relative h-full rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
                  feature.highlight
                    ? "border-primary/20 bg-card shadow-sm"
                    : "border-border bg-card/60 hover:bg-card"
                }`}
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    feature.highlight
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
