import type { ApiPaginationMeta } from "@/src/shared/api";
import { Button } from "@/src/shared/ui/shadcn/button";

type PaginationProps = {
  align?: "between" | "end";
  isLoading?: boolean;
  meta: ApiPaginationMeta;
  onPageChange: (page: number | ((currentPage: number) => number)) => void;
  page: number;
  showRange?: boolean;
};

export function Pagination({
  align = "end",
  isLoading = false,
  meta,
  onPageChange,
  page,
  showRange = false,
}: PaginationProps) {
  if (meta.lastPage <= 1) {
    return null;
  }

  return (
    <div
      className={[
        "mt-7 flex flex-wrap items-center gap-4 border-t border-[var(--border-soft)] pt-5",
        align === "between" ? "justify-between" : "justify-end",
      ].join(" ")}
    >
      {showRange ? (
        <p className="text-sm font-semibold text-[var(--text-muted)]">
          {meta.from ?? 0}-{meta.to ?? 0} из {meta.total}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange((currentPage) => Math.max(currentPage - 1, 1))}
          type="button"
          variant="outline"
        >
          Назад
        </Button>
        <span className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--brand-deep)]">
          {meta.currentPage} / {meta.lastPage}
        </span>
        <Button
          disabled={page >= meta.lastPage || isLoading}
          onClick={() => onPageChange((currentPage) => Math.min(currentPage + 1, meta.lastPage))}
          type="button"
          variant="outline"
        >
          Вперед
        </Button>
      </div>
    </div>
  );
}
