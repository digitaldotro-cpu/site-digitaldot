"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingContactButtons } from "@/components/layout/floating-contact-buttons";

type AppShellProps = {
  children: React.ReactNode;
  content: {
    global: {
      brandName: string;
      headerLogo?: string;
      favicon?: string;
      navbarCtaLabel: string;
      navbarCtaHref: string;
      navigation: Array<{ label: string; href: string; enabled: boolean }>;
      scrollBehavior: {
        hideOnScrollDown: boolean;
        scrollThreshold: number;
        transitionDuration: number;
      };
      whatsappButton: {
        enabled: boolean;
        phoneNumber: string;
        url: string;
        icon: string;
        position: "bottom-right" | "bottom-left";
        openInNewTab: boolean;
        ariaLabel: string;
      };
      callButton: {
        enabled: boolean;
        phoneNumber: string;
        telLink: string;
        icon: string;
        position: "bottom-right" | "bottom-left";
        ariaLabel: string;
      };
      footer: {
        logo?: string;
        description: string;
        socialLinksTitle: string;
        socialLinks: Array<{ platform: "instagram" | "facebook" | "linkedin" | "tiktok"; url: string; enabled: boolean }>;
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
  const [isUiVisible, setIsUiVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollBehavior = content.global.scrollBehavior;
  const footerEnabled = content.landing?.footer?.enabled ?? true;
  const effectiveUiVisible = scrollBehavior.hideOnScrollDown ? isUiVisible : true;

  useEffect(() => {
    if (isCmsRoute) {
      return;
    }

    if (!scrollBehavior.hideOnScrollDown) {
      return;
    }

    function handleScroll() {
      const currentY = window.scrollY;
      const previousY = lastScrollY.current;
      const delta = currentY - previousY;

      if (currentY <= 10) {
        setIsUiVisible(true);
      } else if (currentY > scrollBehavior.scrollThreshold && delta > 2) {
        setIsUiVisible(false);
      } else if (delta < -2) {
        setIsUiVisible(true);
      }

      lastScrollY.current = currentY;
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCmsRoute, scrollBehavior.hideOnScrollDown, scrollBehavior.scrollThreshold]);

  if (isCmsRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar
        brandName={content.global.brandName}
        headerLogo={content.global.headerLogo}
        navItems={content.global.navigation}
        ctaLabel={content.global.navbarCtaLabel}
        ctaHref={content.global.navbarCtaHref}
        isVisible={effectiveUiVisible}
        transitionDuration={scrollBehavior.transitionDuration}
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
      <FloatingContactButtons
        whatsapp={content.global.whatsappButton}
        call={content.global.callButton}
        isVisible={effectiveUiVisible}
        transitionDuration={scrollBehavior.transitionDuration}
      />
    </>
  );
}
