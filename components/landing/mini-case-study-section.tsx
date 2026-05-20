import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type MiniCaseStudySectionProps = {
  section: SiteContent["landing"]["miniCaseStudy"];
};

export function MiniCaseStudySection({ section }: MiniCaseStudySectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="case-study" className="scroll-mt-24 py-18 sm:py-24">
      <Container>
        <AnimatedSection className="overflow-hidden rounded-[2rem] border border-[#2b454a] bg-[linear-gradient(145deg,rgba(16,23,28,0.95),rgba(8,11,14,0.98))] p-7 sm:p-9 lg:p-11">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <span className="inline-flex rounded-full border border-[#66fcf1]/28 bg-[#66fcf1]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                Proof layer
              </span>
              <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {section.title}
              </h2>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#26383f] bg-[#0d1317]/85 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  {section.clientLabel}
                </p>
                <p className="mt-2 text-lg text-white">{section.clientValue}</p>
              </div>

              <div className="rounded-3xl border border-[#26383f] bg-[#0d1317]/85 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  {section.problemLabel}
                </p>
                <p className="mt-2 text-base leading-relaxed text-[#c6c6c6]">{section.problem}</p>
              </div>

              <div className="rounded-3xl border border-[#26383f] bg-[#0d1317]/85 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  {section.interventionLabel}
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {section.intervention.map((item) => (
                    <li key={item.id} className="flex items-start gap-3 text-sm leading-relaxed text-[#d7e3e2]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#66fcf1]" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-[#66fcf1]/30 bg-[#66fcf1]/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  {section.resultLabel}
                </p>
                <p className="mt-2 text-base leading-relaxed text-[#e9fffd]">{section.result}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
