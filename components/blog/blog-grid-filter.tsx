"use client";

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

  const availableCategories = useMemo(() => {
    const set = new Set(posts.map((post) => post.category));
    return blogCategories.filter((item) => set.has(item.key));
  }, [posts]);

  const visiblePosts =
    activeCategory === ALL
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <section>
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory(ALL)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            activeCategory === ALL
              ? "border-[#66fcf1] bg-[#112126] text-[#66fcf1]"
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
                ? "border-[#66fcf1] bg-[#112126] text-[#66fcf1]"
                : "border-[#2a3a42] text-[#c6c6c6]",
            )}
          >
            {getCategoryLabel(category.key)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
