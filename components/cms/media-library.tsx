"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Search, Trash2, Replace, Film, Image as ImageIcon } from "lucide-react";
import type { MediaItem } from "@/types/cms";
import { FieldError, FieldLabel, Input, Select } from "@/components/cms/ui/form-controls";
import { cn } from "@/lib/utils";

const mediaUploadSchema = z.object({
  name: z.string().min(2, "Numele media este necesar."),
  tags: z.string().optional(),
  type: z.enum(["image", "video"]),
});

type MediaUploadValues = z.infer<typeof mediaUploadSchema>;

type MediaLibraryProps = {
  media: MediaItem[];
  selectedMediaId?: string;
  onSelect: (mediaId: string) => void;
  onUpload: (payload: { file: File; name: string; tags: string[]; type: "image" | "video" }) => void;
  onReplace: (mediaId: string, file: File) => void;
  onDelete: (mediaId: string) => void;
};

export function MediaLibrary({
  media,
  selectedMediaId,
  onSelect,
  onUpload,
  onReplace,
  onDelete,
}: MediaLibraryProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceId, setReplaceId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MediaUploadValues>({
    resolver: zodResolver(mediaUploadSchema),
    defaultValues: {
      name: "",
      tags: "",
      type: "image",
    },
  });

  const filtered = useMemo(() => {
    return media.filter((item) => {
      if (filter !== "all" && item.type !== filter) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const value = `${item.name} ${item.tags.join(" ")}`.toLowerCase();
      return value.includes(query.toLowerCase());
    });
  }, [filter, media, query]);

  function handleReplaceClick(mediaId: string) {
    setReplaceId(mediaId);
    replaceInputRef.current?.click();
  }

  return (
    <section className="h-full overflow-auto p-5 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <form
          onSubmit={handleSubmit((values, event) => {
            const fileInput = event?.target instanceof HTMLFormElement
              ? (event.target.elements.namedItem("file") as HTMLInputElement | null)
              : null;
            const file = fileInput?.files?.[0];

            if (!file) {
              return;
            }

            onUpload({
              file,
              name: values.name,
              type: values.type,
              tags: values.tags
                ?.split(",")
                .map((tag) => tag.trim())
                .filter(Boolean) ?? [],
            });

            reset();
            if (fileInput) {
              fileInput.value = "";
            }
          })}
          className="rounded-3xl border border-[#223843] bg-[#111a20] p-5"
        >
          <h2 className="text-lg font-semibold text-white">Media Uploader</h2>
          <p className="mt-1 text-sm text-[#8ba1ab]">Încarcă imagini sau clipuri pentru secțiunile website-ului.</p>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <FieldLabel>Nume fișier</FieldLabel>
              <Input {...register("name")} placeholder="Ex: Hero campaign aprilie" />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel>Tip</FieldLabel>
              <Select {...register("type")}>
                <option value="image">Imagine</option>
                <option value="video">Video</option>
              </Select>
            </div>

            <div className="space-y-2">
              <FieldLabel>Tags</FieldLabel>
              <Input {...register("tags")} placeholder="hero, social, campanie" />
            </div>

            <div className="space-y-2">
              <FieldLabel>Fișier</FieldLabel>
              <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#33505d] bg-[#0c1419] text-sm text-[#98adb7] transition hover:border-[#66fcf1]/70 hover:text-[#66fcf1]">
                <Upload className="mb-2 h-5 w-5" />
                Selectează fișier
                <input name="file" type="file" accept="image/*,video/*" className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#66fcf1] text-sm font-semibold text-[#093238] transition hover:bg-[#8ffff8]"
          >
            Upload Media
          </button>
        </form>

        <div className="rounded-3xl border border-[#223843] bg-[#111a20] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-white">Media Library</h2>
            <div className="flex gap-2">
              {(["all", "image", "video"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                    filter === value
                      ? "bg-[#123843] text-[#66fcf1]"
                      : "bg-[#0c151b] text-[#89a0aa] hover:text-white",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e8692]" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Caută media..." />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const selected = selectedMediaId === item.id;

              return (
                <article
                  key={item.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-[#0d151a]",
                    selected ? "border-[#66fcf1]" : "border-[#223742]",
                  )}
                >
                  <button type="button" onClick={() => onSelect(item.id)} className="block w-full text-left">
                    <div className="relative h-36 w-full bg-[#0b1217]">
                      {item.type === "video" ? (
                        <div className="flex h-full items-center justify-center text-[#66fcf1]">
                          <Film className="h-8 w-8" />
                        </div>
                      ) : item.url.startsWith("data:") ? (
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 20vw"
                        />
                      ) : (
                        <Image src={item.url} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
                      )}
                    </div>
                    <div className="space-y-1 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                      <p className="truncate text-xs text-[#86a0a9]">{item.tags.join(" • ") || "fără tag-uri"}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 border-t border-[#1f323c] px-2 py-2">
                    <button
                      type="button"
                      onClick={() => handleReplaceClick(item.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-[#2e4550] px-2 py-1.5 text-xs font-semibold text-[#9bc0cd] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
                    >
                      <Replace className="h-3.5 w-3.5" /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#4d2a33] text-[#f0b8c0] transition hover:border-[#dc5c72]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}

            {filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#2d4450] bg-[#0e161b] p-8 text-center text-sm text-[#8ca1ac]">
                Nu există rezultate pentru filtrul curent.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file || !replaceId) {
            return;
          }
          onReplace(replaceId, file);
          event.target.value = "";
          setReplaceId("");
        }}
      />

      <div className="mt-6 rounded-2xl border border-[#22404e] bg-[#0d1a22] p-4 text-sm text-[#8ea3ad]">
        <p className="font-semibold text-white">Bibliotecă optimizată</p>
        <p className="mt-1">Upload-ul folosește Cloudinary prin route handler server-side. Dacă providerul nu este configurat, sistemul folosește fallback local pentru preview imediat.</p>
        <div className="mt-3 flex gap-2 text-xs text-[#8da2ac]">
          <ImageIcon className="h-4 w-4 text-[#66fcf1]" />
          <span>Total assets: {media.length}</span>
        </div>
      </div>
    </section>
  );
}
