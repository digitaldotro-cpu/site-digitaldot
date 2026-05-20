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
    <section id="process" className="scroll-mt-24 border-y border-[#17242a] bg-[#0d1115] py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
              {section.subtitle}
            </p>
          ) : null}
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {section.steps.map((step, index) => (
            <AnimatedSection
              key={step.id}
              delay={index * 0.06}
              className="relative rounded-3xl border border-[#2a3e42] bg-[#101418]/88 p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#66fcf1]/35 bg-[#66fcf1]/8 text-sm font-semibold text-[#66fcf1]">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{step.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
