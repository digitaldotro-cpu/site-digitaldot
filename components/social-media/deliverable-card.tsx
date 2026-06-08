import Image from "next/image";
import { cn } from "@/lib/utils";

type DeliverableCardProps = {
  title: string;
  description?: string;
  image?: string;
  tone?: "dark" | "accent";
  className?: string;
};

export function DeliverableCard({
  title,
  description,
  image,
  tone = "dark",
  className,
}: DeliverableCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[1.2rem] border transition-transform duration-300 hover:-translate-y-1",
        tone === "dark"
          ? "border-[#293b43] bg-[#10181d]"
          : "border-[#276864]/60 bg-[linear-gradient(150deg,#276864_0%,#276864_58%,#276864_100%)]",
        className,
      )}
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-4">
        <h3 className={cn("text-sm font-semibold", tone === "dark" ? "text-white" : "text-[#d8c7a3]")}>
          {title}
        </h3>
        {description ? (
          <p className={cn("mt-2 text-xs leading-relaxed", tone === "dark" ? "text-[#adb5bb]" : "text-[#d8c7a3]")}>
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
