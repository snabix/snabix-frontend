import type { BlogContentBlock } from "@/src/screens/blog/model/types";
import { BlogCtaBlock, ImageBlock, NumberedCard, TableBlock } from "./blog-content-blocks";

type BlogContentRendererProps = {
  blocks: BlogContentBlock[];
};

export function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  return (
    <>
      {blocks.map((block, index) => (
        <ContentBlock block={block} index={index} key={`${block.type}-${index}`} />
      ))}
    </>
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
      <BlogCtaBlock
        buttonLabel={block.buttonLabel}
        href={block.href}
        text={block.text}
        title={block.title}
      />
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
