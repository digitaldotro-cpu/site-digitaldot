import type { MetadataRoute } from "next";
import { getCanonicalBaseUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const content = await getSiteContent();
  const baseUrl = getCanonicalBaseUrl(content);
  const allowedCrawlers = [
    "*",
    ...content.seoSettings.aiSeo.allowedCrawlers,
  ];

  return {
    rules: allowedCrawlers.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: ["/panou-control", "/api/admin"],
    })),
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
