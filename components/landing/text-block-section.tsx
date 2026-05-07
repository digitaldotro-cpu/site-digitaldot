import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { HighlightText } from "@/components/landing/highlight-text";
import type { SiteContent } from "@/lib/site-content-schema";

type LongFormSection = SiteContent["landing"]["positioning"] | SiteContent["landing"]["authority"];

type TextBlockSectionProps = {
  id: string;
  section: LongFormSection;
};

export function TextBlockSection({ id, section }: TextBlockSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id={id} className="scroll-mt-24 py-18 sm:py-24">
      <Container className="max-w-5xl">
        <AnimatedSection>
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
        </AnimatedSection>

        <div className="mt-10 space-y-6">
          {section.entries.map((entry, index) => (
            <AnimatedSection key={entry.id} delay={index * 0.04}>
              <HighlightText text={entry.text} highlight={entry.highlight} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
