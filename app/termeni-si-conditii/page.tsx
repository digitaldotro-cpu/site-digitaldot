import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { getSiteContent } from "@/lib/site-content";
import { siteMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const terms = content.termsConditions;
  const canonicalUrl = new URL("/termeni-si-conditii", siteMetadata.siteUrl).toString();

  return {
    title: terms.settings.seoTitle,
    description: terms.settings.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: terms.settings.seoTitle,
      description: terms.settings.seoDescription,
      url: canonicalUrl,
      siteName: siteMetadata.siteName,
      locale: "ro_RO",
    },
    twitter: {
      card: "summary_large_image",
      title: terms.settings.seoTitle,
      description: terms.settings.seoDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermeniSiConditiiPage() {
  const content = await getSiteContent();
  const terms = content.termsConditions;

  if (!terms.settings.enabled) {
    notFound();
  }

  return <LegalPageLayout page={terms} />;
}
