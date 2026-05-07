"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  brandName: string;
  headerLogo?: string;
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
};

export function Navbar({ brandName, headerLogo, navItems, ctaLabel, ctaHref }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    function handleHashChange() {
      setActiveHash(window.location.hash);
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0c10]/85 backdrop-blur-lg">
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-2">
            {headerLogo ? (
              <>
                <Image
                  src={headerLogo}
                  alt={brandName}
                  width={160}
                  height={44}
                  unoptimized
                  className="h-10 w-auto object-contain"
                />
                <span className="sr-only">{brandName}</span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-[#66fcf1] shadow-[0_0_20px_0_rgba(102,252,241,0.7)]" />
                <span className="text-lg font-semibold tracking-tight text-white">{brandName}</span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = item.href.startsWith("#")
                ? (activeHash || "#hero") === item.href
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#122126] text-[#66fcf1]"
                      : "text-[#c5cad0] hover:text-white",
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

          <button
            type="button"
            onClick={() => setIsOpen((state) => !state)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2c3d44] text-white lg:hidden"
            aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-overlay"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-20 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-[#0b0c10]/55 backdrop-blur-[1px]" />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute left-4 right-4 top-4 rounded-3xl border border-[#276864]/40 bg-[rgba(11,12,16,0.94)] p-4 shadow-[0_0_36px_-16px_rgba(102,252,241,0.35)] backdrop-blur-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const active = item.href.startsWith("#")
                    ? (activeHash || "#hero") === item.href
                    : item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-[#122126] text-[#66fcf1]"
                          : "bg-[#11181d] text-[#d0d3d5] hover:text-white",
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
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
