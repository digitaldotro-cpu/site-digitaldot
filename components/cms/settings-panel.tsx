"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Save, Upload } from "lucide-react";
import type { MediaItem } from "@/types/cms";
import { FieldError, FieldLabel, Input, Select } from "@/components/cms/ui/form-controls";

const settingsSchema = z.object({
  siteTitle: z.string().min(2, "Titlul site-ului este obligatoriu."),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Folosește o culoare hex validă."),
  headerLogoMediaId: z.string().optional(),
  faviconMediaId: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

type SettingsPanelProps = {
  values: SettingsValues;
  media: MediaItem[];
  onUpdate: (values: SettingsValues) => void;
  onUploadAsset: (payload: {
    file: File;
    name: string;
    tags: string[];
    type: "image";
  }) => Promise<string | null>;
};

type AssetField = "headerLogoMediaId" | "faviconMediaId";

export function SettingsPanel({ values, media, onUpdate, onUploadAsset }: SettingsPanelProps) {
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadingField, setUploadingField] = useState<AssetField | null>(null);
  const headerInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: values,
  });

  const headerLogoMediaId = useWatch({ control, name: "headerLogoMediaId" });
  const faviconMediaId = useWatch({ control, name: "faviconMediaId" });
  const imageMedia = useMemo(() => media.filter((item) => item.type === "image"), [media]);

  const headerLogoItem = imageMedia.find((item) => item.id === headerLogoMediaId);
  const faviconItem = imageMedia.find((item) => item.id === faviconMediaId);

  useEffect(() => {
    reset(values);
  }, [values, reset]);

  async function uploadAsset(field: AssetField, file: File) {
    setUploadError("");
    setUploadingField(field);

    try {
      const assetId = await onUploadAsset({
        file,
        name: field === "headerLogoMediaId" ? "Logo Header" : "Favicon",
        tags: field === "headerLogoMediaId" ? ["brand", "header", "logo"] : ["brand", "favicon", "icon"],
        type: "image",
      });

      if (!assetId) {
        setUploadError("Nu am putut încărca fișierul acum. Încearcă din nou.");
        return;
      }

      setValue(field, assetId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } finally {
      setUploadingField(null);
    }
  }

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

          <div className="rounded-2xl border border-[#23414d] bg-[#0d171d] p-4">
            <div className="mb-3 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-[#66fcf1]" />
              <p className="text-sm font-semibold text-white">Brand Assets</p>
            </div>
            <p className="text-xs text-[#8ea2ad]">
              Încarcă și selectează logo-ul din header și favicon-ul site-ului.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-[#2a414c] bg-[#0a1318] p-3">
                <FieldLabel>Logo Header</FieldLabel>
                <Select {...register("headerLogoMediaId")}>
                  <option value="">Fără logo</option>
                  {imageMedia.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  onClick={() => headerInputRef.current?.click()}
                  disabled={uploadingField === "headerLogoMediaId"}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#31505c] text-xs font-semibold text-[#a7c2ce] transition hover:border-[#66fcf1]/70 hover:text-[#66fcf1] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingField === "headerLogoMediaId" ? "Se încarcă..." : "Încarcă logo"}
                </button>
                <input
                  ref={headerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    void uploadAsset("headerLogoMediaId", file);
                    event.target.value = "";
                  }}
                />
                {headerLogoItem ? (
                  <div className="relative h-14 overflow-hidden rounded-lg border border-[#31505c] bg-[#0d161b]">
                    <Image
                      src={headerLogoItem.url}
                      alt={headerLogoItem.name}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 rounded-xl border border-[#2a414c] bg-[#0a1318] p-3">
                <FieldLabel>Favicon</FieldLabel>
                <Select {...register("faviconMediaId")}>
                  <option value="">Fără favicon</option>
                  {imageMedia.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={uploadingField === "faviconMediaId"}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#31505c] text-xs font-semibold text-[#a7c2ce] transition hover:border-[#66fcf1]/70 hover:text-[#66fcf1] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingField === "faviconMediaId" ? "Se încarcă..." : "Încarcă favicon"}
                </button>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    void uploadAsset("faviconMediaId", file);
                    event.target.value = "";
                  }}
                />
                {faviconItem ? (
                  <div className="relative h-14 overflow-hidden rounded-lg border border-[#31505c] bg-[#0d161b]">
                    <Image
                      src={faviconItem.url}
                      alt={faviconItem.name}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <FieldError message={uploadError} />
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
