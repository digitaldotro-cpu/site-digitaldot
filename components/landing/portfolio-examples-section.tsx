import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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
            return (
              <AnimatedSection
                key={study.slug}
                delay={index * 0.05}
                className={visibleStudies.length === 1 ? "col-span-2 lg:col-span-2" : ""}
              >
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group block h-full rounded-[18px] border border-[#276864]/35 bg-[#101418] p-2.5 transition-colors hover:border-[#276864] sm:p-5 lg:p-6"
                >
                  <article className="flex h-full flex-col justify-between gap-4 sm:gap-6">
                    <div className="flex min-w-0 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div>
                            <p className="inline-flex rounded-full border border-[#276864]/35 bg-[#1f2a2d] px-2 py-1 text-[0.5rem] font-semibold uppercase leading-none tracking-[0.1em] text-[#d8c7a3] sm:px-3 sm:text-[0.66rem] sm:tracking-[0.14em]">
                              0{index + 1}
                            </p>
                            <h3 className="mt-3 text-base font-semibold leading-tight text-white sm:text-xl lg:text-2xl">{study.clientName}</h3>
                          </div>
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(218,218,218,0.16)] bg-[#1f2a2d] text-[#dadada] transition-colors group-hover:border-[#276864] group-hover:bg-[#276864] group-hover:text-[#d8c7a3] sm:h-10 sm:w-10">
                            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-[0.55rem] font-semibold uppercase leading-snug tracking-[0.08em] text-[#d8c7a3] sm:line-clamp-none sm:text-xs sm:tracking-[0.14em]">
                          {study.category}
                        </p>
                        <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-[#dadada] sm:mt-4 sm:line-clamp-4 sm:text-sm lg:text-base">{study.excerpt}</p>
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
                        {study.cardMetrics.map((metric, metricIndex) => (
                          <div key={`${metric.value}-${metric.label}`} className={metricIndex > 3 ? "hidden rounded-lg border border-[#1f2a2d] bg-[#0b0c10]/72 p-2 sm:block sm:p-3" : "rounded-lg border border-[#1f2a2d] bg-[#0b0c10]/72 p-2 sm:p-3"}>
                            <dt className="text-sm font-semibold leading-tight text-white sm:text-lg lg:text-xl">{metric.value}</dt>
                            <dd className="mt-1 line-clamp-2 text-[0.58rem] leading-snug text-[#dadada] sm:text-xs sm:leading-relaxed">{metric.label}</dd>
                          </div>
                        ))}
                      </dl>

                      <span className="case-study-button mt-4 inline-flex w-fit items-center whitespace-nowrap rounded-full border border-[rgba(218,218,218,0.16)] bg-[#1f2a2d] px-2.5 py-2 text-[0.72rem] font-semibold leading-none text-[#dadada] transition-colors group-hover:border-[#276864] group-hover:bg-[#276864] group-hover:text-[#d8c7a3] sm:mt-6 sm:px-3 sm:text-sm sm:leading-normal">
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
