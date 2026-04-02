"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MediaPreviewCardProps = {
  title: string;
  image: string;
  className?: string;
  subtitle?: string;
  highlight?: boolean;
};

export function MediaPreviewCard({
  title,
  image,
  subtitle,
  highlight = false,
  className,
}: MediaPreviewCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "group overflow-hidden rounded-[1.25rem] border border-[#263740] bg-[#11181d]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div
        className={cn(
          "p-4",
          highlight &&
            "bg-[linear-gradient(160deg,#66fcf1_0%,#47cbc3_60%,#36aaa3_100%)] text-[#0b0c10]",
        )}
      >
        <h3
          className={cn(
            "text-sm font-semibold",
            highlight ? "text-[#0b0c10]" : "text-white",
          )}
        >
          {title}
        </h3>
        {subtitle ? (
          <p
            className={cn(
              "mt-1 text-xs",
              highlight ? "text-[#0f2a29]" : "text-[#aeb6bc]",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
