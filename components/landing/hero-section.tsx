import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  section: SiteContent["landing"]["hero"];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function HeroSection({ section }: HeroSectionProps) {
  if (!section.enabled) {
    return null;
  }

  const selectedHeadline =
    section.headlineVariants[section.activeHeadlineIndex] ?? section.headlineVariants[0];
  const overlayOpacity = clamp(section.overlayIntensity / 100, 0, 1);
  const useBackgroundMode = section.imagePosition === "right";

  return (
    <section id="hero" className="relative overflow-hidden pt-20">
      {section.imageVisibility && useBackgroundMode ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={section.image}
            alt="Digital Dot hero visual"
            fill
            priority
            className="object-cover object-right"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(11,12,16,${overlayOpacity}) 0%, rgba(11,12,16,${Math.max(overlayOpacity * 0.76, 0.3)}) 45%, rgba(11,12,16,0.22) 100%)`,
            }}
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(102,252,241,0.16),transparent_42%),radial-gradient(circle_at_82%_12%,rgba(39,104,100,0.22),transparent_45%)]" />

      <Container className="relative z-10 py-14">
        <div className={cn("min-h-[calc(100vh-8rem)] items-center", useBackgroundMode ? "flex" : "grid gap-10 lg:grid-cols-12 lg:gap-12")}>
          <AnimatedSection
            className={cn(
              "order-1 space-y-8",
              useBackgroundMode ? "max-w-3xl" : "lg:col-span-6",
              section.imageVisibility && section.imagePosition === "left" ? "lg:order-2" : "lg:order-1",
            )}
          >
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

          {section.imageVisibility && !useBackgroundMode ? (
            <AnimatedSection
              className={cn(
                "order-2 lg:col-span-6",
                section.imagePosition === "left" ? "lg:order-1" : "lg:order-2",
              )}
              delay={0.04}
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-[#276864]/45 bg-[#0b0c10] shadow-[0_0_40px_-22px_rgba(102,252,241,0.42)]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={section.image}
                    alt="Digital Dot hero visual"
                    fill
                    priority
                    className="object-cover object-right"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, rgba(11,12,16,${overlayOpacity}) 0%, rgba(11,12,16,0) 64%)`,
                    }}
                  />
                </div>
              </div>
            </AnimatedSection>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
