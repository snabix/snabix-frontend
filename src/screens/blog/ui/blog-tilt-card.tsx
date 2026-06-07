"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Layers3,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import { useState, type MouseEvent } from "react";
import type { BlogPost } from "@/src/screens/blog/model/posts";

export type BlogTiltCardPost = Omit<BlogPost, "contentBlocks" | "icon">;

type BlogTiltCardProps = {
  index: number;
  post: BlogTiltCardPost;
};

const iconsByCategory: Record<string, LucideIcon> = {
  Архитектура: Layers3,
  Безопасность: ShieldCheck,
  Инструкция: BookOpen,
  Новости: Sparkles,
  Обновления: BadgeCheck,
  Продукт: Store,
};

export function BlogTiltCard({ index, post }: BlogTiltCardProps) {
  const Icon = iconsByCategory[post.category] ?? Newspaper;
  const isDark = post.accent === "dark";
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 8;

    setTransform(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`);
  }

  function handleMouseLeave() {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");
  }

  return (
    <Link
      className={[
        "group relative min-h-[430px] overflow-hidden rounded-[28px] border outline outline-1 outline-transparent transition-[box-shadow,outline-color,transform] duration-200 ease-out will-change-transform",
        "hover:outline-[var(--brand)] hover:shadow-[0_26px_80px_color-mix(in_srgb,var(--brand)_28%,transparent)]",
        isDark
          ? "inverted-surface border-[var(--inverted-surface-border)]"
          : "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] text-[var(--brand-deep)]",
      ].join(" ")}
      href={`/blog/${post.slug}`}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ transform }}
    >
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-[28px] ring-2 ring-[color-mix(in_srgb,var(--brand)_72%,transparent)] ring-offset-0" />
        <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand),transparent)]" />
      </div>

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
