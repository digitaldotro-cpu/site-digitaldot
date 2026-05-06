import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SocialLinkButton } from "@/components/landing/social-link-button";
import type { SiteContent } from "@/lib/site-content-schema";

type TeamMember = SiteContent["landing"]["teamSection"]["members"][number];

type TeamMemberCardProps = {
  member: TeamMember;
  delay?: number;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join("");
}

export function TeamMemberCard({ member, delay = 0 }: TeamMemberCardProps) {
  return (
    <AnimatedSection
      delay={delay}
      className="group rounded-3xl border border-[#2a3e42] bg-[#101418]/80 p-6 transition-all duration-300 hover:border-[#66fcf1]/40 hover:shadow-[0_0_30px_-18px_rgba(102,252,241,0.8)]"
    >
      <div className="grid grid-cols-[auto_1fr] items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#2a3e42] bg-[#121820]">
          {member.avatar ? (
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover object-center scale-[1.08]"
              sizes="80px"
              quality={90}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold tracking-[0.12em] text-[#66fcf1]">
              {getInitials(member.name)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-white">{member.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#c6c6c6]">{member.role}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {member.socials.map((social) => (
              <SocialLinkButton
                key={`${member.id}-${social.platform}-${social.url}`}
                platform={social.platform}
                url={social.url}
                memberName={member.name}
                emphasized={member.focusChannels.includes(social.platform)}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
