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
        socialLinks: Array<{ platform: "instagram" | "facebook" | "linkedin" | "tiktok" | "google-business"; url: string; enabled: boolean }>;
        serviceLinksTitle: string;
        serviceLinks: Array<{ label: string; href: string; enabled: boolean }>;
        resourceLinksTitle: string;
        resourceLinks: Array<{ label: string; href: string; enabled: boolean }>;
        legalLinksTitle: string;
        legalLinks: Array<{ label: string; href: string }>;
        regionalLinksTitle: string;
        regionalLinks: Array<{ label: string; href: string; enabled: boolean }>;
        contactTitle: string;
        contactEmail: string;
        contactPhone: string;
        contactLocation: string;
        copyrightTemplate: string;
      };
    };
  };
};

function useScrollChromeVisibility(enabled: boolean) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const suppressHideUntilRef = useRef(0);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      suppressHideUntilRef.current = window.performance.now() + 450;
      isVisibleRef.current = true;
      lastScrollYRef.current = Math.max(window.scrollY, 0);
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  useEffect(() => {
    let rafId: number | null = null;

    function resetVisibilityForHashChange() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        suppressHideUntilRef.current = window.performance.now() + 450;
        isVisibleRef.current = true;
        lastScrollYRef.current = Math.max(window.scrollY, 0);
        setIsVisible(true);
        rafId = null;
      });
    }

    window.addEventListener("hashchange", resetVisibilityForHashChange);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("hashchange", resetVisibilityForHashChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      const rafId = window.requestAnimationFrame(() => {
        isVisibleRef.current = true;
        setIsVisible(true);
      });

      return () => window.cancelAnimationFrame(rafId);
    }

    let rafId: number | null = null;

    function updateVisibility(nextVisible: boolean) {
      if (isVisibleRef.current === nextVisible) {
        return;
      }

      isVisibleRef.current = nextVisible;
      setIsVisible(nextVisible);
    }

    function measureScroll() {
      const currentScrollY = Math.max(window.scrollY, 0);
      const delta = currentScrollY - lastScrollYRef.current;
      const isAutomaticRouteScroll = window.performance.now() < suppressHideUntilRef.current;

      if (isAutomaticRouteScroll) {
        updateVisibility(true);
      } else if (currentScrollY < 20) {
        updateVisibility(true);
      } else if (delta > 10) {
        updateVisibility(false);
      } else if (delta < -10) {
        updateVisibility(true);
      }

      lastScrollYRef.current = currentScrollY;
      rafId = null;
    }

    function handleScroll() {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(measureScroll);
    }

    lastScrollYRef.current = Math.max(window.scrollY, 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled]);

  return isVisible;
}

export function AppShell({ children, content }: AppShellProps) {
  const pathname = usePathname();
  const isCmsRoute = pathname.startsWith("/panou-control");
  const scrollBehavior = content.global.scrollBehavior;
  const isScrollChromeVisible = useScrollChromeVisibility(
    scrollBehavior.hideOnScrollDown,
  );

  if (isCmsRoute) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#276864] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#d8c7a3] focus:shadow-lg"
      >
        Sari la conținut
      </a>
      <Navbar
        brandName={content.global.brandName}
        headerLogo={content.global.headerLogo}
        navItems={content.global.navigation}
        ctaLabel={content.global.navbarCtaLabel}
        ctaHref={content.global.navbarCtaHref}
        isVisible={isScrollChromeVisible}
        transitionDuration={scrollBehavior.transitionDuration}
      />
      <main id="main-content">{children}</main>
      <Footer
        brandName={content.global.brandName}
        logo={content.global.footer.logo}
        description={content.global.footer.description}
        socialLinksTitle={content.global.footer.socialLinksTitle}
        socialLinks={content.global.footer.socialLinks}
        serviceLinksTitle={content.global.footer.serviceLinksTitle}
        serviceLinks={content.global.footer.serviceLinks}
        resourceLinksTitle={content.global.footer.resourceLinksTitle}
        resourceLinks={content.global.footer.resourceLinks}
        regionalLinksTitle={content.global.footer.regionalLinksTitle}
        regionalLinks={content.global.footer.regionalLinks}
        legalLinksTitle={content.global.footer.legalLinksTitle}
        legalLinks={content.global.footer.legalLinks}
        contactTitle={content.global.footer.contactTitle}
        contactEmail={content.global.footer.contactEmail}
        contactPhone={content.global.footer.contactPhone}
        contactLocation={content.global.footer.contactLocation}
        copyrightTemplate={content.global.footer.copyrightTemplate}
      />
      <FloatingContactButtons
        whatsapp={content.global.whatsappButton}
        call={content.global.callButton}
        isVisible={isScrollChromeVisible}
        transitionDuration={scrollBehavior.transitionDuration}
      />
    </>
  );
}
