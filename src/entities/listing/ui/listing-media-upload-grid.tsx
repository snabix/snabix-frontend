import { ImagePlus, X } from "lucide-react";
import { MediaImage } from "@/src/shared/ui/media-image";

type ListingMediaUploadGridProps = {
  availableSlots: number;
  isDisabled?: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  previews: Array<{
    id: string;
    name: string;
    url: string;
  }>;
};

export function ListingMediaUploadGrid({
  availableSlots,
  isDisabled = false,
  onAdd,
  onRemove,
  previews,
}: ListingMediaUploadGridProps) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {previews.map((preview, index) => (
        <div
          className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] border border-[var(--border-soft)] bg-[var(--surface-muted)]"
          key={preview.id}
        >
          <MediaImage
            alt={preview.name}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={preview.url}
          />
          <button
            aria-label={`Удалить фото ${preview.name}`}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-deep)_72%,transparent)] text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--brand-deep)]"
            onClick={() => onRemove(index)}
            type="button"
          >
            <X size={16} />
          </button>
          {index === 0 ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-3 py-1 text-xs font-black text-[var(--brand-deep)]">
              Главное фото
            </span>
          ) : null}
        </div>
      ))}

      {Array.from({ length: Math.max(availableSlots, 0) }).map((_, index) => (
        <button
          aria-label="Добавить фото объявления"
          className="grid aspect-[4/3] place-items-center rounded-[var(--radius-media)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--brand-deep)]"
          disabled={isDisabled}
          key={`empty-${index}`}
          onClick={onAdd}
          type="button"
        >
          <span className="grid justify-items-center gap-2 text-sm font-black">
            <ImagePlus size={24} />
            Фото
          </span>
        </button>
      ))}
    </div>
  );
}
