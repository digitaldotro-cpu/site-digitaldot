"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FieldError, FieldLabel, Input } from "@/components/cms/ui/form-controls";

const settingsSchema = z.object({
  siteTitle: z.string().min(2, "Titlul site-ului este obligatoriu."),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Folosește o culoare hex validă."),
});

type SettingsValues = z.infer<typeof settingsSchema>;

type SettingsPanelProps = {
  values: SettingsValues;
  onUpdate: (values: SettingsValues) => void;
};

export function SettingsPanel({ values, onUpdate }: SettingsPanelProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: values,
  });

  useEffect(() => {
    reset(values);
  }, [values, reset]);

  return (
    <section className="mx-auto w-full max-w-2xl p-6">
      <form
        onSubmit={handleSubmit((nextValues) => onUpdate(nextValues))}
        className="rounded-3xl border border-[#223843] bg-[#111a20] p-6"
      >
        <h2 className="text-xl font-semibold text-white">Setări globale</h2>
        <p className="mt-1 text-sm text-[#8ba1ab]">Configurări pentru branding și integrarea viitoare cu backend-ul.</p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <FieldLabel>Titlu proiect</FieldLabel>
            <Input {...register("siteTitle")} />
            <FieldError message={errors.siteTitle?.message} />
          </div>

          <div className="space-y-2">
            <FieldLabel>Primary Accent</FieldLabel>
            <Input {...register("primaryColor")} />
            <FieldError message={errors.primaryColor?.message} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#66fcf1] px-5 text-sm font-semibold text-[#062f35] transition hover:bg-[#8ffff8]"
        >
          <Save className="h-4 w-4" /> Salvează setări
        </button>
      </form>

      <div className="mt-4 rounded-2xl border border-[#23414d] bg-[#0d171d] p-4 text-sm text-[#8ea2ad]">
        <p className="font-semibold text-white">Note integrare backend</p>
        <p className="mt-1">Înlocuiește endpoint-ul local `/api/admin/cms-data` cu un provider headless (Sanity/Strapi/Supabase). Structura actuală `pages &gt; sections &gt; elements` este deja compatibilă pentru serializare API.</p>
      </div>
    </section>
  );
}
