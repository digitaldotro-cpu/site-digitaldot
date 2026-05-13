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
        <AnimatedSection className="rounded-[2rem] border border-[#2a3b42] bg-[#0f1519]/85 p-7 sm:p-9">
          <h2 className="text-3xl font-semibold text-white">{section.title}</h2>
          <p className="mt-3 max-w-2xl text-[#c6c6c6]">{section.description}</p>
          <div className="mt-7">
            <ContactForm config={section} />
          </div>
        </AnimatedSection>

        <AnimatedSection className="space-y-5" delay={0.06}>
          <div className="rounded-3xl border border-[#2a3b42] bg-[#0f1519]/85 p-6">
            <h3 className="text-lg font-semibold text-white">{global.footer.contactTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#c6c6c6]">
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

          <div className="rounded-3xl border border-[#2a3b42] bg-[#0f1519]/85 p-6 text-sm text-[#c6c6c6]">
            {global.footer.contactDescription}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
