import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type ProofMetricsSectionProps = {
  section: SiteContent["landing"]["proofMetrics"];
};

export function ProofMetricsSection({ section }: ProofMetricsSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="proof" className="scroll-mt-24 border-y border-[#1f2a2d] bg-[#101418] py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <div className="mb-4 h-0.5 w-16 bg-[#d8c7a3]" />
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
            {section.subtitle}
          </p>
        </AnimatedSection>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {section.metrics.map((metric, index) => (
            <AnimatedSection
              key={metric.id}
              delay={index * 0.04}
              className="rounded-xl border border-[#1f2a2d] bg-[linear-gradient(160deg,rgba(16,20,24,0.94),rgba(11,12,16,0.98))] p-6 shadow-[0_22px_60px_-52px_rgba(39,104,100,0.55)] transition duration-300 hover:border-[#276864]"
            >
              <p className="text-2xl font-semibold leading-tight text-[#d8c7a3] sm:text-3xl">{metric.value}</p>
              {metric.description ? (
                <p className="mt-3 text-sm leading-relaxed text-[#dadada]">{metric.description}</p>
              ) : null}
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
