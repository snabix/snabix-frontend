import { BlogPage } from "@/src/screens/blog/ui/blog-page";
import { listNewsPosts } from "@/src/entities/news";
import { newsPostToBlogPost } from "@/src/screens/blog/lib/news-adapter";
import { blogPosts } from "@/src/screens/blog/model/posts";

export const dynamic = "force-dynamic";

export default async function BlogRoutePage() {
  const posts = await getBlogPosts();

  return <BlogPage posts={posts} />;
}

async function getBlogPosts() {
  try {
    const response = await listNewsPosts({ perPage: 12 });

    if (response.items.length > 0) {
      return response.items.map((post, index) => newsPostToBlogPost(post, index));
    }
  } catch {
    return blogPosts;
  }

  return blogPosts;
}
