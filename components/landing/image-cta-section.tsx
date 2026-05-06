import Image from "next/image";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type ImageCtaSectionProps = {
  id: string;
  section: SiteContent["landing"]["brandValueSection"];
};

export function ImageCtaSection({ id, section }: ImageCtaSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id={id} className="py-18 sm:py-24">
      <Container className="max-w-5xl">
        <AnimatedSection>
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.heading}</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.04}>
          <a
            href={section.imageLink}
            target={section.openInNewTab ? "_blank" : undefined}
            rel={section.openInNewTab ? "noopener noreferrer" : undefined}
            aria-label={section.ariaLabel}
            className={cn(
              "group mt-10 block rounded-3xl border border-[#276864]/40 bg-[#0f1418]/80 p-3 backdrop-blur-sm transition duration-300 hover:border-[#66fcf1]/55 sm:p-4",
              section.hoverGlow ? "hover:shadow-[0_0_30px_-18px_rgba(102,252,241,0.85)]" : "",
            )}
          >
            <Image
              src={section.image}
              alt={section.imageAlt}
              width={2048}
              height={2560}
              className="w-full rounded-2xl object-contain transition duration-500 group-hover:scale-[1.01]"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </a>
        </AnimatedSection>
      </Container>
    </section>
  );
}

