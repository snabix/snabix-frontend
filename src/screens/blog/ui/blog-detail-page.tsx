import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import type { BlogContentBlock, BlogPost } from "@/src/screens/blog/model/types";
import { Container } from "@/src/shared/ui/container";
import { MediaImage } from "@/src/shared/ui/media-image";
import { Button } from "@/src/shared/ui/shadcn/button";

type BlogDetailPageProps = {
  post: BlogPost;
};

export function BlogDetailPage({ post }: BlogDetailPageProps) {
  const Icon = post.icon;

  return (
    <main className="pb-16 pt-6">
      <Container>
        <article className="bubble-surface relative overflow-hidden rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-4">
          <div className="relative z-10 rounded-[28px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_76%,var(--palette-light-gray)),color-mix(in_srgb,var(--surface)_94%,transparent))] dark:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,var(--palette-midnight)),var(--surface))]">
            <section className="grid min-h-[560px] overflow-hidden rounded-[28px] border-b border-[var(--border-soft)] lg:grid-cols-[0.92fr_1fr]">
              <div className="inverted-surface relative overflow-hidden p-6 sm:p-8">
                <MediaImage
                  alt=""
                  className="object-cover opacity-34 grayscale"
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  src={post.imageUrl}
                />
                <div className="absolute inset-0 opacity-50">
                  <DetailPattern />
                </div>
                <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-between">
                  <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
                    <Link className="inline-flex items-center gap-2 hover:text-white" href="/blog">
                      <ArrowLeft size={15} />
                      Назад
                    </Link>
                    <span>{post.category}</span>
                  </div>

                  <div>
                    <div className="mb-5 grid size-16 place-items-center rounded-3xl border border-white/24 bg-white/10 backdrop-blur">
                      <Icon size={30} />
                    </div>
                    <h1 className="font-heading max-w-2xl text-[clamp(3.2rem,8vw,7.6rem)] font-black uppercase leading-[0.78] tracking-[-0.1em]">
                      {post.title}
                    </h1>
                    <p className="mt-6 max-w-xl text-sm font-semibold leading-7 text-white/68">
                      {post.thesis}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 sm:p-8">
                <div className="absolute inset-0 opacity-70">
                  <SoftGradient />
                </div>
                <div className="relative z-10 flex min-h-[500px] flex-col justify-between">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} />
                      {post.readingTime ?? "Без оценки"}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">
                      {post.eyebrow}
                    </p>
                    <p className="mt-5 max-w-2xl text-2xl font-black uppercase leading-[1.04] tracking-[-0.05em] text-[var(--brand-deep)] sm:text-4xl">
                      {post.description}
                    </p>
                  </div>

                  <div className="grid gap-3 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_74%,transparent)] p-5">
                    <p className="text-sm leading-7 text-[var(--text-muted)]">
                      Материал собран из типизированных блоков конструктора. Редактор может менять порядок секций, добавлять медиа, таблицы и CTA без правок frontend-кода.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[220px_1fr] lg:p-8">
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Snabix journal
                  </p>
                  <p className="font-heading mt-10 text-6xl font-black leading-none tracking-[-0.12em] text-[var(--brand-deep)]">
                    01
                  </p>
                  <Button asChild className="mt-5 rounded-full" variant="outline">
                    <Link href="/blog">Все новости</Link>
                  </Button>
                </div>
              </aside>

              <div className="grid gap-4">
                {post.contentBlocks.map((block, index) => (
                  <ContentBlock block={block} index={index} key={`${block.type}-${index}`} />
                ))}

                <section className="grid gap-4 rounded-[26px] border border-[var(--border-soft)] bg-[var(--brand)] p-6 text-[var(--accent-block-text)] md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-65">
                      Продолжить
                    </p>
                    <h2 className="font-heading mt-3 text-3xl font-black uppercase leading-[0.9] tracking-[-0.07em]">
                      Вернуться к списку новостей
                    </h2>
                  </div>
                  <Button asChild className="rounded-full bg-[var(--palette-midnight)] text-[var(--palette-silver)] hover:bg-[color-mix(in_srgb,var(--palette-midnight)_90%,var(--palette-orange))]">
                    <Link href="/blog">
                      Открыть блог
                      <ArrowUpRight size={16} />
                    </Link>
                  </Button>
                </section>
              </div>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
}

