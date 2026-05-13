import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema, getFaqGroupsForPath } from "@/lib/structured-data";
import { getSeoServicePage } from "@/data/seo-pages";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePageLayout } from "@/components/seo/service-page-layout";

const path = "/productie-video";
const page = getSeoServicePage(path)!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: `${page.title} | Digital Dot`,
    fallbackDescription: page.description,
    image: page.heroImage,
  });
}

export default async function ProductieVideoPage() {
  const content = await getSiteContent();
  const faqGroups = getFaqGroupsForPath(content, path);
  const schemas = [
    buildServiceSchema(content, path),
    buildBreadcrumbSchema(content, [
      { name: "Acasă", path: "/" },
      { name: page.title, path },
    ]),
    ...faqGroups.map(buildFaqSchema),
  ].filter(Boolean) as Array<Record<string, unknown>>;

  return (
    <>
      <JsonLd data={schemas} />
      <ServicePageLayout page={page} faqGroups={faqGroups} />
    </>
  );
}
