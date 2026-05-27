import type { ComponentType, SVGProps } from "react";
import { Building2, Camera, MapPin, MessageCircle } from "lucide-react";

type SocialPlatform = "instagram" | "facebook" | "linkedin" | "tiktok" | "google-business";

type SocialLinkItemProps = {
  platform: SocialPlatform;
  url: string;
};

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M15.96 3c.12 1.05.71 2.03 1.59 2.76.88.73 1.97 1.12 3.1 1.11v3.1a8.26 8.26 0 0 1-3.44-.75v6.2c0 3.63-2.95 6.58-6.58 6.58S4.05 19.05 4.05 15.42c0-3.63 2.95-6.58 6.58-6.58.32 0 .64.03.95.08v3.2a3.4 3.4 0 0 0-.95-.14 3.44 3.44 0 1 0 3.43 3.44V3h1.9Z"
      />
    </svg>
  );
}

const iconByPlatform: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  instagram: Camera,
  facebook: MessageCircle,
  linkedin: Building2,
  tiktok: TikTokIcon,
  "google-business": MapPin,
};

const labelByPlatform: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  "google-business": "Google Business",
};

export function SocialLinkItem({ platform, url }: SocialLinkItemProps) {
  const Icon = iconByPlatform[platform];
  const label = labelByPlatform[platform];

  return (
    <a
      href={url}
      aria-label={`${label} Digital Dot`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[#1f2a2d] bg-[#101418] px-4 py-2 text-sm text-[#dadada] transition duration-300 hover:border-[#276864] hover:text-[#66fcf1]"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}
