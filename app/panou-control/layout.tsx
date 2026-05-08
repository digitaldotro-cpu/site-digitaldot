import Link from "next/link";
import { cookies } from "next/headers";
import { Container } from "@/components/ui/container";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function PanouControlLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = token ? verifyAdminSessionToken(token) : false;

  if (!isAuthenticated) {
    return (
      <div className="py-10 sm:py-14">
        <Container>
          <LoginForm />
        </Container>
      </div>
    );
  }

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
