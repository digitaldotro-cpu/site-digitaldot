"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

type VideoItem = {
  label: string;
  title: string;
  description?: string;
  image: string;
  href?: string;
};

type VideoShowcaseProps = {
  title: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  featured: VideoItem;
  items: VideoItem[];
};

export function VideoShowcase({
  title,
  intro,
  ctaLabel,
  ctaHref,
  featured,
  items,
}: VideoShowcaseProps) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
          <p className="mt-4 text-[#bacac7]">{intro}</p>
        </div>
        <Link href={ctaHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#66fcf1] hover:underline">
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="group relative overflow-hidden rounded-2xl border border-[#2b3941] bg-[#1a1c1c]"
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/65 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-7">
            <span className="mb-3 w-fit rounded-full border border-[#3c4948]/40 bg-[#0f1519]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66fcf1]">
              {featured.label}
            </span>
            <h3 className="text-2xl font-bold text-white">{featured.title}</h3>
            <p className="mt-3 max-w-xl text-sm text-[#bacac7]">{featured.description}</p>
            <Link
              href={featured.href ?? "/portofoliu"}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#66fcf1] hover:underline"
            >
              Deschide proiect <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.article>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.04 }}
              className="group flex gap-4 rounded-2xl border border-[#2b3941] bg-[#1a1c1c] p-4"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#66fcf1]">{item.label}</p>
                <h3 className="mt-1 truncate text-sm font-semibold text-white">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-[#bacac7]">{item.description}</p>
                ) : null}
                <Link href={item.href ?? "/portofoliu"} className="mt-2 inline-flex items-center gap-1 text-xs text-[#66fcf1] hover:underline">
                  <Play className="h-3 w-3 fill-current" /> Vezi
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
