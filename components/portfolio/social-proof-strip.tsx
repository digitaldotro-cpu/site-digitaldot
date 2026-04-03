"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type SocialProofLogo = {
  name: string;
  image: string;
  href?: string;
};

type SocialProofStripProps = {
  title: string;
  intro: string;
  logos: SocialProofLogo[];
};

export function SocialProofStrip({ title, intro, logos }: SocialProofStripProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mt-3 text-[#bacac7]">{intro}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {logos.map((logo, index) => (
          <motion.div
            key={`${logo.name}-${index}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl border border-[#2a3840] bg-[#1a1c1c] p-4"
          >
            <Link href={logo.href ?? "/portofoliu"} className="block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[#32434d]/40 bg-[#11171c]">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover grayscale transition duration-300 hover:grayscale-0"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{logo.name}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
