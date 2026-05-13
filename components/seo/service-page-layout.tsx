import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Clapperboard, Code2, Search, Share2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import type { FaqGroupContent, ServiceSeoPageContent } from "@/lib/site-content-schema";

type ServicePageLayoutProps = {
  page: ServiceSeoPageContent;
  faqGroups: FaqGroupContent[];
};

const iconByPath = {
  "/social-media-management": Share2,
  "/google-meta-ads": BarChart3,
  "/productie-video": Clapperboard,
  "/website-creation": Code2,
  "/seo": Search,
} as const;

export function ServicePageLayout({ page, faqGroups }: ServicePageLayoutProps) {
  const Icon = iconByPath[page.path as keyof typeof iconByPath] || CheckCircle2;

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
              {page.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={page.ctaHref}>
                {page.ctaLabel}
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
            {page.explanationTitle}
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {page.explanationParagraphs.map((paragraph, index) => (
              <article key={`${page.id}-explanation-${index}`} className="rounded-3xl border border-[#263740] bg-[#10181d] p-6">
                <CheckCircle2 className="h-5 w-5 text-[#66fcf1]" />
                <p className="mt-4 text-sm leading-relaxed text-[#c6c6c6]">{paragraph}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-18 sm:py-24" aria-labelledby="problems-title">
        <Container>
          <h2 id="problems-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            {page.problemsTitle}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {page.problems.map((problem, index) => (
              <article key={problem.id} className="rounded-3xl border border-[#263740] bg-[#10161a] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{problem.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{problem.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24" aria-labelledby="process-title">
        <Container>
          <div className="max-w-3xl">
            <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
              {page.approachTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#c6c6c6]">{page.approachIntro}</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {page.approachSteps.map((step, index) => (
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

      <section className="py-18 sm:py-24" aria-labelledby="authority-title">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="authority-title" className="text-3xl font-semibold text-white sm:text-4xl">
              {page.authorityTitle}
            </h2>
          </div>
          <div className="space-y-5 lg:col-span-8">
            {page.authorityParagraphs.map((paragraph, index) => (
              <p key={`${page.id}-authority-${index}`} className="text-base leading-relaxed text-[#c6c6c6]">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-14" aria-labelledby="related-services-title">
        <Container>
          <h2 id="related-services-title" className="text-2xl font-semibold text-white">
            {page.relatedTitle}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.relatedLinks.map((item) => (
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

      <section className="py-18 sm:py-24" aria-labelledby="service-cta-title">
        <Container>
          <div className="rounded-[2rem] border border-[#276864]/45 bg-[#10181d] p-8 sm:p-10">
            <h2 id="service-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              {page.cta.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">{page.cta.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={page.cta.primaryHref}>{page.cta.primaryLabel}</ButtonLink>
              <ButtonLink href={page.cta.secondaryHref} variant="ghost">{page.cta.secondaryLabel}</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
