import Image from "next/image";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CTAButton } from "@/components/landing/cta-button";
import type { SiteContent } from "@/lib/site-content-schema";

type InstagramPortfolioSectionProps = {
  section: SiteContent["landing"]["instagramSection"];
};

export function InstagramPortfolioSection({ section }: InstagramPortfolioSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="instagram-portfolio" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection className="overflow-hidden rounded-[2rem] border border-[#276864]/55 bg-[linear-gradient(150deg,rgba(11,12,16,0.96),rgba(10,22,24,0.9))] p-6 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="order-1 lg:col-span-5">
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">{section.description}</p>
            </div>

            <a
              href={section.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group order-2 block lg:col-span-7"
              aria-label={section.ctaText}
            >
              <div className="relative overflow-hidden rounded-3xl border border-[#66fcf1]/35 bg-[#0b0c10] transition duration-300 group-hover:border-[#66fcf1]/65 group-hover:shadow-[0_0_34px_-16px_rgba(102,252,241,0.8)]">
                <div className="relative aspect-[5/4] w-full sm:aspect-[16/10]">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-contain transition duration-500 group-hover:scale-[1.01]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0c10]/32 via-transparent to-transparent" />
                </div>
              </div>
            </a>

            <div className="order-3 lg:col-span-5">
              <CTAButton label={section.ctaText} href={section.ctaLink} external className="w-full justify-center sm:w-auto" />
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
