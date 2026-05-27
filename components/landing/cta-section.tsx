import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content-schema";

type CTASectionProps = {
  id?: string;
  section: SiteContent["landing"]["primaryCta"] | SiteContent["landing"]["proofCta"];
};

export function CTASection({ id = "cta", section }: CTASectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id={id} className="py-14 sm:py-20">
      <Container>
        <AnimatedSection className="brand-panel p-8 text-center sm:p-12">
          <span className="brand-rule mx-auto mb-6" />
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{section.headline}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#dadada]">{section.supportText}</p>
          <ButtonLink href={section.buttonLink} size="lg" className="group mt-8 h-14 px-10 text-base uppercase tracking-[0.08em]">
            {section.buttonText}
            <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </AnimatedSection>
      </Container>
    </section>
  );
}
