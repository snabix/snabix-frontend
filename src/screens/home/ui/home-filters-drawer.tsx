import { PublicListingFilters, type PublicListingFiltersState } from "./public-listing-filters";

type HomeFiltersDrawerProps = {
  filters: PublicListingFiltersState;
  isLoading: boolean;
  isOpen: boolean;
  onChange: (filters: PublicListingFiltersState) => void;
  onClose: () => void;
  onReset: () => void;
};

export function HomeFiltersDrawer({
  filters,
  isLoading,
  isOpen,
  onChange,
  onClose,
  onReset,
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
        onClick={onClose}
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
          onChange={onChange}
          onReset={onReset}
        />
      </aside>
    </div>
  );
}
