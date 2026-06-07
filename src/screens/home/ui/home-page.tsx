"use client";

import { useEffect, useState, useTransition } from "react";
import { LayoutGrid, List, PackageOpen, RefreshCw } from "lucide-react";
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
import { BannerCarouselSection } from "./banner-carousel-section";
import { CategoryShowcaseCarouselSection } from "./category-showcase-carousel-section";

const publicListingsPerPage = 15;

const defaultPaginationMeta: ApiPaginationMeta = {
    currentPage: 1,
    from: null,
    lastPage: 1,
    perPage: publicListingsPerPage,
    to: null,
    total: 0,
};

export function HomePage() {
    const [items, setItems] = useState<PublicListingItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { favoriteListingIds, toggleFavorite } = useFavoriteListings();
    const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultPaginationMeta);
    const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
    const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
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
        let isMounted = true;

        const loadItems = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const listings = await listPublicListings({
                    ...toPublicListingParams(appliedFilters),
                    page,
                    perPage: publicListingsPerPage,
                });

                if (!isMounted) {
                    return;
                }

                setItems(listings.items);
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
    }, [appliedFilters, page]);

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
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                                Живая витрина
                            </p>
                            <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
                                Актуальные предложения рядом
                            </h2>
                        </div>

                        <ViewModeSwitcher onChange={setViewMode} value={viewMode} />
                    </div>

                    <div className="grid gap-5 xl:flex xl:items-start">
                        <PublicListingFilters
                            filters={draftFilters}
                            isLoading={isLoading}
                            onChange={setDraftFilters}
                            onReset={handleFiltersReset}
                        />

                        <div className="min-w-0 flex-1">
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
                                    <div className={viewMode === "grid" ? "grid gap-5 lg:grid-cols-3" : "grid gap-4"}>
                                        {items.map((item) => (
                                            <ListingCard
                                                detailsHref={`/account/listings/${item.id}`}
                                                isFavorite={favoriteListingIds.has(item.id)}
                                                key={item.id}
                                                listing={item}
                                                onFavoriteToggle={toggleFavorite}
                                                showStatus={false}
                                                viewMode={viewMode}
                                            />
                                        ))}
                                    </div>

                                    <Pagination
                                        isLoading={isLoading}
                                        meta={paginationMeta}
                                        onPageChange={setPage}
                                        page={page}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </Container>
        </main>
    );
}

function ViewModeSwitcher({
                              onChange,
                              value,
                          }: {
    onChange: (value: "grid" | "list") => void;
    value: "grid" | "list";
}) {
    return (
        <div className="flex rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-1">
            <button
                aria-label="Показать объявления сеткой"
                className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
                    value === "grid"
                        ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
                ].join(" ")}
                onClick={() => onChange("grid")}
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
                onClick={() => onChange("list")}
                type="button"
            >
                <List size={16} />
            </button>
        </div>
    );
}

function toPublicListingParams(filters: PublicListingFiltersState): ListPublicListingsParams {
    return {
        maxPrice: toOptionalNumber(filters.maxPrice),
        minPrice: toOptionalNumber(filters.minPrice),
        sort: filters.sort,
        type: toOptionalNumber(filters.type),
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