import type { ReactNode } from "react";
import {
    LISTING_TYPE_PRODUCT,
    LISTING_TYPE_SERVICE,
} from "@/src/entities/listing";
import type { ListPublicListingsParams } from "@/src/features/listing/api/public-listing-query";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";

export type PublicListingFiltersState = {
    type: string;
    regionQuery: string;
    cityQuery: string;
    minPrice: string;
    maxPrice: string;
    isNegotiable: boolean;
    sort: NonNullable<ListPublicListingsParams["sort"]>;
};

type PublicListingFiltersProps = {
    filters: PublicListingFiltersState;
    isLoading: boolean;
    onChange: (filters: PublicListingFiltersState) => void;
    onReset: () => void;
};

const listingTypeOptions = [
    { label: "Все типы", value: "" },
    { label: "Товары", value: String(LISTING_TYPE_PRODUCT) },
    { label: "Услуги", value: String(LISTING_TYPE_SERVICE) },
];

const sortOptions: Array<{
    label: string;
    value: PublicListingFiltersState["sort"];
}> = [
    { label: "Сначала новые", value: "newest" },
    { label: "Сначала старые", value: "oldest" },
    { label: "Цена по возрастанию", value: "price_asc" },
    { label: "Цена по убыванию", value: "price_desc" },
    { label: "Популярные", value: "popular" },
];

const pricePresetOptions = [
    { label: "до 5 000", maxPrice: "5000", minPrice: "0" },
    { label: "5 000 - 20 000", maxPrice: "20000", minPrice: "5000" },
    { label: "20 000 - 50 000", maxPrice: "50000", minPrice: "20000" },
    { label: "от 50 000", maxPrice: "", minPrice: "50000" },
];

const selectClassName =
    "h-12 w-full appearance-none rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--brand-deep)] outline-none transition focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60";

const optionClassName = "bg-[var(--surface)] text-[var(--brand-deep)]";

export const defaultPublicListingFilters: PublicListingFiltersState = {
    type: "",
    regionQuery: "",
    cityQuery: "",
    minPrice: "",
    maxPrice: "",
    isNegotiable: false,
    sort: "newest",
};

export function PublicListingFilters({
                                         filters,
                                         isLoading,
                                         onChange,
                                         onReset,
                                     }: PublicListingFiltersProps) {
    const updateFilter = (
        key: keyof PublicListingFiltersState,
        value: string | boolean,
    ) => {
        onChange({
            ...filters,
            [key]: value,
        });
    };

    const updatePricePreset = (minPrice: string, maxPrice: string) => {
        const isSelected = filters.minPrice === minPrice && filters.maxPrice === maxPrice;

        onChange({
            ...filters,
            maxPrice: isSelected ? "" : maxPrice,
            minPrice: isSelected ? "" : minPrice,
        });
    };

    return (
        <aside className="h-full overflow-y-auto px-5 pb-8 pt-5 sm:px-6">
            <div className="mb-6">
                <h3 className="font-heading mt-2 text-2xl font-black text-[var(--brand-deep)]">
                    Фильтры
                </h3>
            </div>

            <div className="grid gap-6">
                <FilterGroup title="Тип объявления">
                    <select
                        className={selectClassName}
                        disabled={isLoading}
                        onChange={(event) => updateFilter("type", event.target.value)}
                        value={filters.type}
                    >
                        {listingTypeOptions.map((option) => (
                            <option className={optionClassName} key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </FilterGroup>

                <FilterGroup title="Локация">
                    <div className="grid gap-2">
                        <Input
                            disabled={isLoading}
                            onChange={(event) => updateFilter("regionQuery", event.target.value)}
                            placeholder="Регион, например Краснодарский край"
                            type="search"
                            value={filters.regionQuery}
                        />

                        <Input
                            disabled={isLoading}
                            onChange={(event) => updateFilter("cityQuery", event.target.value)}
                            placeholder="Город, например Краснодар"
                            type="search"
                            value={filters.cityQuery}
                        />
                    </div>
                    <p className="mt-2 text-xs font-medium leading-5 text-[var(--text-muted)]">
                        Можно ввести только регион, только город или оба значения сразу.
                    </p>
                </FilterGroup>

                <FilterGroup title="Цена">
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            disabled={isLoading}
                            inputMode="numeric"
                            min="0"
                            onChange={(event) => updateFilter("minPrice", event.target.value)}
                            placeholder="от"
                            type="number"
                            value={filters.minPrice}
                        />

                        <Input
                            disabled={isLoading}
                            inputMode="numeric"
                            min="0"
                            onChange={(event) => updateFilter("maxPrice", event.target.value)}
                            placeholder="до"
                            type="number"
                            value={filters.maxPrice}
                        />
                    </div>

                    <div className="mt-3 grid gap-2">
                        {pricePresetOptions.map((option) => {
                            const isChecked = filters.minPrice === option.minPrice
                                && filters.maxPrice === option.maxPrice;

                            return (
                                <button
                                    aria-pressed={isChecked}
                                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] px-4 py-3 text-left text-sm font-bold text-[var(--brand-deep)] transition hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={isLoading}
                                    key={option.label}
                                    onClick={() => updatePricePreset(option.minPrice, option.maxPrice)}
                                    type="button"
                                >
                  <span
                      aria-hidden="true"
                      className={[
                          "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
                          isChecked
                              ? "border-[var(--brand)] bg-[var(--brand)]"
                              : "border-[var(--border-strong)] bg-[var(--surface)]",
                      ].join(" ")}
                  >
                    <span
                        className={[
                            "size-1.5 rounded-full bg-[var(--surface)] transition-opacity",
                            isChecked ? "opacity-100" : "opacity-0",
                        ].join(" ")}
                    />
                  </span>

                                    <span>{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </FilterGroup>

                <FilterGroup title="Дополнительно">
                    <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox
                            checked={filters.isNegotiable}
                            disabled={isLoading}
                            onCheckedChange={(checked) => updateFilter("isNegotiable", checked === true)}
                        />

                        <span className="text-sm font-bold text-[var(--brand-deep)]">
      Торг уместен
    </span>
                    </label>
                </FilterGroup>

                <FilterGroup title="Сортировка">
                    <select
                        className={selectClassName}
                        disabled={isLoading}
                        onChange={(event) => updateFilter("sort", event.target.value)}
                        value={filters.sort}
                    >
                        {sortOptions.map((option) => (
                            <option className={optionClassName} key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </FilterGroup>

                <button
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-3 text-sm font-black text-[var(--brand-deep)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-60"
                    disabled={isLoading}
                    onClick={onReset}
                    type="button"
                >
                    Сбросить фильтры
                </button>
            </div>
        </aside>
    );
}

function FilterGroup({
                         children,
                         title,
                     }: {
    children: ReactNode;
    title: string;
}) {
    return (
        <section>
            <h4 className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {title}
            </h4>

            {children}
        </section>
    );
}
