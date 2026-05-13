import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { FaqGroupContent } from "@/lib/site-content-schema";

type FaqSectionProps = {
  groups: FaqGroupContent[];
};

export function FaqSection({ groups }: FaqSectionProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="py-18 sm:py-24" aria-labelledby="faq-title">
      <Container>
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66fcf1]">
            FAQ
          </p>
          <h2 id="faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Întrebări frecvente
          </h2>

          <div className="mt-8 space-y-8">
            {groups.map((group) => (
              <div key={group.id}>
                <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                <div className="mt-4 divide-y divide-[#263740] overflow-hidden rounded-[1.6rem] border border-[#263740] bg-[#10161a]">
                  {group.items.map((item) => (
                    <details key={item.id} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition-colors hover:text-[#66fcf1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#66fcf1] [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#66fcf1] transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[#c6c6c6]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
