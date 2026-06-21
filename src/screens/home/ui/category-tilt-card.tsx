"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { MediaImage } from "@/src/shared/ui/media-image";

type CategoryTiltCardProps = {
  href: string;
  imageUrl: string | null;
  title: string;
};

const initialTransform = "perspective(900px) rotateX(0deg) rotateY(0deg)";

export function CategoryTiltCard({ href, imageUrl, title }: CategoryTiltCardProps) {
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 8;

    event.currentTarget.style.transform =
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  }

  function handleMouseLeave(event: MouseEvent<HTMLElement>) {
    event.currentTarget.style.transform = initialTransform;
  }

  return (
    <Link
      className="block text-current no-underline"
      href={href}
    >
      <article
        className="group relative min-h-[286px] overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-2 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-200 ease-out will-change-transform hover:border-[var(--brand)] hover:shadow-[0_26px_80px_color-mix(in_srgb,var(--brand)_20%,transparent)]"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ transform: initialTransform }}
      >

        <div className="relative aspect-square overflow-hidden rounded-[22px]">
          {imageUrl !== null && (
            <MediaImage
              alt={title}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
              src={imageUrl}
            />
          )}
        </div>

        <div className="grid min-h-20 place-items-center px-3 py-4 text-center">
          <h3 className="font-heading line-clamp-2 text-base font-black leading-tight text-[var(--brand-deep)]">
            {title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
