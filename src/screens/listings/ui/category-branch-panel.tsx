import Link from "next/link";
import { ChevronRight, Tags } from "lucide-react";
import type { CategoryNode } from "@/src/entities/category";
import { Skeleton } from "@/src/shared/ui/skeleton";

type CategoryBranchPanelProps = {
  branch: CategoryNode | null;
  errorMessage: string | null;
  selectedCategoryId?: string;
  status: "idle" | "loading" | "success" | "error";
};

export function CategoryBranchPanel({
  branch,
  errorMessage,
  selectedCategoryId,
  status,
}: CategoryBranchPanelProps) {
  if (!selectedCategoryId) {
    return null;
  }

  if (status === "loading" && branch === null) {
    return (
      <section className="mt-6 rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_74%,transparent)] p-5">
        <Skeleton className="h-6 w-2/5" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </section>
    );
  }

  if (status === "error" && branch === null) {
    return (
      <section className="mt-6 rounded-[30px] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_74%,transparent)] p-5 text-sm font-semibold text-[var(--text-muted)]">
        {errorMessage ?? "Не удалось загрузить ветку категории."}
      </section>
    );
  }

  if (branch === null) {
    return null;
  }

  const breadcrumbs = findCategoryPath(branch, selectedCategoryId) ?? [branch];

  return (
    <section className="mt-6 rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--text-muted)]">
        <Link className="hover:text-[var(--brand-deep)]" href="/">
          Все объявления
        </Link>
        {breadcrumbs.map((category, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div
              className="contents"
              key={String(category.id)}
            >
              <ChevronRight aria-hidden="true" size={15} />
              {isLast ? (
                <span className="text-[var(--brand-deep)]">{category.name}</span>
              ) : (
                <Link
                  className="transition hover:text-[var(--brand-deep)]"
                  href={`/?categoryId=${category.id}`}
                >
                  {category.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {branch.children.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {branch.children.map((category) => (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--brand-deep)] transition hover:border-[var(--brand)] hover:bg-[var(--accent-soft)]"
              href={`/?categoryId=${category.id}`}
              key={String(category.id)}
            >
              <Tags aria-hidden="true" size={15} />
              {category.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
          Это конечная категория. Ниже показаны товары и услуги из выбранного раздела.
        </p>
      )}
    </section>
  );
}

function findCategoryPath(
  category: CategoryNode,
  targetCategoryId: string | undefined,
  path: CategoryNode[] = [],
): CategoryNode[] | null {
  const nextPath = [...path, category];

  if (String(category.id) === targetCategoryId) {
    return nextPath;
  }

  for (const child of category.children) {
    const childPath = findCategoryPath(child, targetCategoryId, nextPath);

    if (childPath !== null) {
      return childPath;
    }
  }

  return null;
}
