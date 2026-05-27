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
    <section id="process" className="scroll-mt-24 border-y border-[#1f2a2d] bg-[#101418] py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <div className="mb-4 h-0.5 w-16 bg-[#d8c7a3]" />
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
              {section.subtitle}
            </p>
          ) : null}
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {section.steps.map((step, index) => (
            <AnimatedSection
              key={step.id}
              delay={index * 0.06}
              className="relative rounded-xl border border-[#1f2a2d] bg-[#0b0c10]/70 p-6 transition duration-300 hover:border-[#276864]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#276864]/60 bg-[#101418] text-sm font-semibold text-[#66fcf1]">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#dadada] sm:text-base">{step.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
