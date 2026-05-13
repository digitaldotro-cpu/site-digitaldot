import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { portfolioProjects } from "@/data/portfolio";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

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

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(content, [
          { name: "Acasă", path: "/" },
          { name: "Case Studies", path },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
        ]}
      />
      <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66fcf1]">
              Rezultate
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Case Studies Digital Dot
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              Exemple de proiecte în care strategia, execuția și datele lucrează împreună pentru creștere măsurabilă.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/#contact">Discută un proiect</ButtonLink>
              <ButtonLink href="/blog" variant="ghost">Citește blogul</ButtonLink>
            </div>
          </header>

          <div className="mt-12">
            <PortfolioGrid projects={portfolioProjects} />
          </div>
        </Container>
      </section>
    </>
  );
}
