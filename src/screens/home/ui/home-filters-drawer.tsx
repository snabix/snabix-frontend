import { PublicListingFilters, type PublicListingFiltersState } from "./public-listing-filters";

type HomeFiltersDrawerProps = {
  filters: PublicListingFiltersState;
  isLoading: boolean;
  isOpen: boolean;
  onChangeAction: (filters: PublicListingFiltersState) => void;
  onCloseAction: () => void;
  onResetAction: () => void;
};

export function HomeFiltersDrawer({
  filters,
  isLoading,
  isOpen,
  onChangeAction,
  onCloseAction,
  onResetAction,
}: HomeFiltersDrawerProps) {
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
