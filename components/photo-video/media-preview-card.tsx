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
            "bg-[linear-gradient(160deg,#276864_0%,#276864_60%,#276864_100%)] text-[#d8c7a3]",
        )}
      >
        <h3
          className={cn(
            "text-sm font-semibold",
            highlight ? "text-[#d8c7a3]" : "text-white",
          )}
        >
          {title}
        </h3>
        {subtitle ? (
          <p
            className={cn(
              "mt-1 text-xs",
              highlight ? "text-[#d8c7a3]" : "text-[#aeb6bc]",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