function ContentBlock({
  block,
  index,
}: {
  block: BlogContentBlock;
  index: number;
}) {
  if (block.type === "lead") {
    return (
      <section className="rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-6 sm:p-8">
        <p className="font-heading text-3xl font-black uppercase leading-[1.02] tracking-[-0.06em] text-[var(--brand-deep)] sm:text-5xl">
          {block.text}
        </p>
      </section>
    );
  }

  if (block.type === "paragraph") {
    return (
      <section className="rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-6 sm:p-8">
        <p className="max-w-3xl text-lg leading-9 text-[var(--brand-deep)]">
          {block.text}
        </p>
      </section>
    );
  }

  if (block.type === "quote") {
    return (
      <section className="inverted-surface rounded-[26px] border p-6 sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/54">
          Цитата
        </p>
        <blockquote className="font-heading mt-5 text-3xl font-black uppercase leading-[0.98] tracking-[-0.06em] sm:text-5xl">
          “{block.text}”
        </blockquote>
        {block.author ? <p className="mt-5 text-sm font-bold text-white/62">{block.author}</p> : null}
      </section>
    );
  }

  if (block.type === "split") {
    return (
      <section className="grid gap-4 md:grid-cols-2">
        {block.items.map((item, itemIndex) => (
          <NumberedCard index={itemIndex} key={item.title} text={item.text} title={item.title} />
        ))}
      </section>
    );
  }

  if (block.type === "metrics") {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        {block.items.map((item) => (
          <div
            className="rounded-[26px] border border-[var(--border-soft)] bg-[var(--brand)] p-6 text-[var(--accent-block-text)]"
            key={item.label}
          >
            <p className="font-heading text-5xl font-black uppercase leading-none tracking-[-0.1em]">
              {item.value}
            </p>
            <p className="mt-8 text-[10px] font-black uppercase leading-5 tracking-[0.18em] opacity-70">
              {item.label}
            </p>
          </div>
        ))}
      </section>
    );
  }

  if (block.type === "image") {
    return <ImageBlock caption={block.caption} imageUrl={block.imageUrl ?? block.media?.url} />;
  }

  if (block.type === "gallery") {
    return (
      <section className="grid gap-4 md:grid-cols-2">
        {(block.items ?? []).map((item, itemIndex) => (
          <ImageBlock caption={item.caption} imageUrl={item.imageUrl ?? item.media?.url} key={`${item.imageUrl}-${itemIndex}`} />
        ))}
      </section>
    );
  }

  if (block.type === "table") {
    return <TableBlock columns={block.columns ?? []} rows={block.rows ?? []} />;
  }

  if (block.type === "imageGrid") {
    return (
      <section className="grid gap-4 md:grid-cols-2">
        {(block.items ?? []).map((item, itemIndex) => (
          <div className="overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)]" key={`${item.title}-${itemIndex}`}>
            <ImageBlock caption={item.caption} imageUrl={item.imageUrl ?? item.media?.url} compact />
            <div className="p-6">
              <h2 className="font-heading text-2xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-[var(--brand-deep)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (block.type === "cta") {
    return (
      <section className="inverted-surface grid gap-5 rounded-[26px] border p-6 md:grid-cols-[1fr_auto] md:items-end sm:p-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/54">
            Snabix
          </p>
          <h2 className="font-heading mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em]">
            {block.title ?? "Продолжить"}
          </h2>
          {block.text ? <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">{block.text}</p> : null}
        </div>
        {block.href ? (
          <Button asChild className="rounded-full bg-[var(--palette-silver)] text-[var(--palette-midnight)] hover:bg-white">
            <Link href={block.href}>
              {block.buttonLabel ?? "Открыть"}
              <ArrowUpRight size={16} />
            </Link>
          </Button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-6 sm:p-8">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Stage {String(index + 1).padStart(2, "0")}
      </p>
      <div className="mt-6 grid gap-4">
        {block.items.map((item, itemIndex) => (
          <NumberedCard index={itemIndex} key={item.title} text={item.text} title={item.title} />
        ))}
      </div>
    </section>
  );
}

function NumberedCard({ index, text, title }: { index: number; text: string; title: string }) {
  return (
    <div className="rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-6">
      <p className="font-heading text-5xl font-black leading-none tracking-[-0.1em] text-[var(--brand-deep)]">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h2 className="font-heading mt-8 text-3xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-[var(--brand-deep)]">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
        {text}
      </p>
    </div>
  );
}

function ImageBlock({
  caption,
  compact = false,
  imageUrl,
}: {
  caption?: string;
  compact?: boolean;
  imageUrl?: string;
}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <figure className={compact ? "" : "overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)]"}>
      <div className={compact ? "relative h-64" : "relative h-[420px]"}>
        <MediaImage
          alt={caption ?? ""}
          className="object-cover grayscale"
          fill
          sizes="(min-width: 1024px) 70vw, 100vw"
          src={imageUrl}
        />
      </div>
      {caption ? (
        <figcaption className="p-4 text-sm font-semibold leading-6 text-[var(--text-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function TableBlock({ columns, rows }: { columns: string[]; rows: Array<Array<string | number | boolean | null>> }) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-[color-mix(in_srgb,var(--brand)_10%,transparent)] text-[var(--brand-deep)]">
            <tr>
              {columns.map((column) => (
                <th className="px-5 py-4 font-black uppercase tracking-[0.12em]" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className="border-t border-[var(--border-soft)]" key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className="px-5 py-4 text-[var(--text-muted)]" key={`${rowIndex}-${cellIndex}`}>
                    {String(cell ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DetailPattern() {
  return (
    <div className="h-full w-full bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.24),transparent_16rem),linear-gradient(135deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:auto,36px_36px]" />
  );
}

function SoftGradient() {
  return (
    <div className="h-full w-full bg-[radial-gradient(circle_at_18%_22%,color-mix(in_srgb,var(--brand)_45%,transparent),transparent_16rem),radial-gradient(circle_at_82%_74%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_18rem)]" />
  );
}
