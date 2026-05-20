import type { BlogPost } from "@/types/content";
import type { FaqGroupContent, RegionalPageContent, SiteContent } from "@/lib/site-content-schema";
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
  const enabledRegions = content.regionalSeo?.enabled
    ? content.regionalSeo.pages
        .filter((page) => page.enabled !== false)
        .map((page) => ({
          "@type": "AdministrativeArea",
          name: page.countyName === page.cityName ? page.cityName : `${page.cityName}, ${page.countyName}`,
        }))
    : "Romania";

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
    areaServed: enabledRegions,
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

export function buildRegionalServiceSchemas(content: SiteContent, page: RegionalPageContent) {
  const pageUrl = absoluteUrl(`/agentie-marketing/${page.slug}`, content);

  return page.services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#${service.id}`,
    name: `${service.title} ${page.cityName}`,
    description: service.description,
    url: pageUrl,
    serviceType: service.title,
    areaServed: {
      "@type": "AdministrativeArea",
      name: page.countyName === page.cityName ? page.cityName : `${page.cityName}, ${page.countyName}`,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: page.regionalContext.sectors.join(", "),
    },
    provider: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    mainEntityOfPage: pageUrl,
  }));
}

export function buildRegionalLocalBusinessSchema(content: SiteContent, page: RegionalPageContent) {
  const base = buildLocalBusinessSchema(content);

  return {
    ...base,
    "@id": `${absoluteUrl(`/agentie-marketing/${page.slug}`, content)}#localbusiness`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: page.countyName === page.cityName ? page.cityName : `${page.cityName}, ${page.countyName}`,
    },
    name: `${siteMetadata.siteName} - agenție de marketing ${page.cityName}`,
    url: absoluteUrl(`/agentie-marketing/${page.slug}`, content),
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
    "@type": ["Article", "BlogPosting"],
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage, content),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
      jobTitle: post.authorRole,
      url: absoluteUrl(`/blog/autor/${post.authorSlug}`, content),
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

export function buildAuthorSchema(content: SiteContent, author: { slug: string; name: string; role: string; bio: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(`/blog/autor/${author.slug}`, content)}#person`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: absoluteUrl(`/blog/autor/${author.slug}`, content),
    worksFor: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
  };
}
