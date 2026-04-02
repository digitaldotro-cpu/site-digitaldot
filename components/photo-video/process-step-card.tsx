"use client";

import { motion } from "framer-motion";

type ProcessStepCardProps = {
  index: number;
  title: string;
  description: string;
};

export function ProcessStepCard({
  index,
  title,
  description,
}: ProcessStepCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative rounded-2xl border border-[#2a3a42] bg-[#0f161b] p-5"
    >
      <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2e434c] text-xs font-bold text-[#66fcf1]">
        {index + 1}
      </span>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#aeb5bb]">{description}</p>
    </motion.article>
  );
}
