import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";
import { RichTextRenderer } from "@/components/legal/rich-text-renderer";

type LegalSectionProps = {
  section: SiteContent["privacyPolicy"]["legalContent"]["sections"][number];
  index: number;
};

export function LegalSection({ section, index }: LegalSectionProps) {
  return (
    <AnimatedSection
      delay={index * 0.03}
      className="rounded-[1.75rem] border border-[#233640] bg-[linear-gradient(155deg,rgba(16,23,30,0.92),rgba(10,13,18,0.96))] p-6 sm:p-8"
    >
      <article id={section.id} className="scroll-mt-28" aria-labelledby={`${section.id}-title`}>
        <h2 id={`${section.id}-title`} className="text-2xl font-semibold leading-tight text-white sm:text-[1.8rem]">
          {section.title}
        </h2>
        <div className="mt-5">
          <RichTextRenderer content={section.body} />
        </div>
      </article>
    </AnimatedSection>
  );
}
