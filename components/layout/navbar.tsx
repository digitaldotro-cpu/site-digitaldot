"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
};

export function Navbar({ brandName, headerLogo, navItems, ctaLabel }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
              const active =
                item.href === "/"
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
            <ButtonLink href="/contacteaza-ne" size="sm">
              {ctaLabel}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((state) => !state)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2c3d44] text-white lg:hidden"
            aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#0f1418] pb-5 lg:hidden">
          <Container>
            <nav className="mt-4 flex flex-col gap-2">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium",
                      active
                        ? "bg-[#122126] text-[#66fcf1]"
                        : "bg-[#11181d] text-[#d0d3d5]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <ButtonLink
                href="/contacteaza-ne"
                size="sm"
                className="mt-1"
                onClick={() => setIsOpen(false)}
              >
                {ctaLabel}
              </ButtonLink>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
