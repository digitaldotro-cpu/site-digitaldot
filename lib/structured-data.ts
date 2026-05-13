import type { BlogPost } from "@/types/content";
import type { FaqGroupContent, SiteContent } from "@/lib/site-content-schema";
import { absoluteUrl, getCanonicalBaseUrl, getPageSeo, siteMetadata } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function getFaqGroupsForPath(content: SiteContent, path: string) {
  return content.seoSettings.faqGroups.filter((group) => group.assignedPaths.includes(path));
}

export function buildOrganizationSchema(content: SiteContent) {
  const data = content.seoSettings.structuredData;
  const sameAs = data.socialLinks
    .filter((link) => link.enabled !== false)
    .map((link) => link.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getCanonicalBaseUrl(content)}/#organization`,
    name: data.organizationName,
    legalName: data.legalName,
    url: data.websiteUrl,
    logo: absoluteUrl(data.logo, content),
    email: data.email,
    telephone: data.phone,
    sameAs,
  };
}

export function buildLocalBusinessSchema(content: SiteContent) {
  const data = content.seoSettings.structuredData;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${getCanonicalBaseUrl(content)}/#localbusiness`,
    name: data.organizationName,
    legalName: data.legalName,
    url: data.websiteUrl,
    image: absoluteUrl(data.logo, content),
    email: data.email,
    telephone: data.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.streetAddress || undefined,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion || undefined,
      postalCode: data.address.postalCode || undefined,
      addressCountry: data.address.addressCountry,
    },
    areaServed: "Romania",
    priceRange: "$$",
    sameAs: data.socialLinks.filter((link) => link.enabled !== false).map((link) => link.url),
  };
}

export function buildServiceSchema(content: SiteContent, path: string) {
  const service = content.seoSettings.structuredData.services.find((item) => item.url === path);
  const pageSeo = getPageSeo(content, path);

  if (!service) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path, content)}#service`,
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.url, content),
    provider: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    serviceType: service.name,
    areaServed: "Romania",
    mainEntityOfPage: pageSeo?.canonicalUrl || absoluteUrl(path, content),
  };
}

export function buildFaqSchema(group: FaqGroupContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(content: SiteContent, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, content),
    })),
  };
}

export function buildArticleSchema(content: SiteContent, post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`, content);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage, content),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(content.seoSettings.structuredData.logo, content),
      },
    },
    mainEntityOfPage: url,
  };
}
