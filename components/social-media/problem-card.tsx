"use client";

import { motion } from "framer-motion";

type ProblemCardProps = {
  title: string;
  description: string;
  delay?: number;
};

export function ProblemCard({ title, description, delay = 0 }: ProblemCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={{ y: -5 }}
      className="rounded-[1.1rem] border border-[#2a3b44] bg-[#10181d] p-5"
    >
      <span className="mb-3 inline-flex h-2 w-2 rounded-full bg-[#66fcf1]" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#adb5bb]">{description}</p>
    </motion.article>
  );
}
