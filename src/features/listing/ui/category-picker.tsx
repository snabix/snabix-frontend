import type { CategoryNode } from "@/src/entities/category";
import type { BranchOption } from "@/src/features/listing/model/category-options";
import { listingTypeCards } from "@/src/features/listing/model/listing-form-options";
import { ListingFormField, ListingFormSelect } from "@/src/features/listing/ui/listing-form-field";

type CategoryPickerProps = {
  activeType: number;
  branchOptions: BranchOption[];
  effectiveSelectedCategoryId: string | null;
  effectiveSelectedRootId: string | null;
  filteredRoots: CategoryNode[];
  isLoadingBranch: boolean;
  isLoadingRoots: boolean;
  onCategoryChangeAction: (categoryId: string) => void;
  onRootChangeAction: (rootId: string) => void;
  onTypeChangeAction: (type: number) => void;
};

export function CategoryPicker({
  activeType,
  branchOptions,
  effectiveSelectedCategoryId,
  effectiveSelectedRootId,
  filteredRoots,
  isLoadingBranch,
  isLoadingRoots,
  onCategoryChangeAction,
  onRootChangeAction,
  onTypeChangeAction,
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
              onClick={() => onTypeChangeAction(card.value)}
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
            onChangeAction={onRootChangeAction}
            value={effectiveSelectedRootId ?? ""}
          >
            <option value="">
              {isLoadingRoots ? "Загружаем категории..." : "Выберите категорию"}
            </option>
            {filteredRoots.map((root) => (
              <option key={String(root.id)} value={String(root.id)}>
                {root.name}
              </option>
            ))}
          </ListingFormSelect>
        </ListingFormField>

        <ListingFormField label="Конечная категория">
          <ListingFormSelect
            disabled={effectiveSelectedRootId === null || isLoadingBranch || branchOptions.length === 0}
            onChangeAction={onCategoryChangeAction}
            value={effectiveSelectedCategoryId ?? ""}
          >
            <option value="">
              {effectiveSelectedRootId === null
                ? "Сначала выберите корневую категорию"
                : (isLoadingBranch ? "Загружаем подкатегории..." : "Выберите подкатегорию")}
            </option>
            {branchOptions.map((option) => (
              <option key={String(option.id)} value={String(option.id)}>
                {option.label}
              </option>
            ))}
          </ListingFormSelect>
        </ListingFormField>
      </div>
    </>
  );
}
