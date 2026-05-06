import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { HeroSection } from "@/components/landing/hero-section";
import { TextBlockSection } from "@/components/landing/text-block-section";
import { ServicesGrid } from "@/components/landing/services-grid";
import { InstagramPortfolioSection } from "@/components/landing/instagram-portfolio-section";
import { StrategySection } from "@/components/landing/strategy-section";
import { TeamSection } from "@/components/landing/team-section";
import { ProcessSteps } from "@/components/landing/process-steps";
import { ClientFilterSection } from "@/components/landing/client-filter-section";
import { CTASection } from "@/components/landing/cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import type { LandingSectionKey } from "@/lib/site-content-schema";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return buildMetadata({
    title: content.landing.seoTitle,
    description: content.landing.seoDescription,
    path: "/",
  });
}

export default async function HomePage() {
  const content = await getSiteContent();
  const landing = content.landing;

  const sections: Record<LandingSectionKey, ReactNode> = {
    hero: <HeroSection section={landing.hero} />,
    positioning: <TextBlockSection id="positioning" section={landing.positioning} />,
    authority: <TextBlockSection id="authority" section={landing.authority} />,
    services: <ServicesGrid section={landing.services} />,
    instagramSection: <InstagramPortfolioSection section={landing.instagramSection} />,
    strategySection: <StrategySection section={landing.strategySection} />,
    teamSection: <TeamSection section={landing.teamSection} />,
    process: <ProcessSteps section={landing.process} />,
    clientFilter: <ClientFilterSection section={landing.clientFilter} />,
    primaryCta: <CTASection section={landing.primaryCta} />,
    contact: <ContactSection section={landing.contact} global={content.global} />,
    footer: null,
  };

  return <>{landing.sectionOrder.map((key) => <div key={key}>{sections[key]}</div>)}</>;
}
