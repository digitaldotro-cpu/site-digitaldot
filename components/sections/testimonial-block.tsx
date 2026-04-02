import { Quote } from "lucide-react";

type TestimonialBlockProps = {
  quote: string;
  name: string;
  role: string;
};

export function TestimonialBlock({
  quote,
  name,
  role,
}: TestimonialBlockProps) {
  return (
    <figure className="rounded-[1.8rem] border border-[#2a3940] bg-[#11171b] p-6 sm:p-8">
      <Quote className="h-8 w-8 text-[#66fcf1]" />
      <blockquote className="mt-4 text-lg leading-relaxed text-[#d8d8d8]">
        „{quote}”
      </blockquote>
      <figcaption className="mt-5 text-sm text-[#aeb5ba]">
        <span className="font-semibold text-white">{name}</span>
        <span className="mx-2">•</span>
        <span>{role}</span>
      </figcaption>
    </figure>
  );
}
