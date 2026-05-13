import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const terms = content.termsConditions;

  return buildRouteMetadata({
    content,
    path: "/termeni-si-conditii",
    fallbackTitle: terms.settings.seoTitle,
    fallbackDescription: terms.settings.seoDescription,
    type: "article",
  });
}

export default async function TermeniSiConditiiPage() {
  const content = await getSiteContent();
  const terms = content.termsConditions;

  if (!terms.settings.enabled) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(content, [
          { name: "Acasă", path: "/" },
          { name: "Termeni și condiții", path: "/termeni-si-conditii" },
        ])}
      />
      <LegalPageLayout page={terms} />
    </>
  );
}
