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
    <section id="proof" className="scroll-mt-24 border-y border-[#17242a] bg-[#0d1115] py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {section.subtitle}
          </p>
        </AnimatedSection>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {section.metrics.map((metric, index) => (
            <AnimatedSection
              key={metric.id}
              delay={index * 0.04}
              className="rounded-3xl border border-[#276864]/42 bg-[linear-gradient(160deg,rgba(17,25,29,0.94),rgba(10,12,16,0.98))] p-6 shadow-[0_22px_60px_-44px_rgba(102,252,241,0.55)]"
            >
              <p className="text-2xl font-semibold leading-tight text-[#66fcf1] sm:text-3xl">{metric.value}</p>
              {metric.description ? (
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{metric.description}</p>
              ) : null}
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
