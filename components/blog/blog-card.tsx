import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/content";
import { getCategoryLabel } from "@/data/blog-taxonomy";
import { TagBadge } from "@/components/ui/tag-badge";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[#27363d] bg-[#10161a] transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-[#23313a]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-3 p-6">
        <TagBadge>{getCategoryLabel(post.category)}</TagBadge>
        <h3 className="text-xl font-semibold text-white">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-[#c2c8cc]">{post.excerpt}</p>
        <p className="text-xs text-[#9ca4aa]">
          {new Date(post.publishedAt).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          {" • "}
          {post.readingTime}
        </p>
      </div>
    </article>
  );
}
