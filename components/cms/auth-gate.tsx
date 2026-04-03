"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { FieldError, FieldLabel, Input } from "@/components/cms/ui/form-controls";

const loginSchema = z.object({
  password: z.string().min(3, "Introdu parola de administrator."),
});

type LoginValues = z.infer<typeof loginSchema>;

type AuthGateProps = {
  onAuthenticated: () => void;
};

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [serverError, setServerError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#03070c]/88 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(async (values) => {
          setServerError("");

          const response = await fetch("/api/admin/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const data = (await response.json().catch(() => null)) as { message?: string } | null;

          if (!response.ok) {
            setServerError(data?.message || "Autentificare eșuată.");
            return;
          }

          onAuthenticated();
        })}
        className="w-full max-w-md rounded-[1.8rem] border border-[#28404d] bg-[#0d161d] p-7 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.85)]"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#112c37] text-[#66fcf1]">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xl font-semibold text-white">Digital Dot CMS</p>
            <p className="text-sm text-[#8fa4ae]">Autentificare administrator</p>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Parolă admin</FieldLabel>
          <Input type="password" autoComplete="current-password" {...register("password")} />
          <FieldError message={errors.password?.message} />
          <FieldError message={serverError} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#66fcf1] text-sm font-semibold text-[#063138] transition hover:bg-[#8ffff8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Verificăm..." : "Intră în Dashboard"}
        </button>
      </form>
    </div>
  );
}
