import Image from "next/image";
import type { SiteContent } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type PartnerLogo = SiteContent["landing"]["partnersSection"]["logos"][number];

type PartnerLogoItemProps = {
  logo: PartnerLogo;
};

export function PartnerLogoItem({ logo }: PartnerLogoItemProps) {
  const isBiggerLogo =
    /artio|cosmetic/i.test(logo.alt) ||
    /logo-no-bg|cosmetic/i.test(logo.src);

  const content = (
    <div className="flex h-16 min-w-[140px] items-center justify-center px-5 sm:h-20 sm:min-w-[170px] sm:px-6">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={220}
        height={72}
        loading="lazy"
        decoding="async"
        className={cn(
          "w-auto object-contain transition duration-300",
          "max-h-9 sm:max-h-10",
          "opacity-90 grayscale-0 md:opacity-55 md:grayscale md:hover:opacity-95 md:hover:grayscale-0",
          isBiggerLogo && "max-h-11 sm:max-h-12 md:max-h-12",
        )}
      />
    </div>
  );

  if (!logo.url) {
    return content;
  }

  return (
    <a
      href={logo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.alt}
      className={cn("inline-flex", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#276864]")}
    >
      {content}
    </a>
  );
}
