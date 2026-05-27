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
    <section id="contact" className="brand-orbit scroll-mt-24 py-18 sm:py-24">
      <Container className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
        <AnimatedSection className="brand-panel relative overflow-hidden p-7 sm:p-9">
          <div className="relative z-10">
            <span className="brand-rule mb-5" />
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#dadada] sm:text-lg">{section.description}</p>
            <div className="mt-7">
              <ContactForm config={section} />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="space-y-5" delay={0.06}>
          <div className="brand-card p-6">
            <h3 className="text-lg font-semibold text-white">{global.footer.contactTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#dadada]">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#d8c7a3]" />
                <a href={`mailto:${global.footer.contactEmail}`} className="transition-colors hover:text-[#d8c7a3]">
                  {global.footer.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#d8c7a3]" />
                <a href={`tel:${global.footer.contactPhone}`} className="transition-colors hover:text-[#d8c7a3]">
                  {global.footer.contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#d8c7a3]" />
                {global.footer.contactLocation}
              </li>
            </ul>
          </div>

          <div className="brand-card p-6 text-sm leading-relaxed text-[#dadada]">
            {global.footer.contactDescription}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
