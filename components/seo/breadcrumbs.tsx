import Link from "next/link";
import { Container } from "@/components/ui/container";

type BreadcrumbsProps = {
  items: Array<{ label: string; href: string }>;
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="pt-8">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 text-xs text-[#9aa5ab]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden>/</span> : null}
                {isLast ? (
                  <span aria-current="page" className="text-[#d3d8dc]">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-[#66fcf1]">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
