import Image from "next/image";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type VisualBreakSectionProps = {
  section: SiteContent["landing"]["visualBreak"];
};

export function VisualBreakSection({ section }: VisualBreakSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="visual-break" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection className="relative overflow-hidden rounded-[2rem] border border-[#2d4d4a]">
          <div className="relative aspect-[16/9] w-full">
            <Image src={section.image} alt="Visual break" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/85 via-[#0b0c10]/35 to-transparent" />
            <p className="absolute bottom-6 left-6 max-w-2xl text-xl leading-tight text-white sm:bottom-8 sm:left-8 sm:text-2xl">
              {section.overlayText}
            </p>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
