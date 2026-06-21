import { listNewsPosts, showNewsPost } from "@/src/entities/news";
import { newsPostToBlogPost } from "@/src/screens/blog/lib/news-adapter";
import type { BlogPost } from "@/src/screens/blog/model/types";

export async function listRuntimeBlogPosts(): Promise<BlogPost[]> {
  const response = await listNewsPosts({ perPage: 12 });

  return response.items.map((post, index) => newsPostToBlogPost(post, index));
}

export async function showRuntimeBlogPost(slug: string): Promise<BlogPost> {
  return newsPostToBlogPost(await showNewsPost(slug));
}
