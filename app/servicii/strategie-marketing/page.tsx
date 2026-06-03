import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";

const path = "/servicii/strategie-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const service = content.landing.services.items.find((item) => item.title === "Strategie de Marketing");

  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: "Strategie de Marketing | Digital Dot",
    fallbackDescription: service?.description || "Audit, prioritizare și direcție clară conectată la obiective reale de business.",
  });
}

export default async function StrategyMarketingPage() {
  const content = await getSiteContent();
  const service = content.landing.services.items.find((item) => item.title === "Strategie de Marketing");

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Servicii", href: "/#services" },
          { label: "Strategie de Marketing", href: path },
        ]}
      />
      <main className="py-18 sm:py-24">
        <Container>
          <section className="brand-panel p-8 sm:p-10" aria-labelledby="strategy-service-title">
            <span className="brand-rule mb-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
              Serviciu Digital Dot
            </p>
            <h1 id="strategy-service-title" className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {service?.title || "Strategie de Marketing"}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
              {service?.description || "Audit, prioritizare și direcție clară pe 90 de zile, conectată la obiective reale de business."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
              <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
