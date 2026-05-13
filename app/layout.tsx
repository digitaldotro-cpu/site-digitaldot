import type { Metadata, Viewport } from "next";
import { Varela_Round } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { siteMetadata } from "@/lib/seo";
import { buildLocalBusinessSchema, buildOrganizationSchema } from "@/lib/structured-data";
import { getSiteContent } from "@/lib/site-content";
import { AppShell } from "@/components/layout/app-shell";
import { JsonLd } from "@/components/seo/json-ld";

const varelaRound = Varela_Round({
  variable: "--font-varela-round",
  subsets: ["latin"],
  weight: "400",
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
    <html lang="ro" className={varelaRound.variable}>
      <body className="bg-[#0b0c10] text-white antialiased">
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {gtmId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(102,252,241,0.11),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(39,104,100,0.26),transparent_36%),linear-gradient(160deg,#090b0f_10%,#0c1014_55%,#0b0f12_100%)]" />
          <JsonLd data={[buildOrganizationSchema(content), buildLocalBusinessSchema(content)]} />
          <AppShell content={content}>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
