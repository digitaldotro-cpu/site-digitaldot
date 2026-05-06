import Image from "next/image";
import type { ComponentType } from "react";
import { Globe, Camera, Building2, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CTAButton } from "@/components/landing/cta-button";
import type { SiteContent } from "@/lib/site-content-schema";

type InstagramPortfolioSectionProps = {
  section: SiteContent["landing"]["instagramPortfolio"];
};

const iconByName: Record<string, ComponentType<{ className?: string }>> = {
  Instagram: Camera,
  Linkedin: Building2,
  Facebook: MessageCircle,
};

export function InstagramPortfolioSection({ section }: InstagramPortfolioSectionProps) {
  if (!section.enabled) {
    return null;
  }
  const Icon = section.icon ? iconByName[section.icon] ?? Globe : Camera;

  return (
    <section id="instagram-portfolio" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection className="relative overflow-hidden rounded-[2rem] border border-[#276864]/60 bg-[linear-gradient(150deg,rgba(11,12,16,0.96),rgba(14,28,30,0.92))] p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#66fcf1]/10 blur-3xl" />
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#66fcf1]/35 bg-[#66fcf1]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">
                <Icon className="h-4 w-4" />
                {section.icon ?? "Instagram"}
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">{section.description}</p>
              <CTAButton label={section.ctaLabel} href={section.ctaUrl} external className="mt-7" />
            </div>

            {section.media ? (
              <div className="relative overflow-hidden rounded-3xl border border-[#66fcf1]/30">
                <Image src={section.media} alt={section.title} width={1200} height={900} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/78 to-transparent" />
              </div>
            ) : null}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
