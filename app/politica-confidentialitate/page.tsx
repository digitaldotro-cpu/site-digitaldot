import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const policy = content.privacyPolicy;

  return buildRouteMetadata({
    content,
    path: "/politica-confidentialitate",
    fallbackTitle: policy.settings.seoTitle,
    fallbackDescription: policy.settings.seoDescription,
    type: "article",
  });
}

export default async function PoliticaConfidentialitatePage() {
  const content = await getSiteContent();
  const policy = content.privacyPolicy;

  if (!policy.settings.enabled) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(content, [
          { name: "Acasă", path: "/" },
          { name: "Politica de confidențialitate", path: "/politica-confidentialitate" },
        ])}
      />
      <LegalPageLayout page={policy} />
    </>
  );
}
