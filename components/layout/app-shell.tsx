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

export function AppShell({ children, content }: AppShellProps) {
  const pathname = usePathname();
  const isCmsRoute = pathname.startsWith("/panou-control");
  const [isUiVisible, setIsUiVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollBehavior = content.global.scrollBehavior;
  const effectiveUiVisible = scrollBehavior.hideOnScrollDown ? isUiVisible : true;
  const scrollStorageKey = typeof window !== "undefined"
    ? `digitaldot:scroll:${window.location.pathname}${window.location.search}${window.location.hash}`
    : "";

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

  useEffect(() => {
    if (isCmsRoute) {
      return;
    }

    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    const hasHistoryState = window.history.state?.__NA?.tree;

    if (!isReload || hasHistoryState) {
      return;
    }

    const rawPosition = sessionStorage.getItem(scrollStorageKey);
    const savedPosition = rawPosition ? Number.parseInt(rawPosition, 10) : Number.NaN;

    if (!Number.isFinite(savedPosition) || savedPosition < 0) {
      return;
    }

    window.history.scrollRestoration = "manual";

    const restore = () => {
      window.scrollTo({ top: savedPosition, left: 0, behavior: "auto" });
    };

    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
      setTimeout(restore, 120);
    });

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, [isCmsRoute, scrollStorageKey]);

  useEffect(() => {
    if (isCmsRoute) {
      return;
    }

    let rafId: number | null = null;

    const savePosition = () => {
      sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    };

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        savePosition();
        rafId = null;
      });
    };

    const handleBeforeUnload = () => {
      savePosition();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      savePosition();
    };
  }, [isCmsRoute, scrollStorageKey]);

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
        contactPhone={content.global.footer.contactPhone}
        isVisible={effectiveUiVisible}
        transitionDuration={scrollBehavior.transitionDuration}
      />
      <main>{children}</main>
      <Footer
        brandName={content.global.brandName}
        logo={content.global.footer.logo}
        description={content.global.footer.description}
        socialLinksTitle={content.global.footer.socialLinksTitle}
        socialLinks={content.global.footer.socialLinks}
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
        isVisible={effectiveUiVisible}
        transitionDuration={scrollBehavior.transitionDuration}
      />
    </>
  );
}
