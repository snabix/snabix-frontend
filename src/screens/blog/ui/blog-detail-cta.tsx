import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";

export function BlogDetailCta() {
  return (
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
  );
}
