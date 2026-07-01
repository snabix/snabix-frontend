import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import type { BlogPost } from "@/src/screens/blog/model/types";
import { MediaImage } from "@/src/shared/ui/media-image";
import { DetailPattern, SoftGradient } from "./blog-detail-decor";

type BlogDetailHeroProps = {
  post: BlogPost;
};

export function BlogDetailHero({ post }: BlogDetailHeroProps) {
  const Icon = post.icon;

  return (
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
  );
}
