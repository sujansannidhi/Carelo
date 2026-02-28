import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { EdgeSection } from "@/components/edge-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <EdgeSection />
      <CTASection />
      <Footer />
    </main>
  )
}
