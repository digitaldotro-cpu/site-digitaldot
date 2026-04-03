"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import type { PortfolioProject } from "@/types/content";
import { cn } from "@/lib/utils";

type PortfolioFilter = {
  label: string;
  value: string;
  categories: string[];
};

type PortfolioInteractiveGridProps = {
  filters: PortfolioFilter[];
  defaultFilter: string;
  projects: PortfolioProject[];
};

function getCardSpan(variant: PortfolioProject["layoutVariant"], index: number) {
  const effective = variant ?? (index === 0 ? "hero" : "standard");
  if (effective === "hero") {
    return "md:col-span-8 md:row-span-2";
  }
  if (effective === "wide") {
    return "md:col-span-8 md:row-span-1";
  }
  if (effective === "tall") {
    return "md:col-span-4 md:row-span-2";
  }
  return "md:col-span-4 md:row-span-1";
}

export function PortfolioInteractiveGrid({
  filters,
  defaultFilter,
  projects,
}: PortfolioInteractiveGridProps) {
  const safeFilters = useMemo(
    () =>
      filters.length
        ? filters
        : [{ label: "Toate", value: "toate", categories: ["*"] }],
    [filters],
  );
  const initial = safeFilters.some((item) => item.value === defaultFilter)
    ? defaultFilter
    : safeFilters[0].value;
  const [activeFilter, setActiveFilter] = useState(initial);

  const visibleProjects = useMemo(() => {
    const selected = safeFilters.find((item) => item.value === activeFilter);
    if (!selected || selected.categories.includes("*")) {
      return projects;
    }

    return projects.filter((project) => selected.categories.includes(project.category));
  }, [activeFilter, projects, safeFilters]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {safeFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              activeFilter === filter.value
                ? "border-[#66fcf1] bg-[#122126] text-[#66fcf1]"
                : "border-[#2a3a42] text-[#c6c6c6] hover:text-white",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid auto-rows-[220px] gap-6 md:grid-cols-12">
        {visibleProjects.map((project, index) => (
          <motion.article
            key={`${project.slug}-${activeFilter}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-[#2c3a42] bg-[#1e2020]",
              getCardSpan(project.layoutVariant, index),
            )}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#3c4948]/40 bg-[#0e1317]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66fcf1]">
                  {project.category}
                </span>
                {project.highlightBadge ? (
                  <span className="rounded-full border border-[#3c4948]/40 bg-[#0e1317]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#bacac7]">
                    {project.highlightBadge}
                  </span>
                ) : null}
                {project.hasVideo ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#3c4948]/40 bg-[#0e1317]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66fcf1]">
                    <PlayCircle className="h-3 w-3" /> Video
                  </span>
                ) : null}
              </div>

              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[#bacac7]">{project.excerpt}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.metrics.slice(0, 3).map((metric) => (
                  <li key={metric} className="rounded-full border border-[#3c4948]/40 px-3 py-1 text-xs text-white/90">
                    {metric}
                  </li>
                ))}
              </ul>

              <Link
                href={project.href ?? "/portofoliu"}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#66fcf1] hover:underline"
              >
                Vezi detalii <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
