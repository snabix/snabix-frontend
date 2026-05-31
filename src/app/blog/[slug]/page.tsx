import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/src/screens/blog/model/posts";
import { Container } from "@/src/shared/ui/container";
import { Button } from "@/src/shared/ui/shadcn/button";

type BlogPostRoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostRoutePage({
  params,
}: BlogPostRoutePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const Icon = post.icon;

  return (
    <main className="pb-16 pt-6">
      <Container>
        <article className="surface-card mx-auto max-w-4xl rounded-[36px] p-7 sm:p-10">
          <div className="grid size-16 place-items-center rounded-3xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
            <Icon size={30} />
          </div>
          <p className="section-kicker mt-6 text-sm font-semibold uppercase tracking-[0.16em]">
            {post.category} • {post.date} • {post.readingTime}
          </p>
          <h1 className="font-heading mt-4 text-4xl font-black tracking-[-0.04em] text-[var(--brand-deep)] sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-9 text-[var(--text-muted)]">
            {post.description}
          </p>
          <div className="mt-8 grid gap-4 text-base leading-8 text-[var(--brand-deep)]">
            <p>
              Этот раздел пока работает как продуктовый блог-заготовка. Здесь мы будем публиковать новости разработки, инструкции для пользователей и объяснения решений, которые влияют на удобство marketplace.
            </p>
            <p>
              Материалы помогают объяснять не только “что появилось”, но и “зачем это нужно”: доверие продавцу, качество объявлений, понятные категории, безопасное общение и развитие личного кабинета.
            </p>
          </div>
          <Button asChild className="mt-8 rounded-[18px] px-5 py-6" variant="outline">
            <Link href="/blog">Вернуться к блогу</Link>
          </Button>
        </article>
      </Container>
    </main>
  );
}
