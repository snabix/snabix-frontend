import { Settings2 } from "lucide-react";

export function ListingFormInlineHint({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5">
      <div className="flex items-center gap-4">
        <div className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--text-muted)]">
          <Settings2 size={18} />
        </div>
        <p className="text-sm leading-7 text-[var(--text-muted)]">{text}</p>
      </div>
    </div>
  );
}
