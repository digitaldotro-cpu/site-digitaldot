import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type ProcessStepsProps = {
  section: SiteContent["landing"]["process"];
};

export function ProcessSteps({ section }: ProcessStepsProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="process" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{section.title}</h2>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {section.steps.map((step, index) => (
            <AnimatedSection
              key={step.id}
              delay={index * 0.06}
              className="rounded-3xl border border-[#2a3e42] bg-[#101418]/80 p-6"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-[#66fcf1]">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{step.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
