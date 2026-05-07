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
        <AnimatedSection>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{section.title}</h2>
        </AnimatedSection>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AnimatedSection className="rounded-3xl border border-[#2d5a57] bg-[#10201f] p-7">
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

          <AnimatedSection className="rounded-3xl border border-[#4a2b31] bg-[#1c1316] p-7" delay={0.06}>
            <h3 className="text-xl font-semibold text-[#ffb8c2]">{section.notForTitle}</h3>
            <ul className="mt-4 space-y-3">
              {section.notFor.map((item) => (
                <li key={item.id} className="flex items-start gap-3 text-[#f4d8dd]">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9eaf]" />
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
