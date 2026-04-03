"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save } from "lucide-react";
import type { BlogPostItem, MediaItem } from "@/types/cms";
import { FieldError, FieldLabel, Input, Select, Textarea } from "@/components/cms/ui/form-controls";
import { cn } from "@/lib/utils";

const blogEditorSchema = z.object({
  title: z.string().min(3, "Titlul trebuie să aibă minim 3 caractere."),
  category: z.string().min(1, "Categoria este obligatorie."),
  tags: z.string().optional(),
  coverMediaId: z.string().optional(),
  content: z.string().min(10, "Conținutul trebuie să aibă minim 10 caractere."),
  published: z.boolean(),
});

type BlogEditorValues = z.infer<typeof blogEditorSchema>;

type BlogManagerProps = {
  posts: BlogPostItem[];
  media: MediaItem[];
  onCreatePost: () => string;
  onDeletePost: (postId: string) => void;
  onUpdatePost: (post: BlogPostItem) => void;
};

function toFormValues(post?: BlogPostItem): BlogEditorValues {
  if (!post) {
    return {
      title: "",
      category: "strategie",
      tags: "",
      coverMediaId: "",
      content: "",
      published: false,
    };
  }

  return {
    title: post.title,
    category: post.category,
    tags: post.tags.join(", "),
    coverMediaId: post.coverMediaId ?? "",
    content: post.content,
    published: post.published,
  };
}

export function BlogManager({ posts, media, onCreatePost, onDeletePost, onUpdatePost }: BlogManagerProps) {
  const [selectedPostId, setSelectedPostId] = useState(posts[0]?.id);
  const effectiveSelectedPostId =
    selectedPostId && posts.some((post) => post.id === selectedPostId)
      ? selectedPostId
      : posts[0]?.id;

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === effectiveSelectedPostId),
    [posts, effectiveSelectedPostId],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BlogEditorValues>({
    resolver: zodResolver(blogEditorSchema),
    defaultValues: toFormValues(selectedPost),
  });

  const publishedValue = useWatch({
    control,
    name: "published",
    defaultValue: selectedPost?.published ?? false,
  });

  useEffect(() => {
    reset(toFormValues(selectedPost));
  }, [selectedPost, reset]);

  return (
    <section className="h-full overflow-auto p-5 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="rounded-3xl border border-[#223843] bg-[#111a20] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Articole</h2>
            <button
              type="button"
              onClick={() => {
                const nextId = onCreatePost();
                setSelectedPostId(nextId);
              }}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[#2a4552] px-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#9bc4d0] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
            >
              <Plus className="h-3.5 w-3.5" /> Nou
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {posts.map((post) => {
              const active = post.id === effectiveSelectedPostId;

              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSelectedPostId(post.id)}
                  className={cn(
                    "w-full rounded-2xl border px-3 py-3 text-left transition",
                    active
                      ? "border-[#66fcf1]/50 bg-[#12313b]"
                      : "border-[#223843] bg-[#0d161b] hover:border-[#2f4a56]",
                  )}
                >
                  <p className="line-clamp-2 text-sm font-semibold text-white">{post.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-[#8ea4ae]">{post.category}</span>
                    <span className={post.published ? "text-[#66fcf1]" : "text-[#b0bfc6]"}>
                      {post.published ? "Publicat" : "Draft"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <form
          onSubmit={handleSubmit((values) => {
            if (!selectedPost) {
              return;
            }

            onUpdatePost({
              ...selectedPost,
              title: values.title,
              category: values.category,
              tags: values.tags
                ?.split(",")
                .map((tag) => tag.trim())
                .filter(Boolean) ?? [],
              coverMediaId: values.coverMediaId?.trim() || undefined,
              content: values.content,
              published: values.published,
              updatedAt: new Date().toISOString(),
            });
          })}
          className="rounded-3xl border border-[#223843] bg-[#111a20] p-5"
        >
          {selectedPost ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-white">Editor articol</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-[#66fcf1] px-4 text-sm font-semibold text-[#063037] transition hover:bg-[#8ffff8]"
                  >
                    <Save className="h-4 w-4" /> Salvează
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeletePost(selectedPost.id);
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5a2a34] text-[#f3bbc3] transition hover:border-[#d95970]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <FieldLabel>Titlu</FieldLabel>
                  <Input {...register("title")} />
                  <FieldError message={errors.title?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel>Categorie</FieldLabel>
                  <Input {...register("category")} placeholder="social-media" />
                  <FieldError message={errors.category?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel>Tag-uri</FieldLabel>
                  <Input {...register("tags")} placeholder="strategie, leaduri" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <FieldLabel>Cover media</FieldLabel>
                  <Select {...register("coverMediaId")}>
                    <option value="">Fără cover</option>
                    {media.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <FieldLabel>Conținut (Markdown/MDX-ready)</FieldLabel>
                  <Textarea {...register("content")} className="min-h-[280px]" />
                  <FieldError message={errors.content?.message} />
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-[#9db1ba]">
                  <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-[#314751] accent-[#66fcf1]" />
                  Publicat
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-[#23414d] bg-[#0c171c] p-4 text-xs text-[#8ea2ad]">
                <p className="font-semibold text-white">Previzualizare status</p>
                <p className="mt-1">Stare curentă: {publishedValue ? "Publicat" : "Draft"}.</p>
                <p className="mt-1">Actualizat ultima dată: {new Date(selectedPost.updatedAt).toLocaleString("ro-RO")}</p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2e4650] bg-[#0f171c] p-8 text-center text-sm text-[#8ea2ad]">
              Nu există articole. Creează primul articol din butonul <strong>Nou</strong>.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
