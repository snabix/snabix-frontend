import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/shared/ui/shadcn/avatar";
import { formatReviewCount } from "@/src/entities/listing/lib/listing-card-formatters";

type ListingCardSellerProps = {
  href: string;
  initials: string;
  name: string;
  ratingLabel: string;
  reviewCount: number;
};

export function ListingCardSeller({
  href,
  initials,
  name,
  ratingLabel,
  reviewCount,
}: ListingCardSellerProps) {
  return (
    <Link
      className="group/seller pointer-events-auto relative z-30 flex min-w-0 items-center justify-between gap-4 rounded-[var(--radius-surface)] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-4 py-3 text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[color-mix(in_srgb,var(--brand-deep)_88%,black)] focus-visible:outline-none"
      href={href}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-12 border border-[var(--border-soft)] shadow-[var(--shadow-card)]">
          <AvatarFallback className="text-sm font-black">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-normal text-white">
            {name}
          </p>

          <div className="mt-1 grid gap-1">
            <p className="inline-flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/80">
              <Star className="text-white" fill="currentColor" size={15} />

              <span className="font-bold text-white">
                {ratingLabel}
              </span>

              <span>рейтинг продавца</span>
            </p>
            <p className="text-xs font-semibold text-white/72">
              {formatReviewCount(reviewCount)}
            </p>
          </div>
        </div>
      </div>

      <ChevronRight
        className="shrink-0 text-white/80 transition group-hover/seller:translate-x-1 group-hover/seller:text-white"
        size={28}
        strokeWidth={1.8}
      />
    </Link>
  );
}
