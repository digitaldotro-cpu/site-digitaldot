"use client";

import { motion } from "framer-motion";

type ProcessStep = {
  title: string;
  description: string;
};

type ProcessTimelineProps = {
  title: string;
  intro: string;
  steps: ProcessStep[];
};

export function ProcessTimeline({ title, intro, steps }: ProcessTimelineProps) {
  return (
    <section className="border-y border-[#1a252d] bg-[#0d1217] py-20 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">Proces</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">{title}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#b8c2c7]">{intro}</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.article
              key={`${step.title}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.38, ease: "easeOut", delay: index * 0.05 }}
              className="rounded-[1.1rem] border border-[#2a3d46] bg-[#101920] p-5"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2e4550] bg-[#0f1f28] text-sm font-semibold text-[#66fcf1]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#b5bdc2]">{step.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
