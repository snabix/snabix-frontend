"use client";

import { ChevronRight, LoaderCircle } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";
import type { CategoryNode } from "@/src/entities/category";

type CategoryCatalogRootsProps = {
  activeRootId: number | null;
  hasLoadedCategories: boolean;
  onRetry: () => void;
  onRootClick: (categoryId: number) => void;
  onRootFocus: (categoryId: number) => void;
  onRootHover: (categoryId: number) => void;
  roots: CategoryNode[];
  rootsErrorMessage: string | null;
  rootsStatus: "idle" | "loading" | "success" | "error";
};

export function CategoryCatalogRoots({
  activeRootId,
  hasLoadedCategories,
  onRetry,
  onRootClick,
  onRootFocus,
  onRootHover,
  roots,
  rootsErrorMessage,
  rootsStatus,
}: CategoryCatalogRootsProps) {
  const activeRootButtonClass = "bg-[color-mix(in_srgb,var(--accent-soft)_82%,var(--background))] text-[var(--brand-deep)]";

  return (
    <aside className="surface-card flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] p-4 sm:p-5">
      {rootsStatus === "loading" && !hasLoadedCategories ? (
        <div className="mt-4 flex min-h-[18rem] items-center justify-center">
          <LoaderCircle className="animate-spin text-[var(--brand-deep)]" size={30} />
        </div>
      ) : null}

      {rootsStatus === "error" && !hasLoadedCategories ? (
        <div className="mt-4 rounded-[24px] border border-dashed border-[var(--border-strong)] px-4 py-6 text-center">
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            {rootsErrorMessage ?? "Не удалось загрузить разделы."}
          </p>
          <Button
            className="mt-4 rounded-[16px]"
            onClick={onRetry}
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
              const isActive = category.id === activeRootId;

              return (
                <button
                  key={category.id}
                  className={[
                    "group relative flex min-h-[72px] w-full items-center overflow-hidden rounded-[5px] px-5 py-4 text-left",
                    "transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
                    isActive
                      ? activeRootButtonClass
                      : "bg-transparent text-[var(--brand-deep)] hover:bg-[color-mix(in_srgb,var(--accent-soft)_82%,var(--background))]",
                  ].join(" ")}
                  onClick={() => onRootClick(category.id)}
                  onFocus={() => onRootFocus(category.id)}
                  onMouseEnter={() => onRootHover(category.id)}
                  type="button"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-bold leading-6 text-[var(--brand-deep)]">
                        {category.name}
                      </p>
                    </div>

                    <span
                      className={[
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center",
                        "transition-colors duration-200 ease-out",
                        isActive
                          ? "text-[var(--brand-deep)]"
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
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
