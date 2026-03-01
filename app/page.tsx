import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AppShowcase } from "@/components/app-showcase"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { EdgeSection } from "@/components/edge-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <FloatingIcons />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <AppShowcase />
        <ProblemSection />
        <SolutionSection />
        <EdgeSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
