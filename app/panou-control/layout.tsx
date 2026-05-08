import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function PanouControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mb-8 border-b border-[#2a3c44] pb-4">
          <nav className="flex gap-6">
            <Link href="/panou-control" className="text-sm font-semibold text-[#8da0aa] hover:text-white focus:text-white">
              Editor Conținut
            </Link>
            <Link href="/panou-control/logs" className="text-sm font-semibold text-[#8da0aa] hover:text-white focus:text-white">
              Formulare & Loguri
            </Link>
          </nav>
        </div>
        {children}
      </Container>
    </div>
  );
}
