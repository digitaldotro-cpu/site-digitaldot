import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { RegionalPageContent, RegionalSeoContent } from "@/lib/site-content-schema";

type RegionalHubPageProps = {
  regional: RegionalSeoContent;
};

type RegionalCityPageProps = {
  page: RegionalPageContent;
  siblingPages: RegionalPageContent[];
};

function RegionalCta({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-18 sm:py-24">
      <Container>
        <div className="rounded-[2rem] border border-[#66fcf1]/30 bg-[linear-gradient(145deg,rgba(16,24,28,0.95),rgba(11,12,16,0.98))] p-8 text-center shadow-[0_35px_80px_-55px_rgba(102,252,241,0.55)] sm:p-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#c6c6c6]">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
            {secondaryHref && secondaryLabel ? (
              <ButtonLink href={secondaryHref} variant="ghost">
                {secondaryLabel}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function RegionalHubPage({ regional }: RegionalHubPageProps) {
  const enabledPages = regional.pages.filter((page) => page.enabled !== false);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Agenție de Marketing", href: regional.hub.path },
        ]}
      />

      <section className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(102,252,241,0.13),transparent_38%),radial-gradient(circle_at_84%_10%,rgba(39,104,100,0.2),transparent_40%)]" />
        <Container className="relative">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66fcf1]">
              {regional.hub.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {regional.hub.hero.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#c6c6c6]">
              {regional.hub.hero.intro}
            </p>
            <ButtonLink href={regional.hub.hero.ctaHref} className="mt-8">
              {regional.hub.hero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{regional.hub.overviewTitle}</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[#c6c6c6]">
            {regional.hub.overviewParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-18 sm:py-24">
        <Container>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{regional.hub.serviceTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {enabledPages[0]?.services.map((service) => (
              <article key={service.id} className="rounded-3xl border border-[#263740] bg-[#10161a] p-6">
                <h3 className="text-xl font-semibold text-white">
                  <Link href={service.href} className="transition-colors hover:text-[#66fcf1]">
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{service.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24">
        <Container>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{regional.hub.regionTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {enabledPages.map((page) => (
              <Link
                key={page.slug}
                href={`/agentie-marketing/${page.slug}`}
                className="group rounded-3xl border border-[#263740] bg-[#10181d] p-6 transition hover:border-[#66fcf1]/55"
              >
                <MapPin className="h-5 w-5 text-[#66fcf1]" />
                <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-[#66fcf1]">
                  {page.cityName}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{page.hero.intro}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <RegionalCta {...regional.hub.cta} />
    </>
  );
}

export function RegionalCityPage({ page, siblingPages }: RegionalCityPageProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Agenție de Marketing", href: "/agentie-marketing" },
          { label: page.cityName, href: `/agentie-marketing/${page.slug}` },
        ]}
      />

      <section className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(102,252,241,0.13),transparent_38%),radial-gradient(circle_at_80%_8%,rgba(39,104,100,0.21),transparent_40%)]" />
        <Container className="relative">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66fcf1]">
              {page.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {page.hero.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#c6c6c6]">
              {page.hero.intro}
            </p>
            <ButtonLink href={page.hero.ctaHref} className="mt-8">
              {page.hero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{page.positioning.title}</h2>
          <div className="space-y-5 text-base leading-8 text-[#c6c6c6]">
            {page.positioning.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-18 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">{page.regionalContext.title}</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[#c6c6c6]">
                {page.regionalContext.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <aside className="rounded-[2rem] border border-[#263740] bg-[#10161a] p-6">
              <h3 className="text-xl font-semibold text-white">Context regional</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#c6c6c6]">
                {page.regionalContext.sectors.map((sector) => (
                  <li key={sector} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                    <span>{sector}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </section>

      {page.semanticSummary ? (
        <section className="border-y border-[#1a252d] bg-[#0d1217] py-14 sm:py-18" aria-labelledby="semantic-summary-title">
          <Container>
            <div className="rounded-[2rem] border border-[#263740] bg-[#10161a] p-6 sm:p-8">
              <h2 id="semantic-summary-title" className="text-2xl font-semibold text-white sm:text-3xl">
                {page.semanticSummary.title}
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {page.semanticSummary.points.map((point) => (
                  <p key={point} className="rounded-2xl border border-[#223239] bg-[#0c1216] p-4 text-sm leading-relaxed text-[#c6c6c6]">
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24">
        <Container>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Servicii de marketing pentru {page.cityName}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {page.services.map((service) => (
              <article key={service.id} className="rounded-3xl border border-[#263740] bg-[#10181d] p-6">
                <h3 className="text-xl font-semibold text-white">
                  <Link href={service.href} className="transition-colors hover:text-[#66fcf1]">
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{service.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {page.serviceExpansion ? (
        <section className="py-14 sm:py-18" aria-labelledby="regional-service-expansion-title">
          <Container>
            <div className="max-w-3xl">
              <h2 id="regional-service-expansion-title" className="text-2xl font-semibold text-white sm:text-3xl">
                {page.serviceExpansion.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#c6c6c6]">{page.serviceExpansion.intro}</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {page.serviceExpansion.items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#263740] bg-[#10161a] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                    {item.futurePath}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#c6c6c6]">{item.context}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{page.worksWith.title}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#c6c6c6]">
              {page.worksWith.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-4">
            {page.worksWith.criteria.map((criterion) => (
              <article key={criterion} className="rounded-2xl border border-[#263740] bg-[#10161a] p-5">
                <h3 className="text-base font-semibold text-white">{criterion}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24" aria-labelledby="regional-faq-title">
        <Container>
          <h2 id="regional-faq-title" className="text-3xl font-semibold text-white sm:text-4xl">
            Întrebări frecvente despre marketing în {page.cityName}
          </h2>
          <div className="mt-8 divide-y divide-[#263740] overflow-hidden rounded-[1.6rem] border border-[#263740] bg-[#10161a]">
            {page.faqs.map((item) => (
              <details key={item.id} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition-colors hover:text-[#66fcf1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#66fcf1] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#66fcf1] transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-[#c6c6c6]">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-semibold text-white">Legături utile</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.internalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-[#2f3f47] bg-[#11181d] px-4 py-2 text-sm font-semibold text-[#c6c6c6] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]">
                {item.label}
              </Link>
            ))}
            {siblingPages.map((item) => (
              <Link key={item.slug} href={`/agentie-marketing/${item.slug}`} className="rounded-full border border-[#2f3f47] bg-[#11181d] px-4 py-2 text-sm font-semibold text-[#c6c6c6] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]">
                {item.cityName}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <RegionalCta {...page.cta} />
    </>
  );
}
