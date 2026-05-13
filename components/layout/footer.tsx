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
    <footer className="mt-16 border-t border-[#1e2a30] bg-[#0a0d10]">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
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

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
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
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
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
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {legalLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {contactTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            <li>
              Email: <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-[#66fcf1]">{contactEmail}</a>
            </li>
            <li>
              Telefon: <a href={`tel:${contactPhone}`} className="transition-colors hover:text-[#66fcf1]">{contactPhone}</a>
            </li>
            <li>{contactLocation}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-[#1f2a31] py-4 text-center text-xs text-[#8f979d]">
        {copyright}
      </div>
    </footer>
  );
}
