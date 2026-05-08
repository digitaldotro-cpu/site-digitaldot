import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import type { LegalPageContent } from "@/lib/site-content-schema";

type LegalCtaProps = {
  finalCta: LegalPageContent["finalCta"];
};

export function LegalCTA({ finalCta }: LegalCtaProps) {
  if (!finalCta.enabled) {
    return null;
  }

  return (
    <section className="pb-16 pt-6 sm:pb-20 sm:pt-8">
      <Container className="max-w-5xl">
        <AnimatedSection className="rounded-[2rem] border border-[#2a444d] bg-[linear-gradient(145deg,rgba(15,21,28,0.94),rgba(9,12,16,0.98))] p-8 text-center sm:p-12">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{finalCta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">{finalCta.paragraph}</p>
          <ButtonLink href={finalCta.buttonUrl} className="group mt-8 h-12 px-8 text-sm uppercase tracking-[0.1em]" size="lg">
            {finalCta.buttonLabel}
            <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
        </AnimatedSection>
      </Container>
    </section>
  );
}
