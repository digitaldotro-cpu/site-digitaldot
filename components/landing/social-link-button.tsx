import { Facebook, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamSocialPlatform = "facebook" | "linkedin" | "instagram";

type SocialLinkButtonProps = {
  platform: TeamSocialPlatform;
  url: string;
  memberName: string;
  emphasized?: boolean;
};

const iconByPlatform = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
} as const;

const labelByPlatform = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  instagram: "Instagram",
} as const;

export function SocialLinkButton({
  platform,
  url,
  memberName,
  emphasized = false,
}: SocialLinkButtonProps) {
  const Icon = iconByPlatform[platform];
  const label = labelByPlatform[platform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} - ${memberName}`}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
        emphasized
          ? "border-[#66fcf1]/70 bg-[#66fcf1]/12 text-[#66fcf1] shadow-[0_0_22px_-12px_rgba(102,252,241,0.85)]"
          : "border-[#2a3e42] bg-[#121820] text-[#c6c6c6] hover:border-[#66fcf1]/55 hover:text-[#66fcf1]",
      )}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

