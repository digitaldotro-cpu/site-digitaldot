import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FooterSocialLinks } from "@/components/layout/footer-social-links";

type FooterProps = {
  brandName: string;
  logo?: string;
  description: string;
  socialLinksTitle: string;
  socialLinks: Array<{ platform: "instagram" | "facebook" | "linkedin" | "tiktok" | "google-business"; url: string; enabled: boolean }>;
  serviceLinksTitle: string;
  serviceLinks: Array<{ label: string; href: string; enabled: boolean }>;
  resourceLinksTitle: string;
  resourceLinks: Array<{ label: string; href: string; enabled: boolean }>;
  regionalLinksTitle: string;
  regionalLinks: Array<{ label: string; href: string; enabled: boolean }>;
  legalLinksTitle: string;
  legalLinks: Array<{ label: string; href: string }>;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  copyrightTemplate: string;
};

export function Footer({
  brandName,
  logo,
  description,
  socialLinksTitle,
  socialLinks,
  serviceLinksTitle,
  serviceLinks,
  resourceLinksTitle,
  resourceLinks,
  regionalLinksTitle,
  regionalLinks,
  legalLinksTitle,
  legalLinks,
  contactTitle,
  contactEmail,
  contactPhone,
  contactLocation,
  copyrightTemplate,
}: FooterProps) {
  const copyright = copyrightTemplate.replace(
    "{year}",
    String(new Date().getFullYear()),
  );

  return (
    <footer className="brand-orbit relative mt-16 overflow-hidden border-t border-[#1f2a2d] bg-[#0b0c10]" aria-label="Footer Digital Dot">
      <Container className="relative z-10 grid gap-10 py-18 md:grid-cols-2 lg:grid-cols-8">
        <div className="lg:col-span-2">
          {logo ? (
            <Image
              src={logo}
              alt={brandName}
              width={300}
              height={76}
              loading="lazy"
              decoding="async"
              className="brand-wordmark h-20 w-auto max-w-full object-contain"
            />
          ) : (
            <p className="text-lg font-semibold text-white">{brandName}</p>
          )}
          <p className="mt-6 max-w-xs border-l border-[#276864]/55 pl-5 text-sm leading-relaxed text-[#dadada]">
            {description}
          </p>
        </div>

        <div>
          <FooterSocialLinks title={socialLinksTitle} links={socialLinks} />
        </div>

        <nav aria-labelledby="footer-services-title">
          <h3 id="footer-services-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
            {serviceLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#dadada]">
            {serviceLinks.filter((link) => link.enabled !== false).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#d8c7a3]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-regional-title">
          <h3 id="footer-regional-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
            {regionalLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#dadada]">
            {regionalLinks.filter((link) => link.enabled !== false).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#d8c7a3]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-resources-title">
          <h3 id="footer-resources-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
            {resourceLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#dadada]">
            {resourceLinks.filter((link) => link.enabled !== false).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#d8c7a3]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal-title">
          <h3 id="footer-legal-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
            {legalLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#dadada]">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#d8c7a3]">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 id="footer-contact-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
            {contactTitle}
          </h3>
          <address aria-labelledby="footer-contact-title" className="mt-4 space-y-2 text-sm not-italic text-[#dadada]">
            <p>
              Email: <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-[#d8c7a3]">{contactEmail}</a>
            </p>
            <p>
              Telefon: <a href={`tel:${contactPhone}`} className="transition-colors hover:text-[#d8c7a3]">{contactPhone}</a>
            </p>
            <p>{contactLocation}</p>
          </address>
        </div>
      </Container>
      <div className="relative z-10 border-t border-[#1f2a2d] py-4 text-center text-xs text-[#8f979d]">
        {copyright}
      </div>
    </footer>
  );
}
