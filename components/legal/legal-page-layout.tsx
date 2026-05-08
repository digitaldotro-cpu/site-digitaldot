import { LegalHero } from "@/components/legal/legal-hero";
import { LegalSection } from "@/components/legal/legal-section";
import { LegalTableOfContents } from "@/components/legal/legal-table-of-contents";
import { LegalContactCard } from "@/components/legal/legal-contact-card";
import { LegalCTA } from "@/components/legal/legal-cta";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { LegalPageContent } from "@/lib/site-content-schema";

type LegalPageLayoutProps = {
  page: LegalPageContent;
};

export function LegalPageLayout({ page }: LegalPageLayoutProps) {
  const visibleSections = page.legalContent.sections.filter((section) => section.enabled);

  return (
    <>
      <LegalHero hero={page.hero} />

      <section className="py-6 sm:py-8">
        <Container className="max-w-4xl">
          <AnimatedSection>
            <div className="inline-flex items-center rounded-2xl border border-[#2b4049] bg-[#10181d]/90 px-5 py-3 text-sm text-[#c6c6c6] backdrop-blur-sm">
              <span className="font-semibold text-white">Ultima actualizare:</span>
              <span className="ml-2">{page.settings.lastUpdated}</span>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="pb-8 pt-2 sm:pb-12">
        <Container className="max-w-6xl">
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,2.35fr)_minmax(250px,0.9fr)] lg:gap-10">
            <div className="space-y-5 sm:space-y-6">
              {visibleSections.map((section, index) => (
                <LegalSection key={section.id} section={section} index={index} />
              ))}
            </div>

            {page.legalContent.showTableOfContents ? (
              <LegalTableOfContents title={page.legalContent.title} sections={visibleSections} />
            ) : null}
          </div>
        </Container>
      </section>

      <LegalContactCard contactCard={page.contactCard} />
      <LegalCTA finalCta={page.finalCta} />
    </>
  );
}
