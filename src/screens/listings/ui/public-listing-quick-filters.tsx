"use client";

import { useState } from "react";
import { ArrowUpDown, BadgeDollarSign, Check, SlidersHorizontal, Star } from "lucide-react";
import type { PublicListingFiltersState } from "@/src/screens/home/ui/public-listing-filters";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/ui/shadcn/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";
import { Input } from "@/src/shared/ui/shadcn/input";

type PublicListingQuickFiltersProps = {
  filters: PublicListingFiltersState;
  isLoading: boolean;
  onChangeAction: (filters: PublicListingFiltersState) => void;
};

const sortActions: Array<{
  label: string;
  value: PublicListingFiltersState["sort"];
}> = [
  { label: "По умолчанию", value: "newest" },
  { label: "По количеству", value: "popular" },
  { label: "Дешевле", value: "price_asc" },
];

export function PublicListingQuickFilters({
  filters,
  isLoading,
  onChangeAction,
}: PublicListingQuickFiltersProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const hasPriceFilter = filters.minPrice !== "" || filters.maxPrice !== "";
  const hasSortFilter = filters.sort !== "newest";

  const updateFilters = (nextFilters: Partial<PublicListingFiltersState>) => {
    onChangeAction({
      ...filters,
      ...nextFilters,
    });
  };

  const applyPrice = () => {
    updateFilters({ maxPrice, minPrice });
    setIsPriceOpen(false);
  };

  const resetPrice = () => {
    setMaxPrice("");
    setMinPrice("");
    updateFilters({ maxPrice: "", minPrice: "" });
    setIsPriceOpen(false);
  };

  const handlePriceOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setMinPrice(filters.minPrice);
      setMaxPrice(filters.maxPrice);
    }

    setIsPriceOpen(nextOpen);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Открыть фильтры"
            className={quickFilterButtonClassName(filters.isNegotiable)}
            disabled={isLoading}
            type="button"
          >
            <SlidersHorizontal size={18} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Фильтры</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.isNegotiable}
            disabled={isLoading}
            onCheckedChange={(checked) => updateFilters({ isNegotiable: checked === true })}
          >
            Торг
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Открыть сортировку"
            className={quickFilterButtonClassName(hasSortFilter)}
            disabled={isLoading}
            type="button"
          >
            <ArrowUpDown size={18} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Сортировка</DropdownMenuLabel>
          {sortActions.map((action) => (
            <DropdownMenuItem
              className="cursor-pointer justify-between"
              disabled={isLoading}
              key={action.value}
              onSelect={() => updateFilters({ sort: action.value })}
            >
              <span>{action.label}</span>
              {filters.sort === action.value ? <Check size={15} /> : null}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem disabled>
            <Star size={15} />
            <span>С высоким рейтингом</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog onOpenChange={handlePriceOpenChange} open={isPriceOpen}>
        <DialogTrigger asChild>
          <button
            aria-label="Настроить цену"
            className={quickFilterButtonClassName(hasPriceFilter)}
            disabled={isLoading}
            type="button"
          >
            <BadgeDollarSign size={19} />
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Цена</DialogTitle>
            <DialogDescription>
              Укажите диапазон стоимости, чтобы сузить выдачу объявлений.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2">
            <Input
              disabled={isLoading}
              inputMode="numeric"
              min="0"
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="от"
              type="number"
              value={minPrice}
            />

            <Input
              disabled={isLoading}
              inputMode="numeric"
              min="0"
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="до"
              type="number"
              value={maxPrice}
            />
          </div>

          <DialogFooter>
            <Button
              disabled={isLoading}
              onClick={resetPrice}
              type="button"
              variant="secondary"
            >
              Сбросить
            </Button>

            <Button disabled={isLoading} onClick={applyPrice} type="button">
              Применить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function quickFilterButtonClassName(isActive: boolean) {
  return [
    "relative inline-flex size-11 items-center justify-center rounded-full border text-[var(--brand-deep)] shadow-[var(--shadow-card)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60",
    isActive
      ? "border-[var(--brand)] bg-[var(--accent-soft)]"
      : "border-[var(--border-soft)] bg-[var(--surface)] hover:border-[var(--brand)] hover:text-[var(--brand)]",
  ].join(" ");
}
