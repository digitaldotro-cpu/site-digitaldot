"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ImpactCaseCardProps = {
  title: string;
  image: string;
};

export function ImpactCaseCard({ title, image }: ImpactCaseCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group overflow-hidden rounded-[1.1rem] border border-[#2a3b43] bg-[#10171b]"
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
      </div>
    </motion.article>
  );
}
