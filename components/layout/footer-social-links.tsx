import { SocialLinkItem } from "@/components/layout/social-link-item";

type FooterSocialLink = {
  platform: "instagram" | "facebook" | "linkedin" | "tiktok" | "google-business";
  url: string;
  enabled: boolean;
};

type FooterSocialLinksProps = {
  title: string;
  links: FooterSocialLink[];
};

export function FooterSocialLinks({ title, links }: FooterSocialLinksProps) {
  const visibleLinks = links.filter((link) => link.enabled);
  const titleId = "footer-social-links-title";

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <nav aria-labelledby={titleId}>
      <h3 id={titleId} className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {visibleLinks.map((link) => (
          <SocialLinkItem key={`${link.platform}-${link.url}`} platform={link.platform} url={link.url} />
        ))}
      </div>
    </nav>
  );
}
