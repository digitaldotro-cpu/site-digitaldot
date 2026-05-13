import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema, getFaqGroupsForPath } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePageLayout } from "@/components/seo/service-page-layout";

const path = "/social-media-management";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const page = content.serviceSeo.pages.find((item) => item.path === path)!;
  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: `${page.title} | Digital Dot`,
    fallbackDescription: page.intro,
    image: page.heroImage,
  });
}

export default async function SocialMediaManagementPage() {
  const content = await getSiteContent();
  const page = content.serviceSeo.pages.find((item) => item.path === path)!;
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
