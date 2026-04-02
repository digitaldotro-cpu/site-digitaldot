import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = buildMetadata({
  title: "Contactează-ne",
  path: "/contacteaza-ne",
  description:
    "Contactează echipa Digital Dot pentru social media management, producție foto-video, strategie de marketing și campanii orientate pe rezultate.",
});

export default async function ContactPage() {
  const content = await getSiteContent();
  const page = content.contactPage;

  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {page.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#c7cdd1]">{page.heroDescription}</p>
        </Container>
      </section>

      <section className="pb-16">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#273840] bg-[#10171b] p-7 sm:p-10">
            <h2 className="text-2xl font-semibold text-white">{page.formTitle}</h2>
            <p className="mt-3 text-sm text-[#bfc5c9]">{page.formDescription}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.7rem] border border-[#273840] bg-[#10171b] p-6">
              <h3 className="text-xl font-semibold text-white">{page.contactTitle}</h3>
              <ul className="mt-5 space-y-4 text-sm text-[#c7cdd1]">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                  {page.contactEmail}
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                  {page.contactPhone}
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                  {page.contactLocation}
                </li>
              </ul>
            </div>

            <div className="rounded-[1.7rem] border border-[#273840] bg-[#10171b] p-6">
              <h3 className="text-xl font-semibold text-white">{page.trustTitle}</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#c7cdd1]">
                {page.trustItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
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
