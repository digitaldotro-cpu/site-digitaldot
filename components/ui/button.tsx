import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#66fcf1] text-[#0b0c10] shadow-[0_18px_45px_-32px_rgba(102,252,241,0.9)] hover:-translate-y-0.5 hover:bg-[#8dfff7]",
  secondary:
    "border border-[#276864]/60 bg-[#101418]/40 text-white hover:border-[#66fcf1]/55 hover:bg-[#101418]",
  ghost: "bg-transparent border border-[#1f2a2d] text-[#dadada] hover:border-[#276864]/75 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-6 text-sm sm:text-base",
  lg: "h-12 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & React.ComponentPropsWithoutRef<typeof Link>;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
