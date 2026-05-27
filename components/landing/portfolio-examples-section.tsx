import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type PortfolioExamplesSectionProps = {
  section: SiteContent["landing"]["portfolioExamples"];
  studies: SiteContent["caseStudies"]["studies"];
};

export function PortfolioExamplesSection({ section, studies }: PortfolioExamplesSectionProps) {
  if (!section.enabled) {
    return null;
  }

  const visibleStudies = studies.slice(0, 6);
  const hasMultipleStudies = visibleStudies.length > 1;
  const gridClassName = "mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6";

  return (
    <section id="case-studies" className="brand-orbit relative scroll-mt-24 overflow-hidden border-y border-[#1f2a2d] bg-[#0b0c10] py-18 sm:py-24">
      <span id="portfolio" className="absolute -top-24" aria-hidden />
      <Container className="relative z-10">
        <AnimatedSection className="max-w-4xl">
          <div className="mb-4 h-0.5 w-16 bg-[#d8c7a3]" />
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
            {section.subtitle}
          </p>
        </AnimatedSection>

        <div className={gridClassName}>
          {visibleStudies.map((study, index) => {
            const logoScale = study.imageScale ?? 1;
            const logoStyle = {
              "--case-study-logo-scale": String(logoScale),
              "--case-study-logo-mobile-scale": String(Math.min(logoScale, 1.45)),
            } as CSSProperties;

            return (
              <AnimatedSection
                key={study.slug}
                delay={index * 0.05}
                className={visibleStudies.length === 1 ? "col-span-2 lg:col-span-2" : ""}
              >
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group block h-full rounded-xl border border-[#1f2a2d] bg-[linear-gradient(150deg,rgba(16,20,24,0.96),rgba(11,12,16,0.99))] p-2.5 transition duration-300 hover:-translate-y-1 hover:border-[#276864] hover:shadow-[0_22px_70px_-54px_rgba(102,252,241,0.8)] sm:p-5 lg:p-6"
                >
                  <article className={hasMultipleStudies ? "flex h-full flex-col gap-4 sm:gap-6 lg:gap-7" : "grid h-full gap-4 sm:gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-7"}>
                    <div className="relative flex aspect-[4/3] min-h-0 items-center justify-center overflow-hidden rounded-lg border border-[#1f2a2d] bg-[#ffffff] p-3 sm:min-h-40 sm:p-6 lg:min-h-48 lg:p-8">
                      <Image
                        src={study.heroImage}
                        alt={`${study.clientName} case study`}
                        width={360}
                        height={180}
                        className="relative max-h-20 w-auto max-w-full scale-[var(--case-study-logo-mobile-scale)] object-contain sm:max-h-28 sm:scale-[var(--case-study-logo-scale)] lg:max-h-32"
                        style={logoStyle}
                      />
                    </div>

                    <div className="flex min-w-0 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div>
                            <p className="line-clamp-2 text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.12em] text-[#d8c7a3] sm:text-xs sm:tracking-[0.16em]">
                              {study.category}
                            </p>
                            <h3 className="mt-2 text-base font-semibold leading-tight text-white sm:mt-3 sm:text-xl lg:text-2xl">{study.clientName}</h3>
                          </div>
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#276864]/60 bg-[#101418] text-[#66fcf1] sm:h-10 sm:w-10">
                            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#dadada] sm:mt-4 sm:text-sm lg:text-base">{study.excerpt}</p>
                      </div>

                      <dl className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                        {study.cardMetrics.map((metric) => (
                          <div key={`${metric.value}-${metric.label}`} className="rounded-lg border border-[#1f2a2d] bg-[#0b0c10] p-2.5 sm:p-4">
                            <dt className="text-base font-semibold text-[#66fcf1] sm:text-xl">{metric.value}</dt>
                            <dd className="mt-1 line-clamp-2 text-[0.68rem] leading-snug text-[#dadada] sm:text-xs sm:leading-relaxed">{metric.label}</dd>
                          </div>
                        ))}
                      </dl>

                      <span className="mt-4 inline-flex items-center text-xs font-semibold text-[#66fcf1] sm:mt-6 sm:text-sm">
                        Vezi studiul de caz
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
