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
  const gridClassName = "mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6";

  return (
    <section id="case-studies" className="brand-orbit relative scroll-mt-24 overflow-hidden border-y border-[#1f2a2d] bg-[#0b0c10] py-18 sm:py-24">
      <span id="portfolio" className="absolute -top-24" aria-hidden />
      <Container className="relative z-10">
        <AnimatedSection className="max-w-4xl">
          <span className="brand-rule mb-5" />
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
                  className="brand-card group block h-full p-2.5 sm:p-5 lg:p-6"
                >
                  <article className={hasMultipleStudies ? "flex h-full flex-col gap-4 sm:gap-6" : "grid h-full gap-4 sm:gap-6 lg:grid-cols-[0.82fr_1.18fr]"}>
                    <div className="relative flex aspect-[1.18/1] min-h-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#1f2a2d] bg-[#f3f1ea] p-3 sm:aspect-[4/3] sm:min-h-40 sm:p-6 lg:min-h-48 lg:p-8">
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
                            <p className="line-clamp-2 text-[0.58rem] font-semibold uppercase leading-snug tracking-[0.12em] text-[#d8c7a3] sm:text-xs sm:tracking-[0.16em]">
                              0{index + 1} · {study.category}
                            </p>
                            <h3 className="mt-2 text-base font-semibold leading-tight text-white sm:mt-3 sm:text-xl lg:text-2xl">{study.clientName}</h3>
                          </div>
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#276864]/55 bg-[#0b0c10] text-[#d8c7a3] transition-colors group-hover:border-[#276864]/45 sm:h-10 sm:w-10">
                            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#dadada] sm:mt-4 sm:line-clamp-3 sm:text-sm lg:text-base">{study.excerpt}</p>
                      </div>

                      <dl className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                        {study.cardMetrics.map((metric, metricIndex) => (
                          <div key={`${metric.value}-${metric.label}`} className={metricIndex > 1 ? "hidden rounded-lg border border-[#1f2a2d] bg-[#0b0c10]/70 p-2.5 sm:block sm:p-4" : "rounded-lg border border-[#1f2a2d] bg-[#0b0c10]/70 p-2.5 sm:p-4"}>
                            <dt className="text-base font-semibold text-white sm:text-xl">{metric.value}</dt>
                            <dd className="mt-1 line-clamp-2 text-[0.68rem] leading-snug text-[#dadada] sm:text-xs sm:leading-relaxed">{metric.label}</dd>
                          </div>
                        ))}
                      </dl>

                      <span className="mt-4 inline-flex w-fit items-center rounded-full border border-[#276864] bg-[#276864] px-3 py-2 text-xs font-semibold text-[#d8c7a3] sm:mt-6 sm:text-sm">
                        Vezi studiul de caz
                        <ArrowUpRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
