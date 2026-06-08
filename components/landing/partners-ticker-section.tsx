import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { LogoTicker } from "@/components/landing/logo-ticker";
import type { SiteContent } from "@/lib/site-content-schema";

type PartnersTickerSectionProps = {
  section: SiteContent["landing"]["partnersSection"];
};

export function PartnersTickerSection({ section }: PartnersTickerSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="partners" className="content-visibility-auto scroll-mt-24 pb-18 sm:pb-24">
      <Container>
        <AnimatedSection className="brand-card p-5 sm:p-6">
          <span className="brand-rule mb-4" />
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#dadada] sm:text-base">{section.subtitle}</p>
          <div className="mt-5">
            <LogoTicker
              logos={section.logos}
              direction={section.tickerDirection}
              speed={section.tickerSpeed}
              pauseOnHover={section.pauseOnHover}
            />
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
