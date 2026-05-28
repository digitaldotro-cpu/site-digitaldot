"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  enabled: boolean;
};

type NavbarProps = {
  brandName: string;
  headerLogo?: string;
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
  isVisible?: boolean;
  transitionDuration?: number;
};

function normalizeNavHref(href: string) {
  if (!href) {
    return "/";
  }

  if (href.startsWith("#")) {
    return `/${href}`;
  }

  return href;
}

export function Navbar({
  brandName,
  headerLogo,
  navItems,
  ctaLabel,
  ctaHref,
  isVisible = true,
  transitionDuration = 300,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const activeHashRef = useRef("");
  const visibleNavItems = useMemo(
    () => navItems.filter((item) => item.enabled !== false),
    [navItems],
  );
  const logoHref = "/";

  function isActiveNavLink(href: string) {
    const normalizedHref = normalizeNavHref(href);
    const [rawPath, rawHash] = normalizedHref.split("#");
    const targetPath = rawPath || "/";
    const targetHash = rawHash ? `#${rawHash}` : "";
    const isPathMatch = pathname === targetPath;
    const isCaseStudiesPath = pathname === "/case-studies" || pathname.startsWith("/case-studies/");

    if (targetHash === "#case-studies" && isCaseStudiesPath) {
      return true;
    }

    if (!targetHash) {
      return targetPath === "/"
        ? pathname === "/" && (!activeHash || activeHash === "#hero")
        : pathname.startsWith(targetPath);
    }

    if (!isPathMatch) {
      return false;
    }

    const currentHash = activeHash || (pathname === "/" ? "#hero" : "");
    return currentHash === targetHash;
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    flushSync(() => {
      setIsOpen(false);
    });

    if (pathname === "/") {
      event.preventDefault();
      window.history.pushState(window.history.state, "", "/");
      activeHashRef.current = "#hero";
      setActiveHash("#hero");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }

  useEffect(() => {
    function handleHashChange() {
      activeHashRef.current = window.location.hash;
      setActiveHash(window.location.hash);
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sectionHashes = [
      "#hero",
      ...visibleNavItems
        .map((item) => normalizeNavHref(item.href).split("#")[1])
        .filter((hash): hash is string => Boolean(hash))
        .map((hash) => `#${hash}`),
    ];
    const uniqueHashes = Array.from(new Set(sectionHashes));
    let rafId: number | null = null;

    function updateActiveSection() {
      const threshold = window.scrollY + Math.min(window.innerHeight * 0.38, 360);
      let currentHash = "#hero";

      uniqueHashes.forEach((hash) => {
        const section = document.getElementById(hash.slice(1));
        if (!section) {
          return;
        }

        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= threshold) {
          currentHash = hash;
        }
      });

      if (activeHashRef.current !== currentHash) {
        activeHashRef.current = currentHash;
        setActiveHash(currentHash);
      }
    }

    function handleScroll() {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    }

    const sections = uniqueHashes
      .map((hash) => document.getElementById(hash.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(handleScroll, {
            root: null,
            rootMargin: "-12% 0px -58% 0px",
            threshold: [0, 0.1, 0.35, 0.65, 1],
          });

    updateActiveSection();
    if (observer) {
      sections.forEach((section) => observer.observe(section));
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("resize", handleScroll);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      observer?.disconnect();
      if (!observer) {
        window.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname, visibleNavItems]);

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    if (!isOpen) {
      delete root.dataset.mobileNavOpen;
      body.style.overflow = "";

      return;
    }

    if (window.innerWidth >= 1024) {
      return;
    }

    const previousBodyOverflow = body.style.overflow;
    root.dataset.mobileNavOpen = "true";
    body.style.overflow = "hidden";

    return () => {
      delete root.dataset.mobileNavOpen;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const shouldShowHeader = isOpen || isVisible;

  return (
    <>
      <div className="h-20" aria-hidden />
      <header
        aria-label="Header principal Digital Dot"
        className={cn(
          "scroll-chrome-header fixed inset-x-0 top-0 z-50 border-b border-[#1f2a2d]/80 bg-[rgba(11,12,16,0.96)] transition-[transform,background-color,border-color]",
          shouldShowHeader
            ? "translate-y-0 pointer-events-auto"
            : "-translate-y-full pointer-events-none",
        )}
        style={{ transitionDuration: `${transitionDuration}ms` }}
      >
        <Container>
          <div className="hidden h-20 items-center justify-between gap-8 lg:flex">
            <Link
              href={logoHref}
              onClick={handleLogoClick}
              aria-label="Digital Dot - Acasă"
              className="group inline-flex min-h-12 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#276864]"
            >
              {headerLogo ? (
                <>
                  <Image
                    src={headerLogo}
                    alt=""
                    width={178}
                    height={100}
                    loading="eager"
                    decoding="async"
                    className="brand-wordmark h-9 w-auto object-contain"
                  />
                  <span className="sr-only">{brandName}</span>
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#276864] shadow-[0_0_20px_0_rgba(39,104,100,0.7)]" />
                  <span className="text-lg font-semibold tracking-tight text-white">{brandName}</span>
                </>
              )}
            </Link>

            <nav aria-label="Navigare principală" className="hidden items-center gap-1.5 lg:flex">
              {visibleNavItems.map((item) => {
                const active = isActiveNavLink(item.href);
                const href = normalizeNavHref(item.href);

                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#dadada] transition-colors",
                      active
                        ? "border-[#276864]/55 bg-[#101418]/60 text-[#d8c7a3]"
                        : "hover:border-[#1f2a2d] hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:block">
              <ButtonLink href={ctaHref} size="sm">
                {ctaLabel}
              </ButtonLink>
            </div>
          </div>

          <div className="grid h-20 grid-cols-2 items-center lg:hidden">
            <Link
              href={logoHref}
              onClick={handleLogoClick}
              aria-label="Digital Dot - Acasă"
              className="group inline-flex min-h-12 min-w-24 items-center justify-start justify-self-start rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#276864]"
            >
              {headerLogo ? (
                <>
                  <Image
                    src={headerLogo}
                    alt=""
                    width={136}
                    height={77}
                    loading="eager"
                    decoding="async"
                    className="brand-wordmark h-7 w-auto object-contain"
                  />
                  <span className="sr-only">{brandName}</span>
                </>
              ) : (
                <span className="text-base font-semibold tracking-tight text-white">{brandName}</span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((state) => !state)}
              className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-[rgba(218,218,218,0.16)] bg-[#1f2a2d] text-[#dadada] transition-colors duration-300 hover:border-[#276864] hover:bg-[#276864] hover:text-[#d8c7a3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#276864]"
              aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-overlay"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>
      </header>

      {isOpen ? (
        <div
          id="mobile-nav-overlay"
          className="fixed inset-x-0 bottom-0 top-20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0b0c10]/86" />
          <div
            className="absolute left-4 right-4 top-4 rounded-2xl border border-[#1f2a2d] bg-[rgba(16,20,24,0.98)] p-4 shadow-[0_24px_70px_-48px_rgba(39,104,100,0.65)]"
            onClick={(event) => event.stopPropagation()}
          >
            <nav aria-label="Navigare principală mobilă" className="flex flex-col gap-2">
              {visibleNavItems.map((item) => {
                const active = isActiveNavLink(item.href);
                const href = normalizeNavHref(item.href);

                return (
                  <Link
                    key={item.href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "border border-[#276864]/50 bg-[#0b0c10] text-[#d8c7a3]"
                        : "bg-[#101418] text-[#dadada] hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <ButtonLink
                href={ctaHref}
                size="sm"
                className="mt-1"
                onClick={() => setIsOpen(false)}
              >
                {ctaLabel}
              </ButtonLink>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
