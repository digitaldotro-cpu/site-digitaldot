import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { buildRouteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { HeroSection } from "@/components/landing/hero-section";
import { PositioningManifestoSection } from "@/components/landing/positioning-manifesto-section";
import { ProofMetricsSection } from "@/components/landing/proof-metrics-section";
import { MiniCaseStudySection } from "@/components/landing/mini-case-study-section";
import { TextBlockSection } from "@/components/landing/text-block-section";
import { ImageCtaSection } from "@/components/landing/image-cta-section";
import { ServicesGrid } from "@/components/landing/services-grid";
import { PortfolioExamplesSection } from "@/components/landing/portfolio-examples-section";
import { InstagramPortfolioSection } from "@/components/landing/instagram-portfolio-section";
import { StrategySection } from "@/components/landing/strategy-section";
import { TeamSection } from "@/components/landing/team-section";
import { ProcessSteps } from "@/components/landing/process-steps";
import { ClientFilterSection } from "@/components/landing/client-filter-section";
import { PartnersTickerSection } from "@/components/landing/partners-ticker-section";
import { CTASection } from "@/components/landing/cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import type { LandingSectionKey } from "@/lib/site-content-schema";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return buildRouteMetadata({
    content,
    path: "/",
    fallbackTitle: content.landing.seoTitle,
    fallbackDescription: content.landing.seoDescription,
  });
}

export default async function HomePage() {
  const content = await getSiteContent();
  const landing = content.landing;

  const sections: Record<LandingSectionKey, ReactNode> = {
    hero: <HeroSection section={landing.hero} />,
    positioning: <PositioningManifestoSection section={landing.positioning} />,
    proofMetrics: <ProofMetricsSection section={landing.proofMetrics} />,
    miniCaseStudy: <MiniCaseStudySection section={landing.miniCaseStudy} />,
    proofCta: <CTASection id="proof-cta" section={landing.proofCta} />,
    authority: <TextBlockSection id="authority" section={landing.authority} />,
    brandValueSection: <ImageCtaSection id="brand-value" section={landing.brandValueSection} />,
    services: <ServicesGrid section={landing.services} />,
    portfolioExamples: <PortfolioExamplesSection section={landing.portfolioExamples} studies={content.caseStudies.studies} />,
    instagramSection: <InstagramPortfolioSection section={landing.instagramSection} />,
    strategySection: <StrategySection section={landing.strategySection} />,
    teamSection: <TeamSection section={landing.teamSection} />,
    process: <ProcessSteps section={landing.process} />,
    clientFilter: <ClientFilterSection section={landing.clientFilter} />,
    partnersSection: <PartnersTickerSection section={landing.partnersSection} />,
    primaryCta: <CTASection section={landing.primaryCta} />,
    contact: <ContactSection section={landing.contact} global={content.global} />,
  };

  return (
    <>
      {landing.sectionOrder.map((key) => (
        <Fragment key={key}>
          {sections[key]}
        </Fragment>
      ))}
    </>
  );
}
