"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FilePenLine, Save } from "lucide-react";
import type { CmsPage } from "@/types/cms";
import { cn } from "@/lib/utils";
import { FieldError, FieldLabel, Input, Textarea } from "@/components/cms/ui/form-controls";

const pageQuickSchema = z.object({
  name: z.string().min(2, "Numele paginii trebuie să aibă minim 2 caractere."),
  slug: z
    .string()
    .min(1, "Slug-ul este obligatoriu.")
    .regex(/^\/.*/, "Slug-ul trebuie să înceapă cu /."),
  seoTitle: z.string().min(3, "SEO title trebuie să aibă minim 3 caractere."),
  seoDescription: z.string().min(10, "SEO description trebuie să aibă minim 10 caractere."),
});

type PageQuickValues = z.infer<typeof pageQuickSchema>;

type PagesManagerProps = {
  pages: CmsPage[];
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
  onUpdatePage: (nextPage: CmsPage) => void;
  onOpenEditor: (pageId: string) => void;
  onPreviewPage: (slug: string) => void;
};

function normalizeSlug(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function toFormValues(page?: CmsPage): PageQuickValues {
  return {
    name: page?.name ?? "",
    slug: page?.slug ?? "/",
    seoTitle: page?.seoTitle ?? "",
    seoDescription: page?.seoDescription ?? "",
  };
}

export function PagesManager({
  pages,
  selectedPageId,
  onSelectPage,
  onUpdatePage,
  onOpenEditor,
  onPreviewPage,
}: PagesManagerProps) {
  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? pages[0],
    [pages, selectedPageId],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<PageQuickValues>({
    resolver: zodResolver(pageQuickSchema),
    defaultValues: toFormValues(selectedPage),
  });

  useEffect(() => {
    reset(toFormValues(selectedPage));
  }, [reset, selectedPage]);

  const slugPreview = useWatch({
    control,
    name: "slug",
    defaultValue: selectedPage?.slug ?? "/",
  });

  return (
    <section className="h-full overflow-auto p-5 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-[#223843] bg-[#111a20] p-4">
          <h2 className="text-lg font-semibold text-white">Pagini website</h2>
          <p className="mt-1 text-xs text-[#8ca0aa]">
            Editează denumirea, slug-ul și SEO rapid pentru fiecare pagină.
          </p>

          <div className="mt-4 space-y-2">
            {pages.map((page) => {
              const active = page.id === selectedPage?.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => onSelectPage(page.id)}
                  className={cn(
                    "w-full rounded-2xl border px-3 py-3 text-left transition",
                    active
                      ? "border-[#66fcf1]/50 bg-[#12313b]"
                      : "border-[#223843] bg-[#0d161b] hover:border-[#2f4a56]",
                  )}
                >
                  <p className="text-sm font-semibold text-white">{page.name}</p>
                  <p className="mt-1 text-xs text-[#8ea4ae]">{page.slug}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <form
          onSubmit={handleSubmit((values) => {
            if (!selectedPage) {
              return;
            }

            onUpdatePage({
              ...selectedPage,
              name: values.name.trim(),
              slug: normalizeSlug(values.slug),
              seoTitle: values.seoTitle.trim(),
              seoDescription: values.seoDescription.trim(),
            });
          })}
          className="rounded-3xl border border-[#223843] bg-[#111a20] p-5"
        >
          {selectedPage ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-white">Setări pagină</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPreviewPage(normalizeSlug(slugPreview || selectedPage.slug))}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-[#2a4552] px-4 text-sm font-semibold text-[#9bc4d0] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
                  >
                    <ExternalLink className="h-4 w-4" /> Preview
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-[#66fcf1] px-4 text-sm font-semibold text-[#063037] transition hover:bg-[#8ffff8]"
                  >
                    <Save className="h-4 w-4" /> Salvează
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="space-y-2">
                  <FieldLabel>Nume pagină</FieldLabel>
                  <Input {...register("name")} />
                  <FieldError message={errors.name?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel>Slug</FieldLabel>
                  <Input {...register("slug")} placeholder="/servicii/exemplu" />
                  <FieldError message={errors.slug?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel>SEO Title (quick)</FieldLabel>
                  <Input {...register("seoTitle")} />
                  <FieldError message={errors.seoTitle?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel>SEO Description (quick)</FieldLabel>
                  <Textarea {...register("seoDescription")} className="min-h-[120px]" />
                  <FieldError message={errors.seoDescription?.message} />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#23414d] bg-[#0c171c] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ea2ad]">
                    Editare conținut
                  </p>
                  <p className="mt-1 text-sm text-[#b5c2c8]">
                    Pentru structura și blocurile paginii, mergi în editorul vizual.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenEditor(selectedPage.id)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#2a4552] px-4 text-sm font-semibold text-[#9bc4d0] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
                >
                  <FilePenLine className="h-4 w-4" /> Deschide editorul
                </button>
              </div>

              <div className="mt-4 text-xs text-[#81949e]">
                {isDirty ? "Ai modificări nesalvate în formularul paginii." : "Nu există modificări locale."}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2e4650] bg-[#0f171c] p-8 text-center text-sm text-[#8ea2ad]">
              Nu există pagini disponibile.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
