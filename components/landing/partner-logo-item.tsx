import Image from "next/image";
import type { SiteContent } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type PartnerLogo = SiteContent["landing"]["partnersSection"]["logos"][number];

type PartnerLogoItemProps = {
  logo: PartnerLogo;
};

export function PartnerLogoItem({ logo }: PartnerLogoItemProps) {
  const content = (
    <div className="flex h-16 min-w-[140px] items-center justify-center px-5 sm:h-20 sm:min-w-[170px] sm:px-6">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={220}
        height={72}
        unoptimized
        className="max-h-9 w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:max-h-10"
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
      className={cn("inline-flex", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1]")}
    >
      {content}
    </a>
  );
}
