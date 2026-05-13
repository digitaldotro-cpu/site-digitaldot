import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { RegionalHubPage } from "@/components/regional/regional-pages";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const hub = content.regionalSeo.hub;
  const canonical = absoluteUrl(hub.path, content);
  const image = absoluteUrl(hub.ogImage, content);

  return {
    title: hub.seoTitle,
    description: hub.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: hub.ogTitle,
      description: hub.ogDescription,
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [{ url: image, alt: hub.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: hub.ogTitle,
      description: hub.ogDescription,
      images: [image],
    },
  };
}

export default async function AgentieMarketingPage() {
  const content = await getSiteContent();

  if (!content.regionalSeo.enabled) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(content, [
          { name: "Acasă", path: "/" },
          { name: "Agenție de Marketing", path: "/agentie-marketing" },
        ])}
      />
      <RegionalHubPage regional={content.regionalSeo} />
    </>
  );
}
