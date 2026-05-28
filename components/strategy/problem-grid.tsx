"use client";

import { Target, Gauge, BarChart3, Lightbulb, type LucideIcon } from "lucide-react";
import { SectionShell } from "@/components/photo-video/section-shell";

type ProblemItem = {
  icon: string;
  title: string;
  description: string;
};

type ProblemGridProps = {
  title: string;
  intro: string;
  items: ProblemItem[];
};

const iconMap: Record<string, LucideIcon> = {
  Target,
  Gauge,
  BarChart3,
};

export function ProblemGrid({ title, intro, items }: ProblemGridProps) {
  return (
    <section className="border-y border-[#1a252d] bg-[#0d1217] py-20 sm:py-24">
      <SectionShell
        eyebrow="Probleme"
        title={title}
        description={intro}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon] ?? Lightbulb;

          return (
            <article
              key={`${item.title}-${index}`}
              className="rounded-[1.2rem] border border-[#2a3c46] bg-[#111a20] p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2f4650] bg-[#0f1f28] text-[#d8c7a3]">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#b4bdc2]">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
