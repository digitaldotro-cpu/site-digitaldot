"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ResultCardProps = {
  title: string;
  metric: string;
  image: string;
};

export function ResultCard({ title, metric, image }: ResultCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group overflow-hidden rounded-[1.15rem] border border-[#2a3d45] bg-[#10181d]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#66fcf1]">{metric}</p>
      </div>
    </motion.article>
  );
}
