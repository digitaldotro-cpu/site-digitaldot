"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

type AppShellProps = {
  children: React.ReactNode;
  content: {
    global: {
      brandName: string;
      navbarCtaLabel: string;
      navigation: Array<{ label: string; href: string }>;
      footer: {
        description: string;
        quickLinksTitle: string;
        quickLinks: Array<{ label: string; href: string }>;
        contactTitle: string;
        contactEmail: string;
        contactPhone: string;
        contactLocation: string;
        copyrightTemplate: string;
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

  return (
    <>
      <Navbar
        brandName={content.global.brandName}
        navItems={content.global.navigation}
        ctaLabel={content.global.navbarCtaLabel}
      />
      <main>{children}</main>
      <Footer
        brandName={content.global.brandName}
        description={content.global.footer.description}
        quickLinksTitle={content.global.footer.quickLinksTitle}
        quickLinks={content.global.footer.quickLinks}
        contactTitle={content.global.footer.contactTitle}
        contactEmail={content.global.footer.contactEmail}
        contactPhone={content.global.footer.contactPhone}
        contactLocation={content.global.footer.contactLocation}
        copyrightTemplate={content.global.footer.copyrightTemplate}
      />
    </>
  );
}
