"use client";

import { useEffect, useState, useTransition } from "react";
import {
    LayoutGrid,
    List,
    PackageOpen,
    RefreshCw,
    SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { ListingCard, type PublicListingItem } from "@/src/entities/listing";
import { listPublicListings, type ListPublicListingsParams } from "@/src/features/listing/api";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Container } from "@/src/shared/ui/container";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";
import {
    defaultPublicListingFilters,
    PublicListingFilters,
    type PublicListingFiltersState,
} from "./public-listing-filters";
import { CategoryShowcaseCarouselSection } from "./category-showcase-carousel-section";

const publicListingsPerPage = 16;

const defaultPaginationMeta: ApiPaginationMeta = {
    currentPage: 1,
    from: null,
    lastPage: 1,
    perPage: publicListingsPerPage,
    to: null,
    total: 0,
};

type HomePageProps = {
    initialCategoryId?: string;
};

export function HomePage({ initialCategoryId }: HomePageProps) {
    const [items, setItems] = useState<PublicListingItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { favoriteListingIds, setFavoriteListingIds, toggleFavorite } = useFavoriteListings();
    const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultPaginationMeta);
    const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
    const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [, startFiltersTransition] = useTransition();

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            startFiltersTransition(() => {
                setPage(1);
                setAppliedFilters(draftFilters);
            });
        }, 450);

        return () => window.clearTimeout(timeoutId);
    }, [draftFilters]);

    useEffect(() => {
        document.body.style.overflow = isFiltersOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isFiltersOpen]);

    useEffect(() => {
        let isMounted = true;

        const loadItems = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const listings = await listPublicListings({
                    ...toPublicListingParams(appliedFilters),
                    categoryId: initialCategoryId,
                    page,
                    perPage: publicListingsPerPage,
                });

                if (!isMounted) {
                    return;
                }

                setItems(listings.items);
                setFavoriteListingIds((currentIds) => {
                    const nextIds = new Set(currentIds);
                    listings.items.forEach((item) => {
                        if (item.isFavorite) {
                            nextIds.add(item.id);
                        }
                    });

                    return nextIds;
                });
                setPaginationMeta(listings.meta);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                const message = extractApiError(error, "Не удалось загрузить объявления.");

                setErrorMessage(message);
                setItems([]);
                setPaginationMeta(defaultPaginationMeta);
                toast.error(message);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadItems();

        return () => {
            isMounted = false;
        };
    }, [appliedFilters, initialCategoryId, page, setFavoriteListingIds]);

    const handleFiltersReset = () => {
        setDraftFilters(defaultPublicListingFilters);
        setAppliedFilters(defaultPublicListingFilters);
        setPage(1);
    };

    return (
        <main className="pb-12 pt-6">
            <Container>
                <CategoryShowcaseCarouselSection />

                <section className="mt-8">
                    <div className="mb-5">
                        <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                            Живая витрина
                        </p>

                        <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
                            Актуальные предложения рядом
                        </h2>
                    </div>

                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-3 text-sm font-black text-[var(--brand-deep)] shadow-[var(--shadow-card)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                            onClick={() => setIsFiltersOpen(true)}
                            type="button"
                        >
                            <SlidersHorizontal size={17} />
                            Фильтры
                        </button>

                        <ViewModeSwitcher onChangeAction={setViewMode} value={viewMode} />
                    </div>

                    <div className="min-w-0">
                        {isLoading ? (
                            <SkeletonPanel className="min-h-[280px]" />
                        ) : errorMessage !== null ? (
                            <EmptyState
                                action={
                                    <Button
                                        className="rounded-[18px] px-5 py-6"
                                        onClick={() => window.location.reload()}
                                        type="button"
                                    >
                                        Обновить страницу
                                    </Button>
                                }
                                description="Мы не смогли получить объявления с сервера. Можно обновить страницу чуть позже или перейти в личный кабинет, если нужно продолжить работу с объявлениями."
                                icon={RefreshCw}
                                title="Витрина временно недоступна"
                            />
                        ) : items.length === 0 ? (
                            <EmptyState
                                description="После запуска первых публикаций здесь появится живая витрина товаров и услуг."
                                icon={PackageOpen}
                                title="Пока нет опубликованных объявлений"
                            />
                        ) : (
                            <>
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4"
                                            : "grid gap-4"
                                    }
                                >
                                    {items.map((item) => (
                                        <ListingCard
                                            detailsHref={`/listings/${item.id}`}
                                            isFavorite={favoriteListingIds.has(item.id)}
                                            key={item.id}
                                            listing={item}
                                            onFavoriteToggleAction={toggleFavorite}
                                            showStatus={false}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>

                                <Pagination
                                    isLoading={isLoading}
                                    meta={paginationMeta}
                                    onPageChangeAction={setPage}
                                    page={page}
                                />
                            </>
                        )}
                    </div>
                </section>
            </Container>

            <FiltersDrawer
                filters={draftFilters}
                isLoading={isLoading}
                isOpen={isFiltersOpen}
                onChangeAction={setDraftFilters}
                onCloseAction={() => setIsFiltersOpen(false)}
                onResetAction={handleFiltersReset}
            />
        </main>
    );
}

function FiltersDrawer({
                           filters,
                           isLoading,
                           isOpen,
                           onChangeAction,
                           onCloseAction,
                           onResetAction,
                       }: {
    filters: PublicListingFiltersState;
    isLoading: boolean;
    isOpen: boolean;
    onChangeAction: (filters: PublicListingFiltersState) => void;
    onCloseAction: () => void;
    onResetAction: () => void;
}) {
    return (
        <div
            aria-hidden={!isOpen}
            className={[
                "fixed inset-0 z-50 transition",
                isOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
        >
            <button
                aria-label="Закрыть фильтры"
                className={[
                    "absolute inset-0 bg-[color-mix(in_srgb,var(--brand-deep)_42%,transparent)] backdrop-blur-sm transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={onCloseAction}
                type="button"
            />

            <aside
                aria-label="Фильтры объявлений"
                className={[
                    "absolute left-0 top-0 h-full w-full max-w-[390px] overflow-hidden border-r border-[var(--border-soft)] bg-[var(--surface)] shadow-2xl transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
            >
                <PublicListingFilters
                    filters={filters}
                    isLoading={isLoading}
                    onChangeAction={onChangeAction}
                    onResetAction={onResetAction}
                />
            </aside>
        </div>
    );
}

function ViewModeSwitcher({
                              onChangeAction,
                              value,
                          }: {
    onChangeAction: (value: "grid" | "list") => void;
    value: "grid" | "list";
}) {
    return (
        <div className="flex w-fit rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-1">
            <button
                aria-label="Показать объявления сеткой"
                className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
                    value === "grid"
                        ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
                ].join(" ")}
                onClick={() => onChangeAction("grid")}
                type="button"
            >
                <LayoutGrid size={16} />
            </button>

            <button
                aria-label="Показать объявления списком"
                className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
                    value === "list"
                        ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
                ].join(" ")}
                onClick={() => onChangeAction("list")}
                type="button"
            >
                <List size={16} />
            </button>
        </div>
    );
}

function toPublicListingParams(
    filters: PublicListingFiltersState,
): ListPublicListingsParams & { isNegotiable?: boolean } {
    return {
        maxPrice: toOptionalNumber(filters.maxPrice),
        minPrice: toOptionalNumber(filters.minPrice),
        cityQuery: toOptionalString(filters.cityQuery),
        regionQuery: toOptionalString(filters.regionQuery),
        sort: filters.sort,
        type: toOptionalNumber(filters.type),
        ...(filters.isNegotiable ? { isNegotiable: true } : {}),
    };
}

function toOptionalNumber(value: string): number | undefined {
    const normalizedValue = value.trim();

    if (normalizedValue === "") {
        return undefined;
    }

    const parsedValue = Number(normalizedValue);

    return Number.isFinite(parsedValue) && parsedValue >= 0
        ? parsedValue
        : undefined;
}

function toOptionalString(value: string): string | undefined {
    const normalizedValue = value.trim();

    return normalizedValue === "" ? undefined : normalizedValue;
}
