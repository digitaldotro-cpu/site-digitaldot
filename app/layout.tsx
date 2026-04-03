import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { AppShell } from "@/components/layout/app-shell";

const varelaRound = Varela_Round({
  variable: "--font-varela-round",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: "Digital Dot | Agenție de Marketing Digital",
    template: "%s",
  },
  description: siteMetadata.defaultDescription,
  openGraph: {
    title: "Digital Dot | Agenție de Marketing Digital",
    description: siteMetadata.defaultDescription,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.siteName,
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Dot | Agenție de Marketing Digital",
    description: siteMetadata.defaultDescription,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="ro" className={varelaRound.variable}>
      <body className="bg-[#0b0c10] text-white antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(102,252,241,0.11),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(39,104,100,0.26),transparent_36%),linear-gradient(160deg,#090b0f_10%,#0c1014_55%,#0b0f12_100%)]" />
          <AppShell content={content}>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
