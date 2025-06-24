import { CompaniesSection } from "../../../components/sections/companies-section"
import { CTASection } from "../../../components/sections/cta-section"
import { FAQSection } from "../../../components/sections/faq-section"
import { FeaturesSection } from "../../../components/sections/features-section"
import { HeroSection } from "../../../components/sections/hero-section"
import { PricingSection } from "../../../components/sections/pricing-section"
import { SocialProofSection } from "../../../components/sections/social-proof-section"
import { VideoSection } from "../../../components/sections/video-section"

export default function MarketingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CompaniesSection />
      <VideoSection />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
  )
}
