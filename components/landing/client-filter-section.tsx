import { CheckCircle2, XCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type ClientFilterSectionProps = {
  section: SiteContent["landing"]["clientFilter"];
};

export function ClientFilterSection({ section }: ClientFilterSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="clients" className="scroll-mt-24 py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <div className="mb-4 h-0.5 w-16 bg-[#d8c7a3]" />
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
              {section.subtitle}
            </p>
          ) : null}
          {section.introText ? (
            <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#dadada] sm:text-lg">
              {section.introText}
            </p>
          ) : null}
        </AnimatedSection>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AnimatedSection className="rounded-xl border border-[#276864]/55 bg-[linear-gradient(150deg,rgba(16,20,24,0.96),rgba(11,12,16,0.99))] p-7">
            <h3 className="text-xl font-semibold text-[#66fcf1]">{section.worksWithTitle}</h3>
            <ul className="mt-4 space-y-3">
              {section.worksWith.map((item) => (
                <li key={item.id} className="flex items-start gap-3 text-[#e5f3f2]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#66fcf1]" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection className="rounded-xl border border-[#1f2a2d] bg-[#101418]/88 p-7" delay={0.06}>
            <h3 className="text-xl font-semibold text-white">{section.notForTitle}</h3>
            <ul className="mt-4 space-y-3">
              {section.notFor.map((item) => (
                <li key={item.id} className="flex items-start gap-3 text-[#d5dddd]">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#c6c6c6]" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
