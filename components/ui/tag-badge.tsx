import { cn } from "@/lib/utils";

type TagBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function TagBadge({ children, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#2f3f47] bg-[#11161a] px-3 py-1 text-xs font-semibold tracking-wide text-[#66fcf1]",
        className,
      )}
    >
      {children}
    </span>
  );
}
