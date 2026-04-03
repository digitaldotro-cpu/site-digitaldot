"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DeliverableCardProps = {
  title: string;
  description?: string;
  image?: string;
  tone?: "dark" | "accent";
  className?: string;
};

export function DeliverableCard({
  title,
  description,
  image,
  tone = "dark",
  className,
}: DeliverableCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "overflow-hidden rounded-[1.2rem] border",
        tone === "dark"
          ? "border-[#293b43] bg-[#10181d]"
          : "border-[#55ddd5]/60 bg-[linear-gradient(150deg,#66fcf1_0%,#46cec6_58%,#2f9993_100%)]",
        className,
      )}
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-4">
        <h3 className={cn("text-sm font-semibold", tone === "dark" ? "text-white" : "text-[#09201f]")}>
          {title}
        </h3>
        {description ? (
          <p className={cn("mt-2 text-xs leading-relaxed", tone === "dark" ? "text-[#adb5bb]" : "text-[#123a38]")}>
            {description}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
