import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
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
  const hasMultipleStudies = visibleStudies.length > 1;
  const gridClassName = `mt-10 grid gap-5 md:grid-cols-2 ${visibleStudies.length > 2 ? "xl:grid-cols-3" : ""}`;

  return (
    <section id="portfolio" className="scroll-mt-24 py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {section.subtitle}
          </p>
        </AnimatedSection>

        <div className={gridClassName}>
          {visibleStudies.map((study, index) => (
            <AnimatedSection
              key={study.slug}
              delay={index * 0.05}
              className={visibleStudies.length === 1 ? "md:col-span-2 xl:col-span-2" : ""}
            >
              <Link
                href={`/case-studies/${study.slug}`}
                className="group block h-full rounded-3xl border border-[#2a3e42] bg-[linear-gradient(150deg,rgba(16,20,24,0.92),rgba(10,13,16,0.98))] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#66fcf1]/45 hover:shadow-[0_0_34px_-20px_rgba(102,252,241,0.85)]"
              >
                <article className={hasMultipleStudies ? "flex h-full flex-col gap-7" : "grid h-full gap-7 lg:grid-cols-[0.82fr_1.18fr]"}>
                  <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-[1.4rem] border border-[#276864]/40 bg-[#c6c6c6] p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(102,252,241,0.08),transparent_50%)]" />
                    <Image
                      src={study.heroImage}
                      alt={`${study.clientName} case study`}
                      width={360}
                      height={180}
                      className="relative max-h-32 w-auto max-w-full object-contain"
                      style={study.imageScale ? { transform: `scale(${study.imageScale})` } : undefined}
                    />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                            {study.category}
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold text-white">{study.clientName}</h3>
                        </div>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#66fcf1]/30 bg-[#66fcf1]/8 text-[#66fcf1]">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{study.excerpt}</p>
                    </div>

                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      {study.cardMetrics.map((metric) => (
                        <div key={`${metric.value}-${metric.label}`} className="rounded-2xl border border-[#263740] bg-[#0d1317] p-4">
                          <dt className="text-xl font-semibold text-[#66fcf1]">{metric.value}</dt>
                          <dd className="mt-1 text-xs leading-relaxed text-[#c6c6c6]">{metric.label}</dd>
                        </div>
                      ))}
                    </dl>

                    <span className="mt-6 inline-flex items-center text-sm font-semibold text-[#66fcf1]">
                      Vezi studiul de caz
                    <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
