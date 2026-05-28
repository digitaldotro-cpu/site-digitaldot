import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c7a3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "border border-[#276864] bg-[#276864] text-[#d8c7a3] shadow-[0_18px_45px_-34px_rgba(39,104,100,0.65)] hover:-translate-y-0.5 hover:border-[#d8c7a3]/70 hover:bg-[#2f7773] hover:text-[#d8c7a3]",
  secondary:
    "border border-[#276864]/55 bg-[#101418]/40 text-white hover:border-[#276864] hover:bg-[#276864] hover:text-[#d8c7a3]",
  ghost: "bg-transparent border border-[#1f2a2d] text-[#dadada] hover:border-[#276864]/75 hover:text-[#d8c7a3]",
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
