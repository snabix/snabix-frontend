import { notFound } from "next/navigation";
import { showNewsPost } from "@/src/entities/news";
import { newsPostToBlogPost } from "@/src/screens/blog/lib/news-adapter";
import { blogPosts } from "@/src/screens/blog/model/posts";
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
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailPage post={post} />;
}

async function getBlogPost(slug: string) {
  try {
    return newsPostToBlogPost(await showNewsPost(slug));
  } catch {
    return blogPosts.find((item) => item.slug === slug) ?? null;
  }
}
