import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PortfolioInteractiveGrid } from "@/components/portfolio/portfolio-interactive-grid";
import { VideoShowcase } from "@/components/portfolio/video-showcase";
import { CaseHighlightGrid } from "@/components/portfolio/case-highlight-grid";
import { SocialProofStrip } from "@/components/portfolio/social-proof-strip";

export const metadata = buildMetadata({
  title: "Portofoliu",
  path: "/portofoliu",
  description:
    "Portofoliu Digital Dot cu proiecte orientate pe rezultate: leaduri, conversii, creștere de brand și revenue.",
});

function getFilters(page: Awaited<ReturnType<typeof getSiteContent>>["portfolioPage"]) {
  return (
    page.filters ?? [
      { label: "Toate", value: "toate", categories: ["*"] },
      { label: "Social Media", value: "social-media", categories: ["Social Media"] },
      { label: "Video Production", value: "video-production", categories: ["Branding", "Web"] },
      { label: "Ads / Strategy", value: "ads-strategy", categories: ["Performance", "Branding"] },
    ]
  );
}

export default async function PortofoliuPage() {
  const content = await getSiteContent();
  const page = content.portfolioPage;
  const projects = content.portfolioProjects;
  const filters = getFilters(page);

  const featuredVideo =
    page.featuredVideo ?? {
      label: "Featured Video",
      title: page.videoBlockTitle,
      description: page.videoBlockDescription,
      image: projects[0]?.image ?? "/images/portfolio/ecom-fashion.svg",
      href: "/contacteaza-ne",
    };

  const videoItems =
    page.videoItems ??
    projects.slice(0, 3).map((project, index) => ({
      label: `Video ${index + 1}`,
      title: project.title,
      description: project.excerpt,
      image: project.image,
      href: project.href ?? "/portofoliu",
    }));

  const caseHighlights =
    page.caseHighlights ??
    projects.slice(0, 3).map((project, index) => ({
      icon: ["Target", "ChartLine", "Sparkles"][index] ?? "Target",
      title: project.title,
      context: project.excerpt,
      approach: "Implementare full-funnel cu optimizare săptămânală.",
      metric: project.metrics[0] ?? "KPI disponibil la request",
    }));

  const socialProof =
    page.socialProofLogos ??
    projects.slice(0, 4).map((project) => ({
      name: project.title,
      image: project.image,
      href: project.href ?? "/portofoliu",
    }));

  const visibility = {
    hero: page.sectionVisibility?.hero ?? true,
    filters: page.sectionVisibility?.filters ?? true,
    projects: page.sectionVisibility?.projects ?? true,
    videoShowcase: page.sectionVisibility?.videoShowcase ?? true,
    caseHighlights: page.sectionVisibility?.caseHighlights ?? true,
    socialProof: page.sectionVisibility?.socialProof ?? true,
    finalCta: page.sectionVisibility?.finalCta ?? true,
  };

  return (
    <>
      {visibility.hero ? (
        <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/3 top-16 h-[420px] w-[420px] rounded-full bg-[#276864]/12 blur-[120px]" />
            <div className="absolute bottom-8 right-1/4 h-[320px] w-[320px] rounded-full bg-[#66fcf1]/7 blur-[100px]" />
          </div>

          <Container className="relative z-10">
            <AnimatedSection className="mx-auto max-w-4xl text-center">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#66fcf1]">
                {page.heroBadge ?? "Portofoliu Curat"}
              </p>
              <h1
                className="font-extrabold leading-[0.96] tracking-tight text-white"
                style={{ fontSize: `${page.heroTitleFontSize ?? 50}px` }}
              >
                {page.heroTitle}
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-[#bacac7] sm:text-xl">
                {page.heroDescription}
              </p>
              <ButtonLink href={page.heroCtaHref ?? "/contacteaza-ne"} className="mt-10 h-14 px-10 text-base">
                {page.heroCtaLabel}
              </ButtonLink>
            </AnimatedSection>
          </Container>
        </section>
      ) : null}

      {visibility.filters || visibility.projects ? (
        <section className="pb-16 sm:pb-20">
          <Container>
            {visibility.filters ? (
              <AnimatedSection className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{page.filterTitle}</h2>
                <p className="mt-3 max-w-3xl text-[#bacac7]">{page.filterDescription}</p>
              </AnimatedSection>
            ) : null}

            {visibility.projects ? (
              <PortfolioInteractiveGrid
                filters={filters}
                defaultFilter={page.defaultFilter ?? "toate"}
                projects={projects}
              />
            ) : null}
          </Container>
        </section>
      ) : null}

      {visibility.videoShowcase ? (
        <Container>
          <VideoShowcase
            title={page.videoBlockTitle}
            intro={page.videoBlockDescription}
            ctaLabel={page.videoShowcaseCtaLabel ?? "Vezi toate proiectele"}
            ctaHref={page.videoShowcaseCtaHref ?? "/portofoliu"}
            featured={featuredVideo}
            items={videoItems}
          />
        </Container>
      ) : null}

      {visibility.caseHighlights ? (
        <Container>
          <CaseHighlightGrid
            title={page.caseHighlightsTitle ?? page.caseStudiesTitle}
            intro={page.caseHighlightsIntro ?? page.caseStudiesDescription}
            items={caseHighlights}
          />
        </Container>
      ) : null}

      {visibility.socialProof ? (
        <Container>
          <SocialProofStrip
            title={page.socialProofTitle ?? "Branduri partenere"}
            intro={page.socialProofIntro ?? "Echipe care au ales claritate și performanță."}
            logos={socialProof}
          />
        </Container>
      ) : null}

      {visibility.finalCta ? (
        <section className="mb-16 pb-4 sm:mb-20">
          <Container>
            <AnimatedSection className="relative overflow-hidden rounded-2xl border border-[#3c4948]/20 bg-gradient-to-br from-[#292a2a] to-[#0d0e0f] px-8 py-14 text-center sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 bg-[#66fcf1]/5 blur-[110px]" />
              <h2 className="relative z-10 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                {page.finalCta.title}
              </h2>
              <p className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-[#bacac7]">
                {page.finalCta.description}
              </p>
              <div className="relative z-10 mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink href={page.finalCta.primaryHref} className="h-14 px-10 text-lg">
                  {page.finalCta.primaryLabel}
                </ButtonLink>
                <ButtonLink
                  href={page.finalCta.secondaryHref ?? "/servicii/strategie-marketing"}
                  variant="ghost"
                  className="h-14 border-[#3c4948]/50 px-10 text-lg text-white hover:bg-white/5"
                >
                  {page.finalCta.secondaryLabel ?? "Vezi Servicii"}
                </ButtonLink>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      ) : null}

      <section className="pb-8">
        <Container className="text-right">
          <Link
            href="/contacteaza-ne"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#66fcf1] hover:underline"
          >
            Programează un discovery call
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
