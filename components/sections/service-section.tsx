import { CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceSectionProps = {
  title: string;
  description: string;
  bullets: string[];
  href: string;
  className?: string;
};

export function ServiceSection({
  title,
  description,
  bullets,
  href,
  className,
}: ServiceSectionProps) {
  return (
    <AnimatedSection
      className={cn(
        "rounded-[2rem] border border-[#27363d] bg-[linear-gradient(140deg,#0f1317_20%,#111f22_100%)] p-7 shadow-[0_30px_70px_-45px_rgba(102,252,241,0.4)] sm:p-10",
        className,
      )}
    >
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 max-w-3xl text-[#c6c6c6]">{description}</p>
      <ul className="mt-6 grid gap-3 text-sm text-[#d9d9d9] sm:grid-cols-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href={href} variant="secondary" className="mt-8">
        Vezi serviciul
      </ButtonLink>
    </AnimatedSection>
  );
}
