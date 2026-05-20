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
  const avatarClasses =
    "relative aspect-square h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#2a3e42] bg-[#121820] md:h-32 md:w-32 lg:h-28 lg:w-28";

  const avatarContent = member.avatar ? (
    <Image
      src={member.avatar}
      alt={member.name}
      fill
      className="object-cover object-center"
      sizes="(max-width: 767px) 112px, (max-width: 1279px) 128px, 112px"
      quality={90}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-sm font-semibold tracking-[0.12em] text-[#66fcf1]">
      {getInitials(member.name)}
    </div>
  );

  return (
    <AnimatedSection
      delay={delay}
      className="group rounded-3xl border border-[#2a3e42] bg-[linear-gradient(150deg,rgba(16,20,24,0.92),rgba(10,13,16,0.98))] p-6 transition-all duration-300 hover:border-[#66fcf1]/40 hover:shadow-[0_0_30px_-18px_rgba(102,252,241,0.8)]"
    >
      <div className="grid grid-cols-[auto_1fr] items-start gap-4">
        {member.avatarLink ? (
          <a
            href={member.avatarLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} profile link`}
            className={`${avatarClasses} transition-colors duration-300 hover:border-[#66fcf1]/55`}
          >
            {avatarContent}
          </a>
        ) : (
          <div className={avatarClasses}>{avatarContent}</div>
        )}

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
