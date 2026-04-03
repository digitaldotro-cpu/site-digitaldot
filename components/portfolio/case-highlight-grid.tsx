"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Sparkles, Target } from "lucide-react";

type CaseHighlight = {
  icon: string;
  title: string;
  context: string;
  approach: string;
  metric: string;
};

type CaseHighlightGridProps = {
  title: string;
  intro: string;
  items: CaseHighlight[];
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  ChartLine: BarChart3,
  Sparkles,
  Activity,
};

export function CaseHighlightGrid({ title, intro, items }: CaseHighlightGridProps) {
  return (
    <section className="bg-[#0e1317] py-24 sm:py-32">
      <div className="mb-12 max-w-3xl">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
        <p className="mt-4 text-[#bacac7]">{intro}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon] ?? Target;
          return (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-[#2d3b43] bg-[#1a1c1c] p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#66fcf1]/10 text-[#66fcf1]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-[#bacac7]"><span className="font-semibold text-white">Context:</span> {item.context}</p>
              <p className="mt-2 text-sm text-[#bacac7]"><span className="font-semibold text-white">Abordare:</span> {item.approach}</p>
              <p className="mt-4 rounded-full border border-[#3c4948]/40 px-3 py-1 text-xs font-semibold text-[#66fcf1]">
                {item.metric}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
