"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type CaseStudy = {
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

type CaseStudyGridProps = {
  title: string;
  intro: string;
  items: CaseStudy[];
};

export function CaseStudyGrid({ title, intro, items }: CaseStudyGridProps) {
  return (
    <section className="py-20 sm:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">Impact</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#c6c6c6]">{intro}</p>
        </div>
        <Link
          href="/portofoliu"
          className="inline-flex items-center gap-1 rounded-full border border-[#2a3f48] px-4 py-2 text-sm font-semibold text-[#c8d1d5] transition hover:border-[#66fcf1]/70 hover:text-[#66fcf1]"
        >
          Vezi portofoliu <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.article
            key={`${item.title}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-[1.3rem] border border-[#2b3f48] bg-[#10181d]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">{item.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#b8c2c7]">{item.description}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#66fcf1] hover:text-[#93fff8]">
                Detalii proiect <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
