import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
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
          <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#0b0c10]/80 px-3 py-1 text-xs font-semibold text-[#d8c7a3]">
            <PlayCircle className="h-4 w-4" /> Video First
          </span>
        ) : null}
      </div>
      <div className="space-y-3 p-6">
        <TagBadge>{project.category}</TagBadge>
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="text-sm leading-relaxed text-[#c7cbce]">{project.excerpt}</p>
        {project.challenge ? (
          <p className="text-xs leading-relaxed text-[#aeb6bb]">
            <span className="font-semibold text-white">Provocare:</span> {project.challenge}
          </p>
        ) : null}
        {project.strategy ? (
          <p className="text-xs leading-relaxed text-[#aeb6bb]">
            <span className="font-semibold text-white">Strategie:</span> {project.strategy}
          </p>
        ) : null}
        <ul className="flex flex-wrap gap-2">
          {project.metrics.map((metric) => (
            <li key={metric} className="rounded-full border border-[#2a3a42] px-3 py-1 text-xs text-[#dde1e4]">
              {metric}
            </li>
          ))}
        </ul>
        {project.execution?.length ? (
          <ul className="grid gap-2 pt-2 text-xs text-[#c7cbce] sm:grid-cols-2">
            {project.execution.slice(0, 4).map((item) => (
              <li key={item} className="rounded-2xl border border-[#263740] bg-[#0d1317] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {project.testimonial ? (
          <blockquote className="rounded-2xl border border-[#276864]/45 bg-[#0d1518] p-4 text-xs leading-relaxed text-[#cfd5d8]">
            “{project.testimonial.quote}”
            <span className="mt-2 block text-[#8f979d]">
              {project.testimonial.author}, {project.testimonial.role}
            </span>
          </blockquote>
        ) : null}
        {project.cta ? (
          <Link href={project.cta.href} className="inline-flex items-center text-sm font-semibold text-[#d8c7a3]">
            {project.cta.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
