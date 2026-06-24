import {
  listRuntimeBlogPosts,
  showRuntimeBlogPost,
} from "@/src/screens/blog/api/news-runtime-source";
import type { BlogPost } from "@/src/screens/blog/model/types";

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    return await listRuntimeBlogPosts();
  } catch {
    return [];
  }
}

export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await showRuntimeBlogPost(slug);
  } catch {
    return null;
  }
}
