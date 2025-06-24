import { RedirectToast } from "@/components/payments/redirect-toast"
import { Footer } from "../../../components/footer"
import { HeaderWrapper } from "../../../components/header-wrapper"
import { ScrollIndicator } from "../../../components/scroll-indicator"
import { SiteBanner } from "../../../components/site-banner"
import { StickyCTA } from "../../../components/sticky-cta"
import { Suspense } from "react"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteBanner />
      <HeaderWrapper />
      {children}
      <Footer />
      <StickyCTA />
      <ScrollIndicator />
      <Suspense fallback={null}>
        <RedirectToast />
      </Suspense>
    </>
  )
}
