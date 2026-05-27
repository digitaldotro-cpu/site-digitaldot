import { cn } from "@/lib/utils";

type HighlightTextProps = {
  text: string;
  highlight?: boolean;
};

export function HighlightText({ text, highlight = false }: HighlightTextProps) {
  return (
    <p
      className={cn(
        "text-lg leading-relaxed text-[#c6c6c6] md:text-xl",
        highlight && "rounded-2xl border border-[#276864]/35 bg-[#276864]/10 p-5 text-[#ffffff]",
      )}
    >
      {text}
    </p>
  );
}
