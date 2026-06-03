import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { CaseStudyCard } from "@/components/case-studies/case-study-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildCaseStudyCollectionSchema } from "@/lib/structured-data";

const path = "/case-studies";
const serviceLinks = [
  { label: "Strategie de Marketing", href: "/servicii/strategie-marketing" },
  { label: "Social Media Management", href: "/social-media-management" },
  { label: "Producție Foto/Video", href: "/productie-video" },
  { label: "Google & Meta Ads", href: "/google-meta-ads" },
  { label: "Website Creation", href: "/website-creation" },
  { label: "SEO", href: "/seo" },
];

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

          <section className="mt-12 rounded-2xl border border-[#1f2a2d] bg-[#101418]/70 p-6 sm:p-8" aria-labelledby="case-study-services-title">
            <h2 id="case-study-services-title" className="text-2xl font-semibold text-white">
              Servicii care au susținut aceste rezultate
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#c6c6c6]">
              Studiile de caz conectează strategie, conținut, campanii plătite, website și optimizare, în funcție de obiectivul fiecărui brand.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {serviceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex rounded-full border border-[#276864]/35 bg-[#0b0c10]/72 px-4 py-2 text-sm font-semibold text-[#dadada] transition-colors hover:border-[#276864] hover:bg-[#1f2a2d] hover:text-[#d8c7a3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

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
