import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = buildMetadata({
  title: "Producție Foto & Video",
  path: "/servicii/productie-foto-video",
  description:
    "Producție foto-video premium pentru reclame, social media și website, orientată spre conversie.",
});

export default async function ProductieFotoVideoPage() {
  const content = await getSiteContent();
  const page = content.services.photoVideo;

  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <p className="inline-flex rounded-full border border-[#2a3c43] bg-[#10171b] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">
            {page.heroBadge}
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {page.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#c8ced2]">{page.heroDescription}</p>
          <ButtonLink href="/contacteaza-ne" className="mt-8">
            {page.heroCtaLabel}
          </ButtonLink>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={page.sectionOneTitle} />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {page.sectionOneItems.map((item) => (
              <li key={item} className="rounded-2xl border border-[#27373f] bg-[#10171b] p-5 text-[#d1d6da]">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={page.sectionTwoTitle} />
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {page.sectionTwoItems.map((step, index) => (
              <li key={step} className="rounded-2xl border border-[#27373f] bg-[#10171b] p-5 text-[#d1d6da]">
                <p className="text-sm font-semibold text-[#66fcf1]">Etapa {index + 1}</p>
                <p className="mt-2">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={page.sectionThreeTitle} />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {page.sectionThreeItems.map((item) => (
              <li key={item} className="rounded-2xl border border-[#27373f] bg-[#10171b] p-5 text-[#d1d6da]">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={page.sectionFourTitle} />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {page.sectionFourItems.map((item) => (
              <li key={item} className="rounded-2xl border border-[#27373f] bg-[#10171b] p-5 text-[#d1d6da]">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection
        title={page.finalCta.title}
        description={page.finalCta.description}
        primaryLabel={page.finalCta.primaryLabel}
        primaryHref={page.finalCta.primaryHref}
        secondaryLabel={page.finalCta.secondaryLabel}
        secondaryHref={page.finalCta.secondaryHref}
      />
    </>
  );
}
