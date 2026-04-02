import { cn } from "@/lib/utils";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  action?: React.ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  action,
}: SectionShellProps) {
  return (
    <header className={cn("flex items-end justify-between gap-6", className)}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#66fcf1]">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-3xl font-semibold tracking-tight text-white sm:text-4xl",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="hidden shrink-0 md:block">{action}</div> : null}
    </header>
  );
}
