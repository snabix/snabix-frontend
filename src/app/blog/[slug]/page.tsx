import { notFound } from "next/navigation";
import { loadBlogPost } from "@/src/screens/blog/lib/load-blog-content";
import { BlogDetailPage } from "@/src/screens/blog/ui/blog-detail-page";

type BlogPostRoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function BlogPostRoutePage({
  params,
}: BlogPostRoutePageProps) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailPage post={post} />;
}
