import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type LegalHeroProps = {
  hero: SiteContent["privacyPolicy"]["hero"];
};

export function LegalHero({ hero }: LegalHeroProps) {
  return (
    <section className="relative overflow-hidden pb-2 pt-12 sm:pt-16 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(102,252,241,0.14),transparent_44%),radial-gradient(circle_at_84%_4%,rgba(39,104,100,0.22),transparent_41%)]" />
      <Container className="relative z-10 max-w-4xl">
        <AnimatedSection className="rounded-[2rem] border border-[#2a4048] bg-[linear-gradient(145deg,rgba(13,20,26,0.96),rgba(11,12,16,0.94))] px-6 py-10 text-center shadow-[0_0_50px_-34px_rgba(102,252,241,0.55)] sm:px-10 sm:py-12">
          <span className="inline-flex rounded-full border border-[#66fcf1]/40 bg-[#66fcf1]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">
            {hero.badge}
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#c6c6c6] sm:text-xl">
            {hero.paragraph}
          </p>
        </AnimatedSection>
      </Container>
    </section>
  );
}
