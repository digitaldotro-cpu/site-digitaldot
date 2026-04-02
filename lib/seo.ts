import type { Metadata } from "next";

const siteUrl = "https://www.digitaldot.ro";
const siteName = "Digital Dot";
const defaultDescription =
  "Agenție de marketing digital orientată spre lead generation, strategie clară și creștere măsurabilă.";

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteName}`;
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

export const siteMetadata = {
  siteUrl,
  siteName,
  defaultDescription,
};
