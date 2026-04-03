"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

type StrategyHeroProps = {
  badge: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
};

export function StrategyHero({
  badge,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  image,
}: StrategyHeroProps) {
  return (
    <section className="relative overflow-hidden pb-18 pt-20 sm:pb-22 sm:pt-24">
      <div className="pointer-events-none absolute right-[-8rem] top-[-4rem] h-80 w-80 rounded-full bg-[#66fcf1]/14 blur-3xl" />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.96fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="inline-flex rounded-full border border-[#26414f] bg-[#0f1d28] px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#66fcf1]">
            {badge}
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primaryCtaHref}>
              {primaryCtaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={secondaryCtaHref} variant="secondary" size="sm">
              {secondaryCtaLabel}
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#2b444f] bg-[linear-gradient(150deg,#12222b_0%,#143943_45%,#0d161c_100%)] p-4 shadow-[0_40px_120px_-60px_rgba(102,252,241,0.55)] sm:p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-[#35545f] bg-[#0a1217]">
              <Image
                src={image}
                alt="Strategie de marketing"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-7 left-7 rounded-xl border border-[#2f4953] bg-[#0f1d27]/90 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-[#66fcf1] backdrop-blur">
              STRATEGY SYSTEM
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
