"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

type AppShellProps = {
  children: React.ReactNode;
  content: {
    global: {
      brandName: string;
      headerLogo?: string;
      favicon?: string;
      navbarCtaLabel: string;
      navbarCtaHref: string;
      navigation: Array<{ label: string; href: string }>;
      footer: {
        logo?: string;
        description: string;
        socialLinksTitle: string;
        socialLinks: Array<{ platform: string; url: string; icon: string; visible: boolean }>;
        legalLinksTitle: string;
        legalLinks: Array<{ label: string; href: string }>;
        contactTitle: string;
        contactEmail: string;
        contactPhone: string;
        contactLocation: string;
        copyrightTemplate: string;
      };
    };
    landing?: {
      footer?: {
        enabled: boolean;
      };
    };
  };
};

export function AppShell({ children, content }: AppShellProps) {
  const pathname = usePathname();
  const isCmsRoute = pathname.startsWith("/panou-control");

  if (isCmsRoute) {
    return <main>{children}</main>;
  }

  const footerEnabled = content.landing?.footer?.enabled ?? true;

  return (
    <>
      <Navbar
        brandName={content.global.brandName}
        headerLogo={content.global.headerLogo}
        navItems={content.global.navigation}
        ctaLabel={content.global.navbarCtaLabel}
        ctaHref={content.global.navbarCtaHref}
      />
      <main>{children}</main>
      {footerEnabled ? (
        <Footer
          brandName={content.global.brandName}
          logo={content.global.footer.logo}
          description={content.global.footer.description}
          socialLinksTitle={content.global.footer.socialLinksTitle}
          socialLinks={content.global.footer.socialLinks}
          legalLinksTitle={content.global.footer.legalLinksTitle}
          legalLinks={content.global.footer.legalLinks}
          contactTitle={content.global.footer.contactTitle}
          contactEmail={content.global.footer.contactEmail}
          contactPhone={content.global.footer.contactPhone}
          contactLocation={content.global.footer.contactLocation}
          copyrightTemplate={content.global.footer.copyrightTemplate}
        />
      ) : null}
    </>
  );
}
