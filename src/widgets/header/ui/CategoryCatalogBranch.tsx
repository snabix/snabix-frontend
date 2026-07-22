import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/shared/ui/shadcn/button";
import { type CategoryNode } from "@/src/entities/category";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Skeleton } from "@/src/shared/ui/skeleton";

type CategoryCatalogBranchProps = {
  activeBranch: CategoryNode | null;
  activeBranchError: string | null;
  activeBranchStatus: "idle" | "loading" | "success" | "error";
  activeRoot: CategoryNode | null;
  hasLoadedCategories: boolean;
  onCategorySelect: () => void;
  onRetryBranch: () => void;
  onRetryRoots: () => void;
  rootsErrorMessage: string | null;
  rootsStatus: "idle" | "loading" | "success" | "error";
};

export function CategoryCatalogBranch({
  activeBranch,
  activeBranchError,
  activeBranchStatus,
  activeRoot,
  hasLoadedCategories,
  onCategorySelect,
  onRetryBranch,
  onRetryRoots,
  rootsErrorMessage,
  rootsStatus,
}: CategoryCatalogBranchProps) {
  return (
    <section className="surface-card h-full min-h-0 overflow-hidden rounded-[var(--radius-surface)] p-5 sm:p-7">
      {rootsStatus === "loading" && !hasLoadedCategories ? (
        <div className="grid min-h-[28rem] content-start gap-5">
          <Skeleton className="h-10 w-2/5" />
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2 2xl:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        </div>
      ) : null}

      {rootsStatus === "error" && !hasLoadedCategories && rootsErrorMessage ? (
        <div className="flex min-h-[28rem] flex-col items-center justify-center gap-4 text-center">
          <div className="grid size-14 place-items-center rounded-[var(--radius-control)] bg-[var(--accent-soft)] text-[var(--accent)]">
            <LayoutGrid aria-hidden="true" size={24} />
          </div>
          <div>
            <p className="text-lg font-black text-[var(--brand-deep)]">
              Каталог пока недоступен
            </p>
            <p className="mt-2 max-w-md text-sm leading-7 text-[var(--text-muted)]">
              {rootsErrorMessage}
            </p>
          </div>
          <Button
            className="rounded-[var(--radius-control)] px-5 font-semibold"
            onClick={onRetryRoots}
          >
            Повторить загрузку
          </Button>
        </div>
      ) : null}

      {(rootsStatus === "success" || hasLoadedCategories) && activeRoot ? (
        <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6">
          <div className="border-b border-[var(--border-soft)] pb-4">
            <h3 className="font-heading text-[1.9rem] font-extrabold tracking-normal text-[var(--brand-deep)]">
              {activeRoot.name}
            </h3>
          </div>

          {activeBranchStatus === "loading" && activeBranch === null ? (
            <div className="grid min-h-[22rem] content-start gap-5 border-y border-[var(--border-soft)] py-5">
              <Skeleton className="h-8 w-2/5" />
              <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2 2xl:grid-cols-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            </div>
          ) : null}

          {activeBranchStatus === "error" && activeBranch === null ? (
            <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 border-y border-[var(--border-soft)] text-center">
              <p className="text-lg font-black text-[var(--brand-deep)]">
                Не удалось открыть раздел
              </p>
              <p className="max-w-md text-sm leading-7 text-[var(--text-muted)]">
                {activeBranchError ?? "Попробуйте еще раз чуть позже."}
              </p>
              <Button
                className="rounded-[var(--radius-control)] px-5 font-semibold"
                onClick={onRetryBranch}
              >
                Повторить загрузку
              </Button>
            </div>
          ) : null}

          {activeBranch?.children.length ? (
            <div className="min-h-0 overflow-y-auto pr-1">
              <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2 2xl:grid-cols-3">
                {activeBranch.children.map((category) => (
                  <div
                    key={category.id}
                    className="min-w-0"
                  >
                    <CategoryTitleLink
                      category={category}
                      onCategorySelect={onCategorySelect}
                    />

                    {category.children.length > 0 ? (
                      <ul className="mt-3 grid gap-2">
                        {category.children.map((child) => (
                          <li
                            key={child.id}
                            className="text-sm leading-6 text-[var(--text-muted)]"
                          >
                            <Link
                              className="transition-colors duration-200 hover:text-[var(--brand)]"
                              href={`/?categoryId=${child.id}`}
                              onClick={onCategorySelect}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                        Подкатегории пока не добавлены.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeBranchStatus === "success" && activeBranch !== null && activeBranch.children.length === 0 ? (
            <EmptyState
              description="Как только раздел наполнят подкатегориями, они появятся в этом каталоге."
              icon={LayoutGrid}
              title="В этой категории пока нет вложенных разделов"
            />
          ) : null}
        </div>
      ) : null}

      {(rootsStatus === "success" || hasLoadedCategories) && activeRoot === null ? (
        <EmptyState
          description="После импорта или ручного наполнения здесь появится полное дерево каталога."
          icon={LayoutGrid}
          title="Категории пока не заполнены"
        />
      ) : null}
    </section>
  );
}

function CategoryTitleLink({
  category,
  onCategorySelect,
}: {
  category: CategoryNode;
  onCategorySelect: () => void;
}) {
  return (
    <Link
      className="inline-flex text-[1rem] font-extrabold leading-6 tracking-normal text-[var(--brand-deep)] transition-colors duration-200 hover:text-[var(--brand)]"
      href={`/?categoryId=${category.id}`}
      onClick={onCategorySelect}
    >
      {category.name}
    </Link>
  );
}
