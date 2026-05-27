import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
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
    <section id="hero" className="brand-orbit relative overflow-hidden scroll-mt-24 pt-10 sm:pt-14 lg:pt-16">
      {section.imageVisibility && useBackgroundMode ? (
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <Image
            src={section.image}
            alt="Digital Dot hero visual"
            fill
            className="object-cover object-right"
            sizes="(max-width: 1024px) 100vw, 100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(11,12,16,${overlayOpacity}) 0%, rgba(11,12,16,${Math.max(overlayOpacity * 0.88, 0.44)}) 50%, rgba(11,12,16,0.36) 100%)`,
            }}
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_34%,rgba(39,104,100,0.16),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(216,199,163,0.055),transparent_28%)]" />

      <Container className="relative z-10 pb-8 pt-8 sm:pb-10 sm:pt-10 lg:pb-14 lg:pt-10">
        <div
          className={cn(
            "items-start lg:min-h-[calc(100vh-8rem)] lg:items-center",
            useBackgroundMode ? "flex" : "grid gap-10 lg:grid-cols-12 lg:gap-12",
          )}
        >
          <div
            className={cn(
              "order-1 space-y-8",
              useBackgroundMode ? "max-w-3xl" : "lg:col-span-6",
              section.imageVisibility && section.imagePosition === "left" ? "lg:order-2" : "lg:order-1",
            )}
          >
            <span className="inline-flex rounded-full border border-[#276864]/60 bg-[#101418]/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#d8c7a3]">
              {section.badge}
            </span>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-white sm:text-5xl md:text-6xl">
              {selectedHeadline}
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-[#dadada] sm:text-xl">{section.subheadline}</p>

            <div className="space-y-2 border-l border-[#d8c7a3]/45 pl-5 text-base text-[#dadada]">
              {section.supportingPoints.map((point) => (
                <p key={point}>{point}</p>
              ))}
            </div>

            <ButtonLink href={section.ctaLink} size="lg" className="group mt-2 h-14 px-9 text-base uppercase tracking-[0.1em]">
              {section.ctaText}
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
          </div>

          {section.imageVisibility && !useBackgroundMode ? (
            <div
              className={cn(
                "order-2 lg:col-span-6",
                section.imagePosition === "left" ? "lg:order-1" : "lg:order-2",
              )}
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#1f2a2d] bg-[#0b0c10] shadow-[0_24px_80px_-60px_rgba(102,252,241,0.6)]">
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
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
