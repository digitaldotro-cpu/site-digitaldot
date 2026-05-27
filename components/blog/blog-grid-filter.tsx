"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/content";
import { blogCategories, getCategoryLabel } from "@/data/blog-taxonomy";
import { BlogCard } from "@/components/blog/blog-card";
import { cn } from "@/lib/utils";

const ALL = "all";

type BlogGridFilterProps = {
  posts: BlogPost[];
};

export function BlogGridFilter({ posts }: BlogGridFilterProps) {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const availableCategories = useMemo(() => {
    const set = new Set(posts.map((post) => post.category));
    return blogCategories.filter((item) => set.has(item.key));
  }, [posts]);

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => {
    const matchesCategory = activeCategory === ALL || post.category === activeCategory;
    const searchable = [post.title, post.excerpt, post.authorName, post.category, ...post.tags]
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4">
        <label className="relative block max-w-xl">
          <span className="sr-only">Caută articole</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d8c7a3]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Caută după strategie, SEO, branding, Google Ads..."
            className="w-full rounded-full border border-[#2a3a42] bg-[#0f1519] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#276864]"
            type="search"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              activeCategory === ALL
                ? "border-[#276864] bg-[#112126] text-[#d8c7a3]"
                : "border-[#2a3a42] text-[#c6c6c6]",
            )}
          >
            Toate articolele
          </button>

          {availableCategories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                activeCategory === category.key
                  ? "border-[#276864] bg-[#112126] text-[#d8c7a3]"
                  : "border-[#2a3a42] text-[#c6c6c6]",
              )}
            >
              {getCategoryLabel(category.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      {visiblePosts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-[#263740] bg-[#10161a] p-5 text-sm text-[#c6c6c6]">
          Nu am găsit articole pentru căutarea curentă.
        </p>
      ) : null}
    </section>
  );
}
