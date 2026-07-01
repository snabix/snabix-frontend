import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { CategoryBreadcrumb } from "../lib/listing-details-formatters";

type ListingDetailsBreadcrumbsProps = {
  categoryBreadcrumbs: CategoryBreadcrumb[];
};

export function ListingDetailsBreadcrumbs({ categoryBreadcrumbs }: ListingDetailsBreadcrumbsProps) {
  return (
    <div className="grid gap-3">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--brand-deep)]"
        href="/account/listings"
      >
        <ArrowLeft size={17} />
        Назад
      </Link>

      <nav
        aria-label="Категория объявления"
        className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--text-muted)]"
      >
        <Link className="transition hover:text-[var(--brand-deep)]" href="/">
          Объявления
        </Link>
        {categoryBreadcrumbs.map((category) => (
          <span className="inline-flex items-center gap-2" key={category.id}>
            <ChevronRight size={15} />
            <Link
              className="transition hover:text-[var(--brand-deep)]"
              href={`/?categoryId=${encodeURIComponent(String(category.id))}`}
            >
              {category.name}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
