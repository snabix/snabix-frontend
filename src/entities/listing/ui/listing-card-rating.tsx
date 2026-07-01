import { Star } from "lucide-react";

export function ListingCardStarRow({ rating }: { rating: number }) {
  const activeStars = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-[var(--accent)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          className={index < activeStars ? "text-[var(--accent)]" : "text-[color-mix(in_srgb,var(--text-muted)_34%,white)]"}
          fill="currentColor"
          key={index}
          size={14}
        />
      ))}
    </span>
  );
}
