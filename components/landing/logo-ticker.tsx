import type { SiteContent } from "@/lib/site-content-schema";
import { PartnerLogoItem } from "@/components/landing/partner-logo-item";

type PartnerLogo = SiteContent["landing"]["partnersSection"]["logos"][number];

type LogoTickerProps = {
  logos: PartnerLogo[];
  direction: SiteContent["landing"]["partnersSection"]["tickerDirection"];
  speed: SiteContent["landing"]["partnersSection"]["tickerSpeed"];
  pauseOnHover: boolean;
};

export function LogoTicker({
  logos,
  direction,
  speed,
  pauseOnHover,
}: LogoTickerProps) {
  if (logos.length === 0) {
    return null;
  }

  const visibleLogos = logos.filter((logo) => logo.enabled !== false);
  const track = [...visibleLogos, ...visibleLogos];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#276864]/35 bg-[#c6c6c6]/10">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#c6c6c6]/10 to-transparent sm:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#c6c6c6]/10 to-transparent sm:w-14" />

      <div className={`partner-ticker ${pauseOnHover ? "is-paused-on-hover" : ""}`}>
        <div
          className="partner-ticker-track"
          style={{
            animationDuration: `${speed}s`,
            animationDirection: direction === "rtl" ? "normal" : "reverse",
          }}
        >
          {track.map((logo, index) => (
            <PartnerLogoItem key={`${logo.id}-${index}`} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
