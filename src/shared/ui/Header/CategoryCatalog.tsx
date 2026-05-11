"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Spin } from "antd";
import { ChevronRight, LayoutGrid } from "lucide-react";
import {
  useCategoryStore,
} from "@/src/entities/category";
type CategoryCatalogProps = {
  isOpen: boolean;
  onToggle: () => void;
  topOffset: number;
};

export function CategoryCatalog({
  isOpen,
  onToggle,
  topOffset,
}: CategoryCatalogProps) {
  const [activeRootId, setActiveRootId] = useState<number | null>(null);
  const roots                 = useCategoryStore((state) => state.roots);
  const rootsStatus           = useCategoryStore((state) => state.rootsStatus);
  const rootsErrorMessage     = useCategoryStore((state) => state.rootsErrorMessage);
  const branches              = useCategoryStore((state) => state.branches);
  const branchStatuses        = useCategoryStore((state) => state.branchStatuses);
  const branchErrorMessages   = useCategoryStore((state) => state.branchErrorMessages);
  const loadRoots             = useCategoryStore((state) => state.loadRoots);
  const loadBranch            = useCategoryStore((state) => state.loadBranch);
  const resetRootError        = useCategoryStore((state) => state.resetRootError);
  const resetBranchError      = useCategoryStore((state) => state.resetBranchError);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void loadRoots();
  }, [isOpen, loadRoots]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (!isOpen || activeRootId === null) {
      return;
    }

    void loadBranch(activeRootId);
  }, [activeRootId, isOpen, loadBranch]);

  if (!isOpen) {
    return null;
  }

  const portalRoot = typeof document === "undefined" ? null : document.body;

  if (portalRoot === null) {
    return null;
  }

  const resolvedRootId        = activeRootId ?? roots[0]?.id ?? null;
  const activeRoot            = roots.find((item) => item.id === resolvedRootId) ?? roots[0] ?? null;
  const activeBranch          = resolvedRootId !== null ? branches[resolvedRootId] ?? null : null;
  const activeBranchStatus    = resolvedRootId !== null ? branchStatuses[resolvedRootId] ?? "idle" : "idle";
  const activeBranchError     = resolvedRootId !== null ? branchErrorMessages[resolvedRootId] ?? null : null;
  const hasLoadedCategories   = roots.length > 0;
  const activeRootButtonClass = "bg-[color-mix(in_srgb,var(--accent-soft)_82%,white)] text-[var(--brand-deep)]";

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 mt-5 z-30 overflow-hidden bg-[color-mix(in_srgb,var(--background)_96%,transparent)]"
      style={{ top: `${topOffset}px` }}
    >
      <div className="relative h-full px-3 py-3 sm:px-4 sm:py-4">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[352px_minmax(0,1fr)] xl:gap-5">
            <aside className="surface-card flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] p-4 sm:p-5">

              {rootsStatus === "loading" && !hasLoadedCategories ? (
                <div className="mt-4 flex min-h-[18rem] items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : null}

              {rootsStatus === "error" && !hasLoadedCategories ? (
                <div className="mt-4 rounded-[24px] border border-dashed border-[var(--border-strong)] px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">
                    {rootsErrorMessage ?? "Не удалось загрузить разделы."}
                  </p>
                  <Button
                    className="mt-4 !rounded-[16px]"
                    onClick={resetRootError}
                  >
                    Повторить
                  </Button>
                </div>
              ) : null}

              {hasLoadedCategories ? (
                <div className="mt-1 min-h-0 flex-1 overflow-hidden">
                  <div className="flex h-full min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain pr-1">
                  {roots.map((category) => {
                    const isActive = category.id === activeRoot?.id;
                    const rootButtonLabelClass = isActive
                      ? "text-[var(--brand-deep)]"
                      : "text-[var(--brand-deep)]";

                    return (
                      <button
                        key={category.id}
                        className={[
                          "group relative flex min-h-[72px] w-full items-center overflow-hidden rounded-[5px] px-5 py-4 text-left",
                          "transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
                          isActive
                            ? activeRootButtonClass
                            : "bg-transparent text-[var(--brand-deep)] hover:bg-[color-mix(in_srgb,var(--accent-soft)_82%,white)]",
                        ].join(" ")}
                        onClick={() => setActiveRootId(category.id)}
                        onFocus={() => setActiveRootId(category.id)}
                        onMouseEnter={() => setActiveRootId(category.id)}
                        type="button"
                      >
                        <div className="flex w-full items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className={["text-[16px] font-bold leading-6", rootButtonLabelClass].join(" ")}>
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

            <section className="surface-card h-full min-h-0 overflow-hidden rounded-[24px] p-5 sm:p-7">
              {rootsStatus === "loading" && !hasLoadedCategories ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center gap-4 text-center">
                  <Spin size="large" />
                  <p className="text-sm font-semibold text-[var(--text-muted)]">
                    Данные загружаются...
                  </p>
                </div>
              ) : null}

              {rootsStatus === "error" && !hasLoadedCategories && rootsErrorMessage ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center gap-4 text-center">
                  <div className="grid size-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
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
                    className="active-button !h-11 !rounded-[18px] !border-none !px-5 !font-semibold"
                    onClick={resetRootError}
                    type="primary"
                  >
                    Повторить загрузку
                  </Button>
                </div>
              ) : null}

              {(rootsStatus === "success" || hasLoadedCategories) && activeRoot ? (
                <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6">
                  <div className="border-b border-[var(--border-soft)] pb-4">
                    <h3 className="font-heading text-[1.9rem] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                      {activeRoot.name}
                    </h3>
                  </div>

                  {activeBranchStatus === "loading" && activeBranch === null ? (
                    <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 rounded-[28px] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-center">
                      <Spin size="large" />
                      <p className="text-sm font-semibold text-[var(--text-muted)]">
                        Данные загружаются...
                      </p>
                    </div>
                  ) : null}

                  {activeBranchStatus === "error" && activeBranch === null ? (
                    <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 rounded-[28px] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-center">
                      <p className="text-lg font-black text-[var(--brand-deep)]">
                        Не удалось открыть раздел
                      </p>
                      <p className="max-w-md text-sm leading-7 text-[var(--text-muted)]">
                        {activeBranchError ?? "Попробуйте еще раз чуть позже."}
                      </p>
                      <Button
                        className="active-button !h-11 !rounded-[18px] !border-none !px-5 !font-semibold"
                        onClick={() => {
                          if (resolvedRootId === null) {
                            return;
                          }

                          resetBranchError(resolvedRootId);
                        }}
                        type="primary"
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
                          <p className="text-[1rem] font-extrabold leading-6 tracking-[-0.01em] text-[var(--brand-deep)]">
                            {category.name}
                          </p>

                          {category.children.length > 0 ? (
                            <ul className="mt-3 grid gap-2">
                              {category.children.map((child) => (
                                <li
                                  key={child.id}
                                  className="text-sm leading-6 text-[var(--text-muted)]"
                                >
                                  {child.name}
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
                    <div className="rounded-[20px] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-6 py-10 text-center">
                      <p className="text-lg font-black text-[var(--brand-deep)]">
                        В этой категории пока нет вложенных разделов
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {(rootsStatus === "success" || hasLoadedCategories) && activeRoot === null ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center gap-4 text-center">
                  <div className="grid size-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <LayoutGrid aria-hidden="true" size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[var(--brand-deep)]">
                      Категории пока не заполнены
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-7 text-[var(--text-muted)]">
                      После импорта или ручного наполнения здесь появится полное дерево каталога.
                    </p>
                  </div>
                </div>
              ) : null}
            </section>
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
