import Image from "next/image";

type ResultCardProps = {
  title: string;
  metric: string;
  image: string;
};

export function ResultCard({ title, metric, image }: ResultCardProps) {
  return (
    <article
      className="group overflow-hidden rounded-[1.15rem] border border-[#2a3d45] bg-[#10181d] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#d8c7a3]">{metric}</p>
      </div>
    </article>
  );
}
