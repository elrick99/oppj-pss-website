import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { StatsBand } from "@/components/home/stats-band"
import { AnnoncesSection } from "@/components/home/annonces-section"
import { ObjectivesSection } from "@/components/home/objectives-section"
import { BureauSection } from "@/components/home/bureau-section"
import { MouvementsSection } from "@/components/home/mouvements-section"
import { ActivitiesSection } from "@/components/home/activities-section"
import { ContactSection } from "@/components/home/contact-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroCarousel />
      <StatsBand />
      <ObjectivesSection />
      <BureauSection />
      <MouvementsSection />
      <ActivitiesSection />
      <AnnoncesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
