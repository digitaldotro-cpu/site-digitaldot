import type { Metadata } from "next";
import type { SiteContent } from "@/lib/site-content-schema";

const siteUrl = "https://digitaldot.ro";
const siteName = "Digital Dot";
const defaultDescription =
  "Agenție de marketing digital orientată spre lead generation, strategie clară și creștere măsurabilă.";

type MetadataInput = {
  title: string;
  description?: string;
  path?: string;
};

type RouteMetadataInput = {
  content: SiteContent;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  type?: "website" | "article";
  publishedTime?: string;
  image?: string;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getCanonicalBaseUrl(content?: SiteContent) {
  const configured = content?.seoSettings.global.canonicalBaseUrl?.trim();
  return trimTrailingSlash(configured || siteUrl);
}

export function absoluteUrl(pathOrUrl: string, content?: SiteContent) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl || "/", getCanonicalBaseUrl(content)).toString();
}

export function getPageSeo(content: SiteContent, path: string) {
  const normalizedPath = path === "/" ? "/" : trimTrailingSlash(path);
  return content.seoSettings.pages.find((page) => {
    const pagePath = page.path === "/" ? "/" : trimTrailingSlash(page.path);
    return pagePath === normalizedPath;
  });
}

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
}: MetadataInput): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = new URL(path, siteUrl).toString();

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url,
      siteName,
      locale: "ro_RO",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function buildRouteMetadata({
  content,
  path,
  fallbackTitle,
  fallbackDescription,
  type = "website",
  publishedTime,
  image,
}: RouteMetadataInput): Metadata {
  const pageSeo = getPageSeo(content, path);
  const title = pageSeo?.seoTitle || fallbackTitle;
  const description = pageSeo?.seoDescription || fallbackDescription;
  const ogTitle = pageSeo?.ogTitle || title;
  const ogDescription = pageSeo?.ogDescription || description;
  const canonical = pageSeo?.canonicalUrl || absoluteUrl(path, content);
  const ogImage = pageSeo?.ogImage || image || content.seoSettings.global.defaultOgImage;
  const ogImageUrl = absoluteUrl(ogImage, content);
  const robots = pageSeo?.robots || content.seoSettings.global.robots;

  return {
    metadataBase: new URL(getCanonicalBaseUrl(content)),
    title,
    description,
    keywords: content.seoSettings.global.defaultKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName,
      locale: "ro_RO",
      publishedTime,
      images: [
        {
          url: ogImageUrl,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: robots.index,
      follow: robots.follow,
      googleBot: {
        index: robots.googleBotIndex,
        follow: robots.googleBotFollow,
      },
    },
  };
}

export const siteMetadata = {
  siteUrl,
  siteName,
  defaultDescription,
};
