import Link from "next/link";
import { ArrowUpRight, Newspaper, Rss } from "lucide-react";
import { blogPosts, type BlogPost } from "@/src/screens/blog/model/posts";
import { BlogHeroCarousel } from "@/src/screens/blog/ui/blog-hero-carousel";
import { Container } from "@/src/shared/ui/container";

export function BlogPage() {
  const [featuredPost, ...posts] = blogPosts;

  return (
    <main className="pb-16 pt-6">
      <Container className="max-w-[1280px]">
        <section className="bubble-surface relative overflow-hidden rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-4">
          <span className="bubble-orb left-[7%] top-[12%] size-52 bg-[var(--brand)]/28" />
          <span className="bubble-orb bottom-[18%] right-[4%] size-64 bg-[var(--accent)]/18" />

          <div className="relative z-10 rounded-[28px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_78%,white),color-mix(in_srgb,var(--surface)_94%,transparent))] p-4 dark:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,black),var(--surface))] sm:p-6 lg:p-8">
            <BlogHeroCarousel />

            <section className="mt-5 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
              <JournalIntro featuredPost={featuredPost} />
              <FeaturedArticle post={featuredPost} />
            </section>

            <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <BlogCard index={index + 2} key={post.slug} post={post} />
              ))}
            </section>

            <section className="mt-5 grid gap-4 rounded-[28px] border border-[var(--border-soft)] bg-[var(--brand-deep)] p-6 text-[var(--background)] md:grid-cols-[1fr_0.8fr] md:items-end lg:p-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/54">
                  Backend-ready
                </p>
                <h2 className="font-heading mt-4 text-[clamp(2.8rem,7vw,6.2rem)] font-black uppercase leading-[0.78] tracking-[-0.1em]">
                  Контент собирается блоками
                </h2>
              </div>
              <p className="max-w-xl text-sm font-semibold leading-7 text-white/68">
                Список и детальная страница уже используют структуру, похожую на будущий DTO:
                обложка, метаданные, тезис и массив контент-блоков. Админка сможет менять порядок
                блоков, а frontend сохранит единую визуальную систему.
              </p>
            </section>
          </div>
        </section>
      </Container>
    </main>
  );
}

function JournalIntro({ featuredPost }: { featuredPost?: BlogPost }) {
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
              className="w-fit rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-deep)] backdrop-blur transition-colors hover:bg-[var(--brand)]"
              href={`/blog/${featuredPost.slug}`}
            >
              Главный материал
            </Link>
          ) : null}

          <div className="grid grid-cols-3 gap-3">
            <SmallStat label="материалов" value={String(blogPosts.length)} />
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
      className="group relative min-h-[460px] overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--brand-deep)] text-white shadow-[var(--shadow-card)]"
      href={`/blog/${post.slug}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
        src={post.imageUrl}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,20,42,0.9),rgba(23,20,42,0.58),rgba(23,20,42,0.2))]" />
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

function BlogCard({ index, post }: { index: number; post: BlogPost }) {
  const Icon = post.icon;
  const isDark = post.accent === "dark";

  return (
    <Link
      className={[
        "group relative min-h-[430px] overflow-hidden rounded-[28px] border transition-colors",
        isDark
          ? "border-[var(--brand-deep)] bg-[var(--brand-deep)] text-[var(--background)]"
          : "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] text-[var(--brand-deep)]",
      ].join(" ")}
      href={`/blog/${post.slug}`}
    >
      <div className="relative h-48 overflow-hidden border-b border-current/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
          src={post.imageUrl}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/28 bg-white/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">
          0{index}
        </div>
      </div>

      <div className="relative z-10 flex min-h-[238px] flex-col justify-between p-5">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.16em]">
            <span className="inline-flex items-center gap-2">
              <Newspaper size={14} />
              {post.category}
            </span>
            <span>{post.readingTime}</span>
          </div>
          <h2 className="font-heading text-3xl font-black uppercase leading-[0.9] tracking-[-0.07em]">
            {post.title}
          </h2>
          <p className={["mt-4 text-sm leading-7", isDark ? "text-white/68" : "text-[var(--text-muted)]"].join(" ")}>
            {post.description}
          </p>
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black">
          Читать материал
          <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={16} />
        </span>
      </div>

      <div className="pointer-events-none absolute right-5 top-52 grid size-12 place-items-center rounded-full border border-current/20 bg-[color-mix(in_srgb,var(--surface)_36%,transparent)] backdrop-blur">
        <Icon size={18} />
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
          ? "bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.2),transparent_16rem),linear-gradient(135deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:auto,36px_36px]"
          : "bg-[radial-gradient(circle_at_18%_20%,color-mix(in_srgb,var(--brand)_42%,transparent),transparent_16rem),radial-gradient(circle_at_84%_70%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_18rem),linear-gradient(135deg,color-mix(in_srgb,var(--brand-deep)_10%,transparent)_1px,transparent_1px)] bg-[length:auto,auto,34px_34px]",
      ].join(" ")}
    />
  );
}
