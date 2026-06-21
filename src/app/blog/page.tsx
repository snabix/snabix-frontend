import { BlogPage } from "@/src/screens/blog/ui/blog-page";
import { loadBlogPosts } from "@/src/screens/blog/lib/load-blog-content";

export const dynamic = "force-dynamic";

export default async function BlogRoutePage() {
  const posts = await loadBlogPosts();

  return <BlogPage posts={posts} />;
}
