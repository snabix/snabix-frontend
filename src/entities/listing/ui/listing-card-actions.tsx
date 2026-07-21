import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { cn } from "@/src/shared/lib/utils";

type ListingFavoriteButtonProps = {
  isFavorite: boolean;
  listingId: string;
  onFavoriteToggle?: (listingId: string) => void;
};

type ListingSelectToggleProps = {
  isSelected: boolean;
  listingId: string;
  onSelectToggle: (listingId: string) => void;
};

export function ListingFavoriteButton({
  isFavorite,
  listingId,
  onFavoriteToggle,
}: ListingFavoriteButtonProps) {
  return (
    <button
      aria-label={isFavorite ? "Удалить объявление из избранного" : "Добавить объявление в избранное"}
      className={cn(
        "pointer-events-auto relative z-30 grid size-11 place-items-center rounded-full border shadow-[var(--shadow-card)] transition-colors",
        isFavorite
          ? "border-[color-mix(in_srgb,var(--danger)_24%,var(--border-soft))] bg-[color-mix(in_srgb,var(--danger)_10%,var(--surface))] text-[var(--danger)]"
          : "border-[color-mix(in_srgb,var(--surface)_54%,transparent)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--surface)_100%,transparent)]",
      )}
      onClick={(event) => handleFavoriteClick(event, listingId, onFavoriteToggle)}
      type="button"
    >
      <Heart
        fill={isFavorite ? "currentColor" : "none"}
        size={19}
        strokeWidth={2.4}
      />
    </button>
  );
}

export function ListingSelectToggle({
  isSelected,
  listingId,
  onSelectToggle,
}: ListingSelectToggleProps) {
  return (
    <label className="pointer-events-auto absolute left-4 top-4 z-30 grid size-11 cursor-pointer place-items-center rounded-full border border-[color-mix(in_srgb,var(--surface)_54%,transparent)] bg-[color-mix(in_srgb,var(--brand-deep)_34%,transparent)] shadow-[var(--shadow-card)]">
      <span className="sr-only">
        {isSelected ? "Снять выбор объявления" : "Выбрать объявление"}
      </span>

      <Checkbox
        checked={isSelected}
        className="border-[color-mix(in_srgb,var(--surface)_82%,transparent)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)]"
        onCheckedChange={() => onSelectToggle(listingId)}
      />
    </label>
  );
}

function handleFavoriteClick(
  event: MouseEvent<HTMLButtonElement>,
  listingId: string,
  onFavoriteToggle?: (listingId: string) => void,
): void {
  event.preventDefault();
  event.stopPropagation();
  onFavoriteToggle?.(listingId);
}
