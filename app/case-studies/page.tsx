import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { CaseStudyCard } from "@/components/case-studies/case-study-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildCaseStudyCollectionSchema } from "@/lib/structured-data";

const path = "/case-studies";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: "Case Studies Marketing Digital | Digital Dot",
    fallbackDescription: "Studii de caz Digital Dot pentru social media, performance marketing, website-uri și lead generation.",
  });
}

export default async function CaseStudiesPage() {
  const content = await getSiteContent();
  const caseStudies = content.caseStudies.studies;

  return (
    <>
      <JsonLd
        data={[
          buildCaseStudyCollectionSchema(content, caseStudies),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Studii de caz", path },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Studii de caz", href: "/case-studies" },
        ]}
      />
      <section className="brand-orbit relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container className="relative z-10">
          <header className="max-w-4xl">
            <span className="brand-rule mb-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
              Rezultate
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              {content.caseStudies.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              {content.caseStudies.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/#contact">Discută un proiect</ButtonLink>
              <ButtonLink href="/blog" variant="ghost">Citește blogul</ButtonLink>
            </div>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={study.slug} study={study} featured={caseStudies.length === 1 && index === 0} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
