import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { CaseStudyPreview } from "@/components/portfolio/case-study-preview";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = buildMetadata({
  title: "Portofoliu",
  path: "/portofoliu",
  description:
    "Portofoliu Digital Dot cu proiecte orientate pe rezultate: leaduri, conversii, creștere de brand și revenue.",
});

export default async function PortofoliuPage() {
  const content = await getSiteContent();
  const page = content.portfolioPage;
  const projects = content.portfolioProjects;
  const featuredPreviews = projects.slice(0, 2);

  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {page.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#c7cdd1]">{page.heroDescription}</p>
          <ButtonLink href="/contacteaza-ne" className="mt-8">
            {page.heroCtaLabel}
          </ButtonLink>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={page.filterTitle} description={page.filterDescription} />
          <div className="mt-8">
            <PortfolioGrid projects={projects} />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={page.caseStudiesTitle} description={page.caseStudiesDescription} />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {featuredPreviews.map((project) => (
              <CaseStudyPreview key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-[1.8rem] border border-[#27373f] bg-[#10171b] p-7 sm:p-10">
            <h2 className="text-2xl font-semibold text-white">{page.videoBlockTitle}</h2>
            <p className="mt-4 text-[#c7ccd0]">{page.videoBlockDescription}</p>
          </div>
        </Container>
      </section>

      <CtaSection
        title={page.finalCta.title}
        description={page.finalCta.description}
        primaryLabel={page.finalCta.primaryLabel}
        primaryHref={page.finalCta.primaryHref}
        secondaryLabel={page.finalCta.secondaryLabel}
        secondaryHref={page.finalCta.secondaryHref}
      />
    </>
  );
}
