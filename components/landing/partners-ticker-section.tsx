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
    <section id="partners" className="scroll-mt-24 pb-18 sm:pb-24">
      <Container>
        <AnimatedSection className="rounded-3xl border border-[#276864]/40 bg-[#0f1418]/80 p-5 backdrop-blur-sm sm:p-6">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{section.subtitle}</p>
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

      <style jsx global>{`
        .partner-ticker {
          overflow: hidden;
          width: 100%;
        }
        .partner-ticker-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation-name: partner-ticker-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .partner-ticker.is-paused-on-hover:hover .partner-ticker-track {
          animation-play-state: paused;
        }
        @keyframes partner-ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
