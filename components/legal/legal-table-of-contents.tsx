import type { LegalPageContent } from "@/lib/site-content-schema";

type LegalTableOfContentsProps = {
  title: string;
  sections: LegalPageContent["legalContent"]["sections"];
};

export function LegalTableOfContents({ title, sections }: LegalTableOfContentsProps) {
  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit" aria-label="Cuprins">
      <div className="rounded-[1.6rem] border border-[#26414b] bg-[#0f171d]/90 p-5 backdrop-blur-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">{title}</h2>
        <nav className="mt-4">
          <ul className="space-y-2 text-sm text-[#c6c6c6]">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex rounded-lg px-1 py-1 transition-colors hover:text-[#95fff8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
