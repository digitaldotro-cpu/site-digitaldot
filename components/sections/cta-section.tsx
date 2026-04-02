import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

type CtaSectionProps = {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CtaSection({
  title,
  description,
  primaryLabel = "Programează o discuție",
  primaryHref = "/contacteaza-ne",
  secondaryLabel,
  secondaryHref,
}: CtaSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="rounded-[2.2rem] border border-[#2a3a42] bg-[linear-gradient(140deg,#131a1f_0%,#18363a_100%)] px-6 py-12 text-center shadow-[0_35px_80px_-40px_rgba(102,252,241,0.45)] sm:px-10">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#d6d6d6]">{description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
            {secondaryHref && secondaryLabel ? (
              <ButtonLink href={secondaryHref} variant="ghost">
                {secondaryLabel}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
