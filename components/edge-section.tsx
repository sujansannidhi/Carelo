import Image from "next/image"
import { Check } from "lucide-react"
import { AnimateOnScroll } from "@/components/animate-on-scroll"

const benefits = [
  "Transforms raw health data into a single clarity score",
  "Actionable insights, not just numbers",
  "Real-time alerts when something needs attention",
  "Designed for families, not hospitals",
]

export function EdgeSection() {
  return (
    <section id="edge" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Image mockup */}
          <AnimateOnScroll className="relative flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <Image
                src="/images/peace-of-mind-screen.jpg"
                alt="Peace of Mind Score showing a 92 out of 100 health score with medication, activity, and weight status indicators"
                width={450}
                height={450}
                className="relative rounded-2xl shadow-xl shadow-primary/10"
              />
            </div>
          </AnimateOnScroll>

          {/* Right: Text */}
          <AnimateOnScroll delay={150} className="flex flex-col gap-6">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Competitive Edge
            </span>
            <h2
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More Than Monitoring. Real Peace of Mind.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              CultivAid transforms raw health data into simple, actionable insights — giving caregivers clarity, not just numbers. Our Peace of Mind Score distills everything into one number you can trust.
            </p>

            <ul className="flex flex-col gap-3 pt-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
