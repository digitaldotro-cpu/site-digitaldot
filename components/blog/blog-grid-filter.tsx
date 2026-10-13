"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/content";
import { blogCategories, getCategoryLabel } from "@/data/blog-taxonomy";
import { BlogCard } from "@/components/blog/blog-card";

type BlogGridFilterProps = {
  posts: BlogPost[];
};

export function BlogGridFilter({ posts }: BlogGridFilterProps) {
  const [query, setQuery] = useState("");

  const availableCategories = useMemo(() => {
    const set = new Set(posts.map((post) => post.category));
    return blogCategories.filter((item) => set.has(item.key));
  }, [posts]);

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => {
    const searchable = [post.title, post.excerpt, post.authorName, post.category, ...post.tags]
      .join(" ")
      .toLowerCase();
    return !normalizedQuery || searchable.includes(normalizedQuery);
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

        <nav aria-label="Categorii blog" className="flex flex-wrap gap-3">
          <Link href="/blog" aria-current="page" className="rounded-full border border-[#276864] bg-[#1f2a2d] px-4 py-2 text-sm font-semibold text-[#d8c7a3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#66fcf1]">
            Toate articolele
          </Link>
          {availableCategories.map((category) => (
            <Link
              key={category.key}
              href={`/blog/categorie/${category.key}`}
              className="rounded-full border border-[rgba(218,218,218,0.16)] bg-[#1f2a2d] px-4 py-2 text-sm font-semibold text-[#dadada] transition-colors hover:border-[#276864] hover:bg-[#276864] hover:text-[#d8c7a3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#66fcf1]"
            >
              {getCategoryLabel(category.key)}
            </Link>
          ))}
        </nav>
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
