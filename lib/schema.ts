import { siteMetadata } from "./seo";
import type { SiteContent } from "./site-content-schema";
import type { BlogPost } from "./blog";

export function generateLocalBusinessSchema(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: content.global.brandName,
    image: `${siteMetadata.siteUrl}${content.global.headerLogo}`,
    "@id": siteMetadata.siteUrl,
    url: siteMetadata.siteUrl,
    telephone: content.global.contactPhone,
    address: {
      "@type": "PostalAddress",
      addressLocality: content.global.contactLocation.split(",")[0]?.trim() || "Suceava",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.6514,
      longitude: 26.2556,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      opens: "09:00",
      closes: "18:00"
    },
    sameAs: content.global.footer.socialLinks
      .filter((link) => link.enabled)
      .map((link) => link.url),
  };
}

export function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteMetadata.siteUrl}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: `${siteMetadata.siteUrl}${post.coverImage}`,
    author: {
      "@type": "Organization",
      name: "Digital Dot",
      url: siteMetadata.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Digital Dot",
      logo: {
        "@type": "ImageObject",
        url: `${siteMetadata.siteUrl}/branding/logo-primary.png`,
      },
    },
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.publishedAt).toISOString(),
  };
}
