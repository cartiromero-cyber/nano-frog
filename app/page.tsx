import Script from "next/script";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatIsElytraShield from "@/components/WhatIsElytraShield";
import ProblemSection from "@/components/ProblemSection";
import ElytraShieldDifference from "@/components/ElytraShieldDifference";
import SavingsSection from "@/components/SavingsSection";
import QualifySection from "@/components/QualifySection";
import HowItWorks from "@/components/HowItWorks";
import ScienceBehindProtection from "@/components/ScienceBehindProtection";
import CostComparison from "@/components/CostComparison";
import RoofHealthScore from "@/components/RoofHealthScore";
import PreservationDifference from "@/components/PreservationDifference";
import LearningCenterPreview from "@/components/LearningCenterPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <WhatIsElytraShield />
      <ProblemSection />
      <ElytraShieldDifference />
      <SavingsSection />
      <QualifySection />
      <HowItWorks />
      <ScienceBehindProtection />
      <CostComparison />
      <RoofHealthScore />
      <PreservationDifference />
      <LearningCenterPreview />
      <CTASection />
      <Footer />
      {/* Approved homepage animations/interactions (identical to original), homepage only */}
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
