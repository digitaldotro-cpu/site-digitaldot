import Image from "next/image";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/site-content-schema";

type StrategySectionProps = {
  section: SiteContent["landing"]["strategySection"];
};

export function StrategySection({ section }: StrategySectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="strategy-section" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection className="relative overflow-hidden rounded-[2rem] border border-[#276864]/50 bg-[#0b0c10]">
          <div className="relative h-[420px] sm:h-[520px] lg:h-[620px]" style={{ paddingBottom: `${section.paddingBottom}px` }}>
            <Image
              src={section.image}
              alt="Ușa strategică Digital Dot"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div
              className={cn(
                "absolute inset-x-0 top-0 z-10 h-full px-6 py-10 sm:px-10 sm:py-14",
                section.textAlignment === "center" ? "flex items-center justify-center text-center" : "flex items-center",
              )}
            >
              <div className={cn("max-w-4xl", section.textAlignment === "left" && "text-left")}>
                <p className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">{section.text}</p>
              </div>
            </div>
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: `linear-gradient(180deg, rgba(0,0,0,${Math.max(section.overlayIntensity / 100, 0.25)}) 0%, rgba(0,0,0,${Math.max((section.overlayIntensity / 100) * 0.9, 0.2)}) 100%)`,
              }}
            />
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_78%_28%,rgba(39,104,100,0.12),transparent_35%)]" />
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
