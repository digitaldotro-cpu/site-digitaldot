import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { RegionalCityPage } from "@/components/regional/regional-pages";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildRegionalLocalBusinessSchema,
  buildRegionalServiceSchemas,
} from "@/lib/structured-data";

type RegionalCityRouteProps = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.regionalSeo.pages
    .filter((page) => page.enabled !== false)
    .map((page) => ({ city: page.slug }));
}

export async function generateMetadata({ params }: RegionalCityRouteProps): Promise<Metadata> {
  const [{ city }, content] = await Promise.all([params, getSiteContent()]);
  const page = content.regionalSeo.pages.find((item) => item.slug === city && item.enabled !== false);

  if (!page) {
    return { title: "Pagină regională negăsită | Digital Dot" };
  }

  const canonical = absoluteUrl(`/agentie-marketing/${page.slug}`, content);
  const image = absoluteUrl(page.ogImage, content);

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: page.ogTitle,
      description: page.ogDescription,
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [{ url: image, alt: page.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description: page.ogDescription,
      images: [image],
    },
  };
}

export default async function RegionalCityPageRoute({ params }: RegionalCityRouteProps) {
  const [{ city }, content] = await Promise.all([params, getSiteContent()]);
  const page = content.regionalSeo.pages.find((item) => item.slug === city && item.enabled !== false);

  if (!content.regionalSeo.enabled || !page) {
    notFound();
  }

  const siblingPages = content.regionalSeo.pages.filter(
    (item) => item.enabled !== false && item.slug !== page.slug,
  );

  return (
    <>
      <JsonLd
        data={[
          buildRegionalLocalBusinessSchema(content, page),
          ...buildRegionalServiceSchemas(content, page),
          buildFaqSchema({
            id: `${page.id}-faq`,
            title: `FAQ ${page.cityName}`,
            assignedPaths: [`/agentie-marketing/${page.slug}`],
            items: page.faqs,
          }),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Agenție de Marketing", path: "/agentie-marketing" },
            { name: page.cityName, path: `/agentie-marketing/${page.slug}` },
          ]),
        ]}
      />
      <RegionalCityPage page={page} siblingPages={siblingPages} />
    </>
  );
}
