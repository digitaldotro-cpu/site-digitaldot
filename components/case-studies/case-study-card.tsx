import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content-schema";

type CaseStudy = SiteContent["caseStudies"]["studies"][number];

type CaseStudyCardProps = {
  study: CaseStudy;
  featured?: boolean;
};

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="brand-card group block h-full p-5 sm:p-6"
    >
      <article className="h-full">
        <div className="flex h-full min-w-0 flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8c7a3]">{study.category}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {study.clientName}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{study.excerpt}</p>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {study.cardMetrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 p-4">
                <dt className="text-xl font-semibold text-white">{metric.value}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-[#c6c6c6]">{metric.label}</dd>
              </div>
            ))}
          </dl>

          <span className="case-study-button mt-6 inline-flex w-fit items-center whitespace-nowrap rounded-full border border-[rgba(218,218,218,0.16)] bg-[#1f2a2d] px-2.5 py-2 text-[0.72rem] font-semibold leading-none text-[#dadada] transition-colors group-hover:border-[#276864] group-hover:bg-[#276864] group-hover:text-[#d8c7a3] sm:px-4 sm:text-sm sm:leading-normal">
            Vezi studiul de caz
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
