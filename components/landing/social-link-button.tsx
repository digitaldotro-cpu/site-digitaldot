import { cn } from "@/lib/utils";

type TeamSocialPlatform = "facebook" | "linkedin" | "instagram";

type SocialLinkButtonProps = {
  platform: TeamSocialPlatform;
  url: string;
  memberName: string;
  emphasized?: boolean;
};

type IconProps = {
  className?: string;
};

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.5 8.5h2.2V5.8c-.4-.1-1.6-.2-2.9-.2-2.9 0-4.8 1.8-4.8 5v2.8H5v3.1h3v7.8h3.6v-7.8h2.9l.5-3.1h-3.4v-2.5c0-.9.3-1.5 1.9-1.5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.7 8.9a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm-1.8 1.6h3.6v11.6H4.9V10.5Zm5.7 0h3.4v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.5 4.4 5.7v6.2h-3.6v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6h-3.6V10.5Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const iconByPlatform = {
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
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
