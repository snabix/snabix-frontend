import type { CategoryNode } from "@/src/entities/category/model/types";
import type { BranchOption } from "@/src/features/listing/model/category-options";
import { listingTypeCards } from "@/src/features/listing/model/listing-form-options";
import { ListingFormField, ListingFormSelect } from "@/src/features/listing/ui/listing-form-field";

type CategoryPickerProps = {
  activeType: number;
  branchOptions: BranchOption[];
  effectiveSelectedCategoryId: number | null;
  effectiveSelectedRootId: number | null;
  filteredRoots: CategoryNode[];
  isLoadingBranch: boolean;
  isLoadingRoots: boolean;
  onCategoryChange: (categoryId: number) => void;
  onRootChange: (rootId: number) => void;
  onTypeChange: (type: number) => void;
};

export function CategoryPicker({
  activeType,
  branchOptions,
  effectiveSelectedCategoryId,
  effectiveSelectedRootId,
  filteredRoots,
  isLoadingBranch,
  isLoadingRoots,
  onCategoryChange,
  onRootChange,
  onTypeChange,
}: CategoryPickerProps) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        {listingTypeCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeType === card.value;

          return (
            <button
              className={[
                "rounded-[24px] border p-5 text-left transition duration-200",
                isActive
                  ? "border-transparent bg-[var(--active-button-bg)] text-[var(--active-button-text)] shadow-[var(--shadow-card)]"
                  : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] hover:border-[var(--accent)]",
              ].join(" ")}
              key={card.value}
              onClick={() => onTypeChange(card.value)}
              type="button"
            >
              <div className={`grid size-12 place-items-center rounded-2xl ${isActive ? "bg-[color-mix(in_srgb,var(--active-button-text)_14%,transparent)] text-[var(--active-button-text)]" : "bg-[var(--accent-soft)]"}`}>
                <Icon size={22} />
              </div>
              <p className="mt-4 text-lg font-black">{card.title}</p>
              <p className={`mt-2 text-sm leading-7 ${isActive ? "text-[color-mix(in_srgb,var(--active-button-text)_82%,transparent)]" : "text-[var(--text-muted)]"}`}>
                {card.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListingFormField label="Корневая категория">
          <ListingFormSelect
            disabled={isLoadingRoots || filteredRoots.length === 0}
            onChange={(value) => onRootChange(Number(value))}
            value={effectiveSelectedRootId ?? ""}
          >
            {filteredRoots.map((root) => (
              <option key={root.id} value={root.id}>
                {root.name}
              </option>
            ))}
          </ListingFormSelect>
        </ListingFormField>

        <ListingFormField label="Конечная категория">
          <ListingFormSelect
            disabled={isLoadingBranch || branchOptions.length === 0}
            onChange={(value) => onCategoryChange(Number(value))}
            value={effectiveSelectedCategoryId ?? ""}
          >
            {branchOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </ListingFormSelect>
        </ListingFormField>
      </div>
    </>
  );
}
