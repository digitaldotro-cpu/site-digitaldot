"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "error"; message?: string }>({ type: "idle" });

  async function authenticate(e: React.FormEvent) {
    e.preventDefault();
    setIsAuthenticating(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setStatus({ type: "error", message: data?.message ?? "Date de logare invalide." });
        return;
      }

      // Reload to let the Server Component layout read the new cookie
      window.location.reload();
    } catch {
      setStatus({ type: "error", message: "A apărut o eroare de rețea la autentificare." });
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 rounded-[1.8rem] border border-[#2a3c44] bg-[#10181d] p-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Autentificare CMS</h1>
          <p className="mt-2 text-sm text-[#8da0aa]">Introdu datele pentru a accesa panoul de control.</p>
        </div>

        <form onSubmit={authenticate} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8da0aa]">Utilizator</span>
            <input
              type="text"
              value={adminUsername}
              onChange={(event) => setAdminUsername(event.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="h-11 w-full rounded-xl border border-[#2b3d45] bg-[#0c1418] px-3 text-sm text-white focus:border-[#276864] focus:outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8da0aa]">Parolă</span>
            <input
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="Parola de admin"
              autoComplete="current-password"
              className="h-11 w-full rounded-xl border border-[#2b3d45] bg-[#0c1418] px-3 text-sm text-white focus:border-[#276864] focus:outline-none"
            />
          </label>

          {status.type === "error" && (
            <p className="rounded-xl border border-[#4a3033] bg-[#2f1b1d] px-4 py-2 text-sm text-[#ffc5cb]">
              {status.message}
            </p>
          )}

          <Button type="submit" variant="secondary" className="w-full" disabled={isAuthenticating}>
            <LogIn className="mr-2 h-4 w-4" />
            {isAuthenticating ? "Autentificare..." : "Intră în cont"}
          </Button>
        </form>
      </div>
    </div>
  );
}
