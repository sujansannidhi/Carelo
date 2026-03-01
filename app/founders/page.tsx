"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimateOnScroll } from "@/components/animate-on-scroll"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"

const founders = [
  {
    name: "Sujan Sannidhi",
    role: "Founder",
    bio: "Passionate about leveraging technology to improve elderly care. Sujan founded Carelo with a vision to create a family ecosystem that empowers caregivers and keeps elderly loved ones safe, healthy, and connected.",
  },
  {
    name: "Aarthi Padavala",
    role: "Co-Founder",
    bio: "Driven by a deep commitment to accessible healthcare, Aarthi brings expertise in product design and user experience. She ensures Carelo's interfaces are intuitive for both caregivers and elderly users.",
  },
]

export default function FoundersPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Meet the Founders
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              The people behind Carelo — building a future where caring for elderly loved ones doesn't mean sacrificing your own well-being.
            </p>
          </AnimateOnScroll>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {founders.map((founder, i) => (
              <AnimateOnScroll key={founder.name} delay={i * 150}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {founder.role}
                    </CardDescription>
                    <CardTitle className="text-2xl">{founder.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {founder.bio}
                    </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
