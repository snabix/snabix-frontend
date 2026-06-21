import {
  listRuntimeBlogPosts,
  showRuntimeBlogPost,
} from "@/src/screens/blog/api/news-runtime-source";
import { fallbackBlogPosts } from "@/src/screens/blog/model/fallback-posts";
import type { BlogPost } from "@/src/screens/blog/model/types";

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await listRuntimeBlogPosts();

    return posts.length > 0 ? posts : fallbackBlogPosts;
  } catch {
    return fallbackBlogPosts;
  }
}

export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await showRuntimeBlogPost(slug);
  } catch {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
}
