import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content-schema";

type CTASectionProps = {
  section: SiteContent["landing"]["primaryCta"];
};

export function CTASection({ section }: CTASectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="cta" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection className="rounded-[2rem] border border-[#66fcf1]/35 bg-[linear-gradient(145deg,rgba(16,24,28,0.95),rgba(11,12,16,0.98))] p-8 text-center sm:p-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{section.headline}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#c6c6c6]">{section.supportText}</p>
          <ButtonLink href={section.buttonLink} size="lg" className="group mt-8 h-14 px-10 text-base uppercase tracking-[0.08em]">
            {section.buttonText}
            <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </AnimatedSection>
      </Container>
    </section>
  );
}
