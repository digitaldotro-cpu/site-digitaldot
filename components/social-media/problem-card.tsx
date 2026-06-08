type ProblemCardProps = {
  title: string;
  description: string;
  delay?: number;
};

export function ProblemCard({ title, description }: ProblemCardProps) {
  return (
    <article
      className="rounded-[1.1rem] border border-[#2a3b44] bg-[#10181d] p-5 transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="mb-3 inline-flex h-2 w-2 rounded-full bg-[#276864]" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#adb5bb]">{description}</p>
    </article>
  );
}
