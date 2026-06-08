import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/shared/ui/shadcn/button";
import { renderCategoryIcon, type CategoryNode } from "@/src/entities/category";
import { Skeleton } from "@/src/shared/ui/skeleton";

type CategoryCatalogRootsProps = {
  activeRootId: string | null;
  hasLoadedCategories: boolean;
  onRetryAction: () => void;
  onCategorySelectAction: () => void;
  onRootClickAction: (categoryId: string) => void;
  onRootFocusAction: (categoryId: string) => void;
  onRootHoverAction: (categoryId: string) => void;
  roots: CategoryNode[];
  rootsErrorMessage: string | null;
  rootsStatus: "idle" | "loading" | "success" | "error";
};

export function CategoryCatalogRoots({
  activeRootId,
  hasLoadedCategories,
  onCategorySelectAction,
  onRetryAction,
  onRootClickAction,
  onRootFocusAction,
  onRootHoverAction,
  roots,
  rootsErrorMessage,
  rootsStatus,
}: CategoryCatalogRootsProps) {
  const activeRootButtonClass = "text-[var(--brand)]";

  return (
    <aside className="surface-card flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] p-4 sm:p-5">
      {rootsStatus === "loading" && !hasLoadedCategories ? (
        <div className="mt-4 grid min-h-[18rem] content-start gap-2">
          <Skeleton className="h-[72px] rounded-[5px]" />
          <Skeleton className="h-[72px] rounded-[5px]" />
          <Skeleton className="h-[72px] rounded-[5px]" />
          <Skeleton className="h-[72px] rounded-[5px]" />
        </div>
      ) : null}

      {rootsStatus === "error" && !hasLoadedCategories ? (
        <div className="mt-4 rounded-[24px] border border-dashed border-[var(--border-strong)] px-4 py-6 text-center">
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            {rootsErrorMessage ?? "Не удалось загрузить разделы."}
          </p>
          <Button
            className="mt-4 rounded-[16px]"
            onClick={onRetryAction}
            variant="outline"
          >
            Повторить
          </Button>
        </div>
      ) : null}

      {hasLoadedCategories ? (
        <div className="mt-1 min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain pr-1">
            {roots.map((category) => {
              const categoryId = String(category.id);
              const isActive = categoryId === activeRootId;

              return (
                <Link
                  key={categoryId}
                  className={[
                    "group relative flex min-h-[72px] w-full items-center overflow-hidden rounded-[5px] px-5 py-4 text-left",
                    "transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
                    isActive
                      ? activeRootButtonClass
                      : "bg-transparent text-[var(--brand-deep)] hover:text-[var(--brand)]",
                  ].join(" ")}
                  href={`/?categoryId=${categoryId}`}
                  onClick={() => {
                    onRootClickAction(categoryId);
                    onCategorySelectAction();
                  }}
                  onFocus={() => onRootFocusAction(categoryId)}
                  onMouseEnter={() => onRootHoverAction(categoryId)}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <span
                      className={[
                        "grid size-10 shrink-0 place-items-center rounded-2xl transition-colors",
                        isActive
                          ? "bg-[var(--accent-soft)] text-[var(--brand)]"
                          : "bg-[var(--accent-soft)] text-[var(--brand-deep)] group-hover:text-[var(--brand)]",
                      ].join(" ")}
                    >
                      {renderCategoryIcon(category, 18)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-bold leading-6 transition-colors duration-200">
                        {category.name}
                      </p>
                    </div>

                    <span
                      className={[
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center",
                        "transition-colors duration-200 ease-out",
                        isActive
                          ? "text-[var(--brand)]"
                          : "text-[var(--brand-deep)] group-hover:text-[var(--brand)]",
                      ].join(" ")}
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className="transition-none"
                        size={18}
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
