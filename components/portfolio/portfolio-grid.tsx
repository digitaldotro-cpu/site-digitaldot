"use client";

import { useMemo, useState } from "react";
import type { PortfolioProject } from "@/types/content";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { cn } from "@/lib/utils";

const ALL = "Toate";

type PortfolioGridProps = {
  projects: PortfolioProject[];
};

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...new Set(projects.map((project) => project.category))],
    [projects],
  );

  const visibleProjects =
    activeCategory === ALL
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border bg-[#1f2a2d] px-4 py-2 text-sm font-semibold transition-colors hover:border-[#276864] hover:bg-[#276864] hover:text-[#d8c7a3]",
              activeCategory === category
                ? "border-[#276864] text-[#d8c7a3]"
                : "border-[rgba(218,218,218,0.16)] text-[#dadada]",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project) => (
          <PortfolioCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
