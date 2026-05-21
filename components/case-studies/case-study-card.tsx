import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content-schema";

type CaseStudy = SiteContent["caseStudies"]["studies"][number];

type CaseStudyCardProps = {
  study: CaseStudy;
  featured?: boolean;
};

export function CaseStudyCard({ study, featured = false }: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group block h-full rounded-[2rem] border border-[#276864]/42 bg-[linear-gradient(150deg,rgba(16,22,27,0.94),rgba(9,12,16,0.98))] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#66fcf1]/55 hover:shadow-[0_0_40px_-22px_rgba(102,252,241,0.85)] sm:p-7"
    >
      <article className={featured ? "grid h-full gap-7 lg:grid-cols-[0.85fr_1.15fr]" : "h-full"}>
        <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[#276864]/40 bg-[#c6c6c6] p-8">
          <Image
            src={study.heroImage}
            alt={`${study.clientName} case study`}
            width={420}
            height={220}
            className="relative max-h-32 w-auto max-w-full object-contain"
            style={{
              ...(study.imageScale ? { transform: `scale(${study.imageScale})` } : {}),
            }}
          />
        </div>

        <div className="mt-6 flex min-w-0 flex-col justify-between lg:mt-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">{study.category}</p>
            <h2 className={featured ? "mt-3 text-3xl font-semibold text-white sm:text-4xl" : "mt-3 text-2xl font-semibold text-white"}>
              {study.clientName}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{study.excerpt}</p>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {study.cardMetrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="rounded-2xl border border-[#263740] bg-[#0d1317] p-4">
                <dt className="text-xl font-semibold text-[#66fcf1]">{metric.value}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-[#c6c6c6]">{metric.label}</dd>
              </div>
            ))}
          </dl>

          <span className="mt-6 inline-flex items-center text-sm font-semibold text-[#66fcf1]">
            Vezi studiul de caz
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
