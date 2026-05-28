import type { Metadata, Viewport } from "next";
import { Inter, Varela_Round } from "next/font/google";

import "./globals.css";
import { siteMetadata } from "@/lib/seo";
import { buildLocalBusinessSchema, buildOrganizationSchema, buildWebSiteSchema } from "@/lib/structured-data";
import { getSiteContent } from "@/lib/site-content";
import { AppShell } from "@/components/layout/app-shell";
import { DeferredGtm } from "@/components/layout/deferred-gtm";
import { JsonLd } from "@/components/seo/json-ld";

const varelaRound = Varela_Round({
  variable: "--font-varela-round",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0c10",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const favicon = content.global.favicon?.trim();
  const landingTitle = content.seoSettings.global.siteTitle || content.landing.seoTitle;
  const landingDescription = content.seoSettings.global.siteDescription || content.landing.seoDescription;
  const defaultOgImage = new URL(
    content.seoSettings.global.defaultOgImage,
    content.seoSettings.global.canonicalBaseUrl,
  ).toString();

  return {
    metadataBase: new URL(content.seoSettings.global.canonicalBaseUrl),
    title: {
      default: landingTitle,
      template: "%s",
    },
    description: landingDescription,
    keywords: content.seoSettings.global.defaultKeywords,
    openGraph: {
      title: landingTitle,
      description: landingDescription,
      url: content.seoSettings.global.canonicalBaseUrl,
      siteName: siteMetadata.siteName,
      locale: "ro_RO",
      type: "website",
      images: [{ url: defaultOgImage, alt: landingTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: landingTitle,
      description: landingDescription,
      images: [defaultOgImage],
    },
    icons: favicon
      ? {
          icon: [{ url: favicon }],
          shortcut: [{ url: favicon }],
          apple: [{ url: favicon }],
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const gtmId = content.global.gtmId?.trim();

  return (
    <html lang="ro" className={`${varelaRound.variable} ${inter.variable}`}>
      <body className="bg-[#0b0c10] text-white antialiased">
        {gtmId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        {gtmId ? <DeferredGtm gtmId={gtmId} /> : null}
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_14%,rgba(39,104,100,0.16),transparent_32%),radial-gradient(circle_at_18%_0%,rgba(216,199,163,0.055),transparent_28%),linear-gradient(160deg,#0b0c10_0%,#101418_50%,#0b0c10_100%)]" />
          <JsonLd
            data={[
              buildOrganizationSchema(content),
              buildLocalBusinessSchema(content),
              buildWebSiteSchema(content),
            ]}
          />
          <AppShell content={{ global: content.global }}>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
