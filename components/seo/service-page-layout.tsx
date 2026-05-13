import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import type { FaqGroupContent } from "@/lib/site-content-schema";
import type { SeoServicePage } from "@/data/seo-pages";

type ServicePageLayoutProps = {
  page: SeoServicePage;
  faqGroups: FaqGroupContent[];
};

export function ServicePageLayout({ page, faqGroups }: ServicePageLayoutProps) {
  const Icon = page.icon;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: page.title, href: page.path },
        ]}
      />

      <section className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(102,252,241,0.12),transparent_36%),radial-gradient(circle_at_85%_15%,rgba(39,104,100,0.2),transparent_38%)]" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="inline-flex rounded-full border border-[#66fcf1]/35 bg-[#66fcf1]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#66fcf1]">
              {page.eyebrow}
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              {page.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/#contact">
                Hai să povestim
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/case-studies" variant="ghost">
                Vezi rezultate
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#276864]/45 bg-[#0f1519] shadow-[0_35px_90px_-55px_rgba(102,252,241,0.75)]">
              <div className="absolute left-5 top-5 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#66fcf1]/40 bg-[#0b0c10]/70 text-[#66fcf1] backdrop-blur">
                <Icon className="h-5 w-5" />
              </div>
              <div className="relative aspect-[16/10]">
                <Image
                  src={page.heroImage}
                  alt={`${page.title} Digital Dot`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24" aria-labelledby="outcomes-title">
        <Container>
          <h2 id="outcomes-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Ce construim concret
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {page.outcomes.map((outcome) => (
              <article key={outcome} className="rounded-3xl border border-[#263740] bg-[#10181d] p-5">
                <CheckCircle2 className="h-5 w-5 text-[#66fcf1]" />
                <h3 className="mt-3 text-lg font-semibold text-white">{outcome}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-18 sm:py-24" aria-labelledby="process-title">
        <Container>
          <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
            Proces de lucru
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {page.process.map((step, index) => (
              <article key={step.title} className="rounded-3xl border border-[#263740] bg-[#10161a] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-14" aria-labelledby="related-services-title">
        <Container>
          <h2 id="related-services-title" className="text-2xl font-semibold text-white">
            Linkuri utile
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex rounded-full border border-[#2f3f47] bg-[#11181d] px-4 py-2 text-sm font-semibold text-[#c6c6c6] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <FaqSection groups={faqGroups} />
    </>
  );
}
