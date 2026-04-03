"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/photo-video/section-shell";
import { cn } from "@/lib/utils";

type Deliverable = {
  title: string;
  description: string;
  variant: "large" | "small" | "accent";
};

type BentoDeliverablesProps = {
  title: string;
  intro: string;
  items: Deliverable[];
};

export function BentoDeliverables({ title, intro, items }: BentoDeliverablesProps) {
  const normalized = items.length > 0
    ? items
    : [
        {
          title: "Blueprint Strategic",
          description: "Direcție, mesaje, funnel și canale prioritare.",
          variant: "large" as const,
        },
      ];

  return (
    <section className="py-20 sm:py-24">
      <SectionShell
        eyebrow="Deliverables"
        title={title}
        description={intro}
        className="justify-center text-center"
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ y: -4 }}
          className="rounded-[1.4rem] border border-[#2a3e47] bg-[#111a20] p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">Core</p>
          <h3 className="mt-4 text-2xl font-semibold text-white">{normalized[0].title}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#b6c0c5]">{normalized[0].description}</p>
        </motion.article>

        <div className="grid gap-4">
          {normalized.slice(1, 3).map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -4 }}
              className={cn(
                "rounded-[1.2rem] border p-5",
                item.variant === "accent"
                  ? "border-[#66fcf1]/60 bg-[linear-gradient(150deg,#66fcf1_0%,#44cdc6_60%,#2f9892_100%)] text-[#0b0c10]"
                  : "border-[#2a3e47] bg-[#10181d] text-white",
              )}
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className={cn("mt-2 text-sm leading-relaxed", item.variant === "accent" ? "text-[#103534]" : "text-[#b6c0c5]")}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>

      {normalized.length > 3 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {normalized.slice(3).map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -4 }}
              className={cn(
                "rounded-[1.2rem] border p-5",
                item.variant === "accent"
                  ? "border-[#66fcf1]/60 bg-[linear-gradient(150deg,#66fcf1_0%,#44cdc6_60%,#2f9892_100%)] text-[#0b0c10]"
                  : "border-[#2a3e47] bg-[#10181d] text-white",
              )}
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className={cn("mt-2 text-sm leading-relaxed", item.variant === "accent" ? "text-[#103534]" : "text-[#b6c0c5]")}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
