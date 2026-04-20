import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { CtaSection } from "@/components/sections/cta-section";
import { StrategyHero } from "@/components/strategy/strategy-hero";
import { ProblemGrid } from "@/components/strategy/problem-grid";
import { BentoDeliverables } from "@/components/strategy/bento-deliverables";
import { ProcessTimeline } from "@/components/strategy/process-timeline";
import { CaseStudyGrid } from "@/components/strategy/case-study-grid";

export const metadata = buildMetadata({
  title: "Strategie de marketing",
  path: "/servicii/strategie-marketing",
  description:
    "Strategie de marketing completă: audit, planificare, integrare multi-channel și framework de creștere.",
});

export default async function StrategieMarketingPage() {
  const content = await getSiteContent();
  const page = content.services.strategy;

  const problems =
    page.problems ??
    page.sectionOneItems.map((item, index) => ({
      icon: ["Target", "Gauge", "BarChart3"][index] ?? "Lightbulb",
      title: `Problemă ${index + 1}`,
      description: item,
    }));

  const deliverables =
    page.deliverables ??
    page.sectionTwoItems.map((item, index) => ({
      title: item,
      description: "Detaliu deliverable din planul strategic.",
      variant: (index === 0 ? "large" : index === 2 ? "accent" : "small") as
        | "large"
        | "small"
        | "accent",
    }));

  const processSteps =
    page.processSteps ??
    page.sectionThreeItems.map((item, index) => ({
      title: `Etapa ${index + 1}`,
      description: item,
    }));

  const caseStudies =
    page.caseStudies ??
    content.portfolioProjects.slice(0, 2).map((project) => ({
      category: project.category,
      title: project.title,
      description: project.excerpt,
      image: project.image,
      href: "/portofoliu",
    }));

  const visibility = {
    hero: page.sectionVisibility?.hero ?? true,
    problems: page.sectionVisibility?.problems ?? true,
    deliverables: page.sectionVisibility?.deliverables ?? true,
    process: page.sectionVisibility?.process ?? true,
    caseStudies: page.sectionVisibility?.caseStudies ?? true,
    finalCta: page.sectionVisibility?.finalCta ?? true,
  };

  return (
    <>
      {visibility.hero ? (
        <Container>
          <StrategyHero
            badge={page.heroBadge}
            title={page.heroTitle}
            titleFontSize={page.heroTitleFontSize}
            description={page.heroDescription}
            primaryCtaLabel={page.heroCtaLabel}
            primaryCtaHref="/contacteaza-ne"
            secondaryCtaLabel={page.heroSecondaryCtaLabel ?? "Vezi portofoliu"}
            secondaryCtaHref={page.heroSecondaryCtaHref ?? "/portofoliu"}
            image={page.heroImage ?? "/images/social-media/team-production.svg"}
          />
        </Container>
      ) : null}

      {visibility.problems ? (
        <Container>
          <ProblemGrid
            title={page.sectionOneTitle}
            intro={
              page.problemsIntro ??
              "Unde se pierde potențialul? Identificăm rapid blocajele care consumă buget și încetinesc creșterea."
            }
            items={problems}
          />
        </Container>
      ) : null}

      {visibility.deliverables ? (
        <Container>
          <BentoDeliverables
            title={page.sectionTwoTitle}
            intro={
              page.deliverablesIntro ??
              "Primești deliverables clare, orientate pe execuție și decizie, nu doar recomandări generale."
            }
            items={deliverables}
          />
        </Container>
      ) : null}

      {visibility.process ? (
        <Container>
          <ProcessTimeline
            title={page.sectionThreeTitle}
            intro={
              page.processIntro ??
              "Metodologia noastră creează ritm, claritate și control în fiecare etapă de implementare."
            }
            steps={processSteps}
          />
        </Container>
      ) : null}

      {visibility.caseStudies ? (
        <Container>
          <CaseStudyGrid
            title={page.caseStudiesTitle ?? page.sectionFourTitle}
            intro={
              page.caseStudiesIntro ??
              "Strategia produce rezultate reale atunci când este executată disciplinat și măsurată corect."
            }
            items={caseStudies}
          />
        </Container>
      ) : null}

      {visibility.finalCta ? (
        <CtaSection
          title={page.finalCta.title}
          description={page.finalCta.description}
          primaryLabel={page.finalCta.primaryLabel}
          primaryHref={page.finalCta.primaryHref}
          secondaryLabel={page.finalCta.secondaryLabel}
          secondaryHref={page.finalCta.secondaryHref}
        />
      ) : null}
    </>
  );
}
