import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/src/shared/ui/media-image";
import { Button } from "@/src/shared/ui/shadcn/button";

export function NumberedCard({ index, text, title }: { index: number; text: string; title: string }) {
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

export function ImageBlock({
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

export function TableBlock({ columns, rows }: { columns: string[]; rows: Array<Array<string | number | boolean | null>> }) {
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
                    {String(cell ?? "-")}
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

export function BlogCtaBlock({
  buttonLabel,
  href,
  text,
  title,
}: {
  buttonLabel?: string;
  href?: string;
  text?: string;
  title?: string;
}) {
  return (
    <section className="inverted-surface grid gap-5 rounded-[26px] border p-6 md:grid-cols-[1fr_auto] md:items-end sm:p-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/54">
          Snabix
        </p>
        <h2 className="font-heading mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em]">
          {title ?? "Продолжить"}
        </h2>
        {text ? <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">{text}</p> : null}
      </div>
      {href ? (
        <Button asChild className="rounded-full bg-[var(--palette-silver)] text-[var(--palette-midnight)] hover:bg-white">
          <Link href={href}>
            {buttonLabel ?? "Открыть"}
            <ArrowUpRight size={16} />
          </Link>
        </Button>
      ) : null}
    </section>
  );
}
