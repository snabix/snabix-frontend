import { ImageIcon } from "lucide-react";

export function ListingMediaPlaceholder() {
  return (
    <div className="grid justify-items-center gap-3 text-[var(--text-muted)]">
      <ImageIcon size={42} />
      <span className="text-sm font-black">Изображения пока не загружены</span>
    </div>
  );
}
