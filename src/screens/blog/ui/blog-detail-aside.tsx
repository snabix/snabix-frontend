import Link from "next/link";
import { Button } from "@/src/shared/ui/shadcn/button";

export function BlogDetailAside() {
  return (
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
  );
}
