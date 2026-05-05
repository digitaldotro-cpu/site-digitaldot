import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content-schema";

type HeroSectionProps = {
  section: SiteContent["landing"]["hero"];
};

export function HeroSection({ section }: HeroSectionProps) {
  if (!section.enabled) {
    return null;
  }

  const selectedHeadline =
    section.headlineVariants[section.activeHeadlineIndex] ?? section.headlineVariants[0];

  return (
    <section id="hero" className="relative overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(102,252,241,0.16),transparent_42%),radial-gradient(circle_at_82%_12%,rgba(39,104,100,0.28),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <Image src={section.backgroundImage} alt="Digital Dot hero visual" fill priority className="object-cover object-right" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/88 to-[#0b0c10]/42" />

      <Container className="relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-10 py-14 lg:grid-cols-12">
        <AnimatedSection className="space-y-8 lg:col-span-7">
          <span className="inline-flex rounded-full border border-[#66fcf1]/35 bg-[#66fcf1]/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#66fcf1]">
            {section.badge}
          </span>

          <h1 className="text-4xl font-semibold leading-[1.06] text-white sm:text-5xl md:text-6xl">
            {selectedHeadline}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-[#c6c6c6] sm:text-xl">{section.subheadline}</p>

          <div className="space-y-2 text-base text-[#c6c6c6]">
            {section.supportingPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>

          <ButtonLink href={section.ctaLink} size="lg" className="group mt-2 h-14 px-9 text-base uppercase tracking-[0.1em]">
            {section.ctaText}
            <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
        </AnimatedSection>

        <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
      </Container>
    </section>
  );
}
