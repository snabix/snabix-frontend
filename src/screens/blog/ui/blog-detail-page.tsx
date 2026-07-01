import type { BlogPost } from "@/src/screens/blog/model/types";
import { Container } from "@/src/shared/ui/container";
import { BlogContentRenderer } from "./blog-content-renderer";
import { BlogDetailAside } from "./blog-detail-aside";
import { BlogDetailCta } from "./blog-detail-cta";
import { BlogDetailHero } from "./blog-detail-hero";

type BlogDetailPageProps = {
  post: BlogPost;
};

export function BlogDetailPage({ post }: BlogDetailPageProps) {
  return (
    <main className="pb-16 pt-6">
      <Container>
        <article className="bubble-surface relative overflow-hidden rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-4">
          <div className="relative z-10 rounded-[28px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_76%,var(--palette-light-gray)),color-mix(in_srgb,var(--surface)_94%,transparent))] dark:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,var(--palette-midnight)),var(--surface))]">
            <BlogDetailHero post={post} />

            <section className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[220px_1fr] lg:p-8">
              <BlogDetailAside />

              <div className="grid gap-4">
                <BlogContentRenderer blocks={post.contentBlocks} />
                <BlogDetailCta />
              </div>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
}
