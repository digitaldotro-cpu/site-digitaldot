import Image from "next/image";
import { PlayCircle } from "lucide-react";
import type { PortfolioProject } from "@/types/content";
import { TagBadge } from "@/components/ui/tag-badge";

type PortfolioCardProps = {
  project: PortfolioProject;
};

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[#27363d] bg-[#10161a] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#223038]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {project.hasVideo ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#0b0c10]/80 px-3 py-1 text-xs font-semibold text-[#66fcf1]">
            <PlayCircle className="h-4 w-4" /> Video First
          </span>
        ) : null}
      </div>
      <div className="space-y-3 p-6">
        <TagBadge>{project.category}</TagBadge>
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="text-sm leading-relaxed text-[#c7cbce]">{project.excerpt}</p>
        <ul className="flex flex-wrap gap-2">
          {project.metrics.map((metric) => (
            <li key={metric} className="rounded-full border border-[#2a3a42] px-3 py-1 text-xs text-[#dde1e4]">
              {metric}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
