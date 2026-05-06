import type { ComponentType } from "react";
import { Camera, Building2, MessageCircle, Link as LinkIcon } from "lucide-react";

type SocialLinkItemProps = {
  platform: string;
  url: string;
  icon: string;
};

const iconByName: Record<string, ComponentType<{ className?: string }>> = {
  Instagram: Camera,
  Facebook: MessageCircle,
  Linkedin: Building2,
};

export function SocialLinkItem({ platform, url, icon }: SocialLinkItemProps) {
  const Icon = iconByName[icon] ?? LinkIcon;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[#276864]/45 bg-[#12171b] px-4 py-2 text-sm text-[#c6c6c6] transition hover:border-[#66fcf1]/70 hover:text-white"
    >
      <Icon className="h-4 w-4 text-[#66fcf1]" />
      <span>{platform}</span>
    </a>
  );
}
