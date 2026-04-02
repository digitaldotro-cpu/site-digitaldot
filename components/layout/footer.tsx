import Link from "next/link";
import { Container } from "@/components/ui/container";

type FooterProps = {
  brandName: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: Array<{ label: string; href: string }>;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  copyrightTemplate: string;
};

export function Footer({
  brandName,
  description,
  quickLinksTitle,
  quickLinks,
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
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{brandName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#b7bcc0]">
            {description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
            {quickLinksTitle}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#c3c7ca]">
            {quickLinks.map((link) => (
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
            <li>Email: {contactEmail}</li>
            <li>Telefon: {contactPhone}</li>
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
