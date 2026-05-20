import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type PortfolioExamplesSectionProps = {
  section: SiteContent["landing"]["portfolioExamples"];
};

export function PortfolioExamplesSection({ section }: PortfolioExamplesSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="portfolio" className="scroll-mt-24 py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {section.subtitle}
          </p>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {section.examples.map((example, index) => (
            <AnimatedSection
              key={example.id}
              delay={index * 0.05}
              className="group rounded-3xl border border-[#2a3e42] bg-[#101418]/82 p-6 transition duration-300 hover:border-[#66fcf1]/45 hover:shadow-[0_0_34px_-20px_rgba(102,252,241,0.85)]"
            >
              <article className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-white">{example.businessType}</h3>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#66fcf1]/30 bg-[#66fcf1]/8 text-[#66fcf1]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <dl className="mt-6 grid gap-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">Problemă</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{example.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">Intervenție</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{example.intervention}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">Rezultat</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-[#e8fffd] sm:text-base">{example.result}</dd>
                  </div>
                </dl>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
