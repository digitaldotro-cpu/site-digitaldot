import type { PortfolioProject } from "@/types/content";

type CaseStudyPreviewProps = {
  project: PortfolioProject;
};

export function CaseStudyPreview({ project }: CaseStudyPreviewProps) {
  return (
    <article className="rounded-[1.5rem] border border-[#26353c] bg-[#11181d] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">
        Case Study Preview
      </p>
      <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-sm text-[#c4c8cb]">{project.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.metrics.map((metric) => (
          <span key={metric} className="rounded-full bg-[#1a252c] px-3 py-1 text-xs text-[#d8dde0]">
            {metric}
          </span>
        ))}
      </div>
    </article>
  );
}
