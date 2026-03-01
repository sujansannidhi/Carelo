"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimateOnScroll } from "@/components/animate-on-scroll"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, Linkedin, ArrowLeft } from "lucide-react"
import Link from "next/link"

const founders = [
  {
    name: "Sujan Sannidhi",
    role: "Founder",
    email: "sujan@cultivaid.com",
    phone: "+1 (555) 000-0001",
    linkedin: "https://linkedin.com/in/sujan-sannidhi",
  },
  {
    name: "Aarthi Padavala",
    role: "Co-Founder",
    email: "aarthi@cultivaid.com",
    phone: "+1 (555) 000-0002",
    linkedin: "https://linkedin.com/in/aarthi-padavala",
  },
]

export default function ContactPage() {
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
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Have questions about CultivAid? Want to partner with us or learn more about our mission? Reach out to our founding team.
            </p>
          </AnimateOnScroll>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {founders.map((founder, i) => (
              <AnimateOnScroll key={founder.name} delay={i * 150}>
                <Card className="h-full">
                  <CardHeader>
                    <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {founder.role}
                    </CardDescription>
                    <CardTitle className="text-2xl">{founder.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <a
                      href={`mailto:${founder.email}`}
                      className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {founder.email}
                    </a>
                    <a
                      href={`tel:${founder.phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {founder.phone}
                    </a>
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4 shrink-0" />
                      LinkedIn
                    </a>
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
