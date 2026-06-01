import Link from "next/link";
import { Newspaper, Rss } from "lucide-react";
import { blogPosts } from "@/src/screens/blog/model/posts";
import { Container } from "@/src/shared/ui/container";
import { Button } from "@/src/shared/ui/shadcn/button";

export function BlogPage() {
  const [featuredPost, ...posts] = blogPosts;

  return (
    <main className="pb-16 pt-6">
      <Container>
        <section className="hero-shell relative overflow-hidden rounded-[40px] px-6 py-10 sm:px-10 lg:px-12">
          <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-[color-mix(in_srgb,var(--brand)_38%,transparent)] blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                Новости
              </p>
              <h1 className="font-heading mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-[var(--brand-deep)] sm:text-6xl">
                Пишем о развитии Snabix, безопасности сделок и удобных объявлениях.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
                Здесь будут новости продукта, инструкции для пользователей,
                заметки о каталоге, доверии, карточках объявлений и будущих
                возможностях платформы.
              </p>
            </div>
            <Button className="active-button rounded-[20px] px-6 py-6">
              <Rss size={18} />
              Подписаться позже
            </Button>
          </div>
        </section>

        {featuredPost ? (
          <section className="mt-8 surface-card grid gap-6 rounded-[34px] p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="grid min-h-64 place-items-center rounded-[28px] bg-[linear-gradient(135deg,var(--accent-soft),color-mix(in_srgb,var(--brand)_28%,var(--surface)))] text-[var(--brand-deep)]">
              <featuredPost.icon size={58} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span>{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readingTime}</span>
              </div>
              <h2 className="font-heading mt-4 text-3xl font-black text-[var(--brand-deep)] sm:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-muted)]">
                {featuredPost.description}
              </p>
              <Link className="mt-6 inline-flex w-fit items-center gap-2 rounded-[18px] border border-[var(--border-soft)] px-5 py-3 text-sm font-black text-[var(--brand-deep)] hover:border-[var(--accent)]" href={`/blog/${featuredPost.slug}`}>
                Читать материал
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {posts.map((post) => {
            const Icon = post.icon;

            return (
              <article className="surface-card interactive-lift rounded-[30px] p-6" key={post.slug}>
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
                    <Icon size={22} />
                  </span>
                  <Newspaper className="text-[var(--text-muted)]" size={19} />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {post.category} • {post.readingTime}
                </p>
                <h2 className="font-heading mt-3 text-xl font-black text-[var(--brand-deep)]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                  {post.description}
                </p>
                <Link className="mt-5 inline-flex text-sm font-black text-[var(--accent)] hover:text-[var(--brand-deep)]" href={`/blog/${post.slug}`}>
                  Читать
                </Link>
              </article>
            );
          })}
        </section>
      </Container>
    </main>
  );
}
