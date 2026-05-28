"use client";

type ProcessStepCardProps = {
  index: number;
  title: string;
  description: string;
};

export function ProcessStepCard({
  index,
  title,
  description,
}: ProcessStepCardProps) {
  return (
    <article
      className="relative rounded-2xl border border-[#2a3a42] bg-[#0f161b] p-5"
    >
      <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2e434c] text-xs font-bold text-[#d8c7a3]">
        {index + 1}
      </span>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#aeb5bb]">{description}</p>
    </article>
  );
}
