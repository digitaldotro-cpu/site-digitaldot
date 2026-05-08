import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

type LegalContactCardProps = {
  contactCard: SiteContent["privacyPolicy"]["contactCard"];
};

export function LegalContactCard({ contactCard }: LegalContactCardProps) {
  if (!contactCard.enabled) {
    return null;
  }

  const visibleLinks = contactCard.links.filter((link) => link.enabled);

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-4xl">
        <AnimatedSection className="rounded-[1.9rem] border border-[#66fcf1]/28 bg-[linear-gradient(145deg,rgba(18,27,35,0.88),rgba(10,13,17,0.94))] p-6 shadow-[0_0_42px_-30px_rgba(102,252,241,0.55)] backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">{contactCard.title}</h2>
          <dl className="mt-5 space-y-3 text-[#c6c6c6]">
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#84d4ce]">Email</dt>
              <dd>
                <Link
                  href={`mailto:${contactCard.email}`}
                  className="text-[#66fcf1] transition hover:text-[#95fff8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]"
                >
                  {contactCard.email}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#84d4ce]">Companie</dt>
              <dd>{contactCard.companyName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#84d4ce]">Locație</dt>
              <dd>{contactCard.location}</dd>
            </div>
          </dl>

          {visibleLinks.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {visibleLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="rounded-full border border-[#2b4650] px-4 py-2 text-sm text-[#c6c6c6] transition hover:border-[#66fcf1]/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </AnimatedSection>
      </Container>
    </section>
  );
}
