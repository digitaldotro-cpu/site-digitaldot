import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ContactForm } from "@/components/forms/contact-form";
import type { SiteContent } from "@/lib/site-content-schema";

type ContactSectionProps = {
  section: SiteContent["landing"]["contact"];
  global: SiteContent["global"];
};

export function ContactSection({ section, global }: ContactSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="contact" className="scroll-mt-24 py-18 sm:py-24">
      <Container className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
        <AnimatedSection className="brand-orbit relative overflow-hidden rounded-2xl border border-[#1f2a2d] bg-[linear-gradient(145deg,rgba(16,20,24,0.96),rgba(11,12,16,0.99))] p-7 shadow-[0_24px_80px_-60px_rgba(102,252,241,0.7)] sm:p-9">
          <div className="relative z-10">
          <div className="mb-4 h-0.5 w-16 bg-[#d8c7a3]" />
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#dadada] sm:text-lg">{section.description}</p>
          <div className="mt-7">
            <ContactForm config={section} />
          </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="space-y-5" delay={0.06}>
          <div className="rounded-xl border border-[#1f2a2d] bg-[#101418]/85 p-6">
            <h3 className="text-lg font-semibold text-white">{global.footer.contactTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#dadada]">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                <a href={`mailto:${global.footer.contactEmail}`} className="transition-colors hover:text-[#66fcf1]">
                  {global.footer.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                <a href={`tel:${global.footer.contactPhone}`} className="transition-colors hover:text-[#66fcf1]">
                  {global.footer.contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#66fcf1]" />
                {global.footer.contactLocation}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#1f2a2d] bg-[#101418]/85 p-6 text-sm text-[#dadada]">
            {global.footer.contactDescription}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
