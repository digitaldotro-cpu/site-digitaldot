import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  label: string;
  href: string;
  className?: string;
  external?: boolean;
};

export function CTAButton({ label, href, className, external = false }: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center justify-center rounded-full border border-[rgba(218,218,218,0.16)] bg-[#1f2a2d] px-7 text-sm font-semibold uppercase tracking-[0.08em] text-[#dadada] transition-[transform,background-color,border-color,color] hover:-translate-y-0.5 hover:border-[#276864] hover:bg-[#276864] hover:text-[#d8c7a3]",
        className,
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {label}
      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
