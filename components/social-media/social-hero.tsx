"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";

type SocialHeroProps = {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export function SocialHero({ badge, title, description, ctaLabel }: SocialHeroProps) {
  return (
    <section className="relative overflow-hidden pb-20 pt-20 sm:pb-24 sm:pt-24">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#66fcf1]/12 blur-3xl" />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.02fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#66fcf1]">
            {badge}
          </p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contacteaza-ne">{ctaLabel}</ButtonLink>
            <ButtonLink href="/portofoliu" variant="ghost" size="sm">
              Vezi rezultate
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[1.9rem] border border-[#2d424a] bg-[linear-gradient(145deg,#15353a_0%,#163136_52%,#0f181d_100%)] p-4 shadow-[0_35px_95px_-50px_rgba(102,252,241,0.6)] sm:p-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] border border-[#3b585d]/70 bg-[#0f181c]">
              <Image
                src="/images/social-media/hero-phone.svg"
                alt="Preview social media feed"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-7 left-7 rounded-2xl border border-[#2b3f47] bg-[#111b20]/85 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
                Pachet activ
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Full-Service SMM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
