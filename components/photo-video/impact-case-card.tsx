import Image from "next/image";

type ImpactCaseCardProps = {
  title: string;
  image: string;
};

export function ImpactCaseCard({ title, image }: ImpactCaseCardProps) {
  return (
    <article
      className="group overflow-hidden rounded-[1.1rem] border border-[#2a3b43] bg-[#10171b] transition-transform duration-300 hover:-translate-y-1"
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
      </div>
    </article>
  );
}
