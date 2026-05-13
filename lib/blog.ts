import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import type { BlogPost, BlogFrontmatter } from "@/types/content";

const blogDirectory = path.join(process.cwd(), "content/blog");
const blogFrontmatterSchema: z.ZodType<BlogFrontmatter> = z.object({
  title: z.string().min(10),
  excerpt: z.string().min(20),
  coverImage: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  publishedAt: z.string().min(10),
  authorName: z.string().min(2),
  authorRole: z.string().min(2),
  authorSlug: z.string().min(2).optional(),
  authorBio: z.string().min(20).optional(),
  featured: z.boolean().optional(),
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readPostFile(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = blogFrontmatterSchema.parse(data);

    const authorSlug = frontmatter.authorSlug || slugify(frontmatter.authorName);

    return {
      ...frontmatter,
      authorSlug,
      slug,
      content,
      readingTime: readingTime(content).text,
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const fileNames = await fs.readdir(blogDirectory);

  const posts = await Promise.all(
    fileNames
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => readPostFile(name.replace(/\.mdx$/, ""))),
  );

  return posts
    .filter((post): post is BlogPost => Boolean(post))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getFeaturedPost() {
  const posts = await getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export async function getPostBySlug(slug: string) {
  return readPostFile(slug);
}

export async function getRelatedPosts(currentSlug: string, limit = 3) {
  const posts = await getAllPosts();
  const current = posts.find((post) => post.slug === currentSlug);

  if (!current) {
    return posts.slice(0, limit);
  }

  const related = posts
    .filter((post) => post.slug !== currentSlug)
    .sort((a, b) => {
      const aMatches = a.tags.filter((tag) => current.tags.includes(tag)).length;
      const bMatches = b.tags.filter((tag) => current.tags.includes(tag)).length;
      return bMatches - aMatches;
    });

  return related.slice(0, limit);
}

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getPostsByAuthor(authorSlug: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.authorSlug === authorSlug);
}

export async function getAllAuthors() {
  const posts = await getAllPosts();
  const authors = new Map<string, { slug: string; name: string; role: string; bio: string; posts: BlogPost[] }>();

  for (const post of posts) {
    const slug = post.authorSlug || slugify(post.authorName);
    const existing = authors.get(slug);
    const bio = post.authorBio || "Autor Digital Dot cu focus pe strategie de marketing, poziționare, SEO, Social Media Management și sisteme de creștere predictibilă.";

    if (existing) {
      existing.posts.push(post);
    } else {
      authors.set(slug, {
        slug,
        name: post.authorName,
        role: post.authorRole,
        bio,
        posts: [post],
      });
    }
  }

  return [...authors.values()];
}
