import Link from "next/link";
import { Rss } from "lucide-react";
import type { BlogPost } from "@/src/screens/blog/model/types";
import { BlogHeroCarousel } from "@/src/screens/blog/ui/blog-hero-carousel";
import { BlogTiltCard, type BlogTiltCardPost } from "@/src/screens/blog/ui/blog-tilt-card";
import { Container } from "@/src/shared/ui/container";
import { MediaImage } from "@/src/shared/ui/media-image";

type BlogPageProps = {
  posts: BlogPost[];
};

export function BlogPage({ posts: allPosts }: BlogPageProps) {
  const [featuredPost, ...posts] = allPosts;

  return (
    <main className="pb-16 pt-6">
      <Container>
        <section className="bubble-surface relative overflow-hidden rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-4">
          <span className="bubble-orb left-[7%] top-[12%] size-52 bg-[var(--brand)]/28" />
          <span className="bubble-orb bottom-[18%] right-[4%] size-64 bg-[var(--accent)]/18" />

          <div className="relative z-10 rounded-[28px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_78%,var(--palette-light-gray)),color-mix(in_srgb,var(--surface)_94%,transparent))] p-4 dark:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,var(--palette-midnight)),var(--surface))] sm:p-6 lg:p-8">
            <BlogHeroCarousel />

            <section className="mt-5 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
              <JournalIntro featuredPost={featuredPost} postsCount={allPosts.length} />
              <FeaturedArticle post={featuredPost} />
            </section>

            {allPosts.length === 0 ? (
              <section className="mt-5 rounded-[28px] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_74%,transparent)] p-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Новости с сервера
                </p>
                <h2 className="font-heading mx-auto mt-4 max-w-2xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.08em] text-[var(--brand-deep)] sm:text-5xl">
                  Пока нет опубликованных материалов
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                  Здесь появятся новости, созданные и опубликованные в админке.
                </p>
              </section>
            ) : null}

            {posts.length > 0 ? (
              <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => (
                  <BlogTiltCard index={index + 2} key={post.slug} post={toTiltCardPost(post)} />
                ))}
              </section>
            ) : null}

            <section className="inverted-surface mt-5 grid gap-4 rounded-[28px] border p-6 md:grid-cols-[1fr_0.8fr] md:items-end lg:p-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/54">
                  Backend-ready
                </p>
                <h2 className="font-heading mt-4 text-[clamp(2.8rem,7vw,6.2rem)] font-black uppercase leading-[0.78] tracking-[-0.1em]">
                  Контент собирается блоками
                </h2>
              </div>
            </section>
          </div>
        </section>
      </Container>
    </main>
  );
}

function toTiltCardPost(post: BlogPost): BlogTiltCardPost {
  return {
    accent: post.accent,
    category: post.category,
    date: post.date,
    description: post.description,
    eyebrow: post.eyebrow,
    imageUrl: post.imageUrl,
    slug: post.slug,
    thesis: post.thesis,
    title: post.title,
  };
}

function JournalIntro({ featuredPost, postsCount }: { featuredPost?: BlogPost; postsCount: number }) {
  return (
    <article className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-6">
      <div className="absolute inset-0 opacity-75">
        <EditorialPattern tone="light" />
      </div>
      <div className="relative z-10 grid min-h-[412px] grid-rows-[auto_1fr_auto] gap-7">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <span>Новости продукта</span>
          <Rss size={18} />
        </div>
        <div className="self-center">
          <h1 className="font-heading text-[clamp(3rem,7.2vw,6.3rem)] font-black uppercase leading-[0.82] tracking-[-0.1em] text-[var(--brand-deep)]">
            Snabix
            <span className="block text-[var(--text-muted)]">journal</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--text-muted)]">
            Пишем о развитии marketplace: доверие, карточки объявлений, личный кабинет,
            категории, безопасность, медиа и будущая админка для редакционных материалов.
          </p>
        </div>
        <div className="grid gap-3">
          {featuredPost ? (
            <Link
              className="w-fit rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-deep)] backdrop-blur transition-colors hover:bg-[var(--brand)] hover:text-[var(--active-button-text)]"
              href={`/blog/${featuredPost.slug}`}
            >
              Главный материал
            </Link>
          ) : null}

          <div className="grid grid-cols-3 gap-3">
            <SmallStat label="материалов" value={String(postsCount)} />
            <SmallStat label="главный фокус" value="trust" />
            <SmallStat label="формат" value="blocks" />
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedArticle({ post }: { post?: BlogPost }) {
  if (!post) {
    return null;
  }

  const Icon = post.icon;

  return (
    <Link
      className="inverted-surface group relative min-h-[460px] overflow-hidden rounded-[28px] border shadow-[var(--shadow-card)]"
      href={`/blog/${post.slug}`}
    >
      <MediaImage
        alt=""
        className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        src={post.imageUrl}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--palette-midnight)_92%,transparent),color-mix(in_srgb,var(--palette-midnight)_62%,transparent),color-mix(in_srgb,var(--palette-midnight)_18%,transparent))]" />
      <div className="absolute left-6 top-6 grid size-14 place-items-center rounded-2xl border border-white/24 bg-white/12 backdrop-blur lg:left-8 lg:top-8 lg:size-16 lg:rounded-3xl">
        <Icon size={28} />
      </div>
      <div className="relative z-10 grid min-h-[460px] grid-rows-[auto_1fr] gap-8 p-6 lg:p-8">
        <div className="flex justify-end">
          <p className="inline-flex w-fit rounded-full border border-white/24 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/72 backdrop-blur">
            {post.eyebrow}
          </p>
        </div>

        <div className="self-end">
          <h2 className="font-heading max-w-3xl text-[clamp(2.4rem,4.8vw,4.4rem)] font-black uppercase leading-[0.84] tracking-[-0.085em]">
            {post.title}
          </h2>
          <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/72">
            {post.thesis}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-3">
      <p className="font-heading text-2xl font-black uppercase leading-none tracking-[-0.08em] text-[var(--brand-deep)]">
        {value}
      </p>
      <p className="mt-2 text-[9px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

function EditorialPattern({ tone }: { tone: BlogPost["accent"] | "dark" }) {
  const isDark = tone === "dark";

  return (
    <div
      className={[
        "h-full w-full",
        isDark
          ? "bg-[radial-gradient(circle_at_12%_18%,color-mix(in_srgb,var(--inverted-surface-text)_20%,transparent),transparent_16rem),linear-gradient(135deg,color-mix(in_srgb,var(--inverted-surface-text)_10%,transparent)_1px,transparent_1px)] bg-[length:auto,36px_36px]"
          : "bg-[radial-gradient(circle_at_18%_20%,color-mix(in_srgb,var(--brand)_42%,transparent),transparent_16rem),radial-gradient(circle_at_84%_70%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_18rem),linear-gradient(135deg,color-mix(in_srgb,var(--brand-deep)_10%,transparent)_1px,transparent_1px)] bg-[length:auto,auto,34px_34px]",
      ].join(" ")}
    />
  );
}
