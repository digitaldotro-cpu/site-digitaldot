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
    <footer className="mt-16 border-t border-[#1e2a30] bg-[#0a0d10]" aria-label="Footer Digital Dot">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-7">
        <div>
          {logo ? (
            <Image src={logo} alt={brandName} width={180} height={50} unoptimized className="h-10 w-auto object-contain" />
          ) : (
            <p className="text-lg font-semibold text-white">{brandName}</p>
          )}
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#b7bcc0]">
            {description}
          </p>
        </div>

        <div>
          <FooterSocialLinks title={socialLinksTitle} links={socialLinks} />
        </div>

        <nav aria-labelledby="footer-services-title">
          <h3 id="footer-services-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {serviceLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            {serviceLinks.filter((link) => link.enabled !== false).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#66fcf1]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-regional-title">
          <h3 id="footer-regional-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {regionalLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            {regionalLinks.filter((link) => link.enabled !== false).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#66fcf1]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-resources-title">
          <h3 id="footer-resources-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {resourceLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            {resourceLinks.filter((link) => link.enabled !== false).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#66fcf1]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal-title">
          <h3 id="footer-legal-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {legalLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 id="footer-contact-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {contactTitle}
          </h3>
          <address aria-labelledby="footer-contact-title" className="mt-4 space-y-2 text-sm not-italic text-[#c3c7ca]">
            <p>
              Email: <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-[#66fcf1]">{contactEmail}</a>
            </p>
            <p>
              Telefon: <a href={`tel:${contactPhone}`} className="transition-colors hover:text-[#66fcf1]">{contactPhone}</a>
            </p>
            <p>{contactLocation}</p>
          </address>
        </div>
      </Container>
      <div className="border-t border-[#1f2a31] py-4 text-center text-xs text-[#8f979d]">
        {copyright}
      </div>
    </footer>
  );
}
