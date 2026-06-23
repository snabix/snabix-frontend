import { Check, Sparkles, Wrench } from "lucide-react";
import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import {
  LISTING_TYPE_PRODUCT,
  LISTING_TYPE_SERVICE,
} from "@/src/features/listing/model/listing-form-constants";
import { conditionOptions } from "@/src/features/listing/model/listing-form-options";
import { CategoryPicker } from "@/src/features/listing/ui/category-picker";
import {
  ListingFormField,
  ListingFormSelect,
} from "@/src/features/listing/ui/listing-form-field";

type ListingCategorySectionProps = {
  segment?: "selection" | "type";
  state: ListingFormState;
  variant: "create" | "edit";
};

const activeSelectionClass = "border-[var(--accent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_18%,white),color-mix(in_srgb,var(--accent)_10%,var(--surface)))] shadow-[var(--shadow-card)]";

export function ListingCategorySection({
  segment = "selection",
  state,
  variant,
}: ListingCategorySectionProps) {
  const {
    activeType,
    branchOptions,
    condition,
    effectiveSelectedCategoryId,
    effectiveSelectedRootId,
    filteredRoots,
    handleCategoryChange,
    handleRootChange,
    handleTypeChange,
    isLoadingBranch,
    isLoadingRoots,
    setCondition,
  } = state;

  if (variant === "edit") {
    return (
      <CategoryPicker
        activeType={activeType}
        branchOptions={branchOptions}
        effectiveSelectedCategoryId={effectiveSelectedCategoryId}
        effectiveSelectedRootId={effectiveSelectedRootId}
        filteredRoots={filteredRoots}
        isLoadingBranch={isLoadingBranch}
        isLoadingRoots={isLoadingRoots}
        onCategoryChangeAction={handleCategoryChange}
        onRootChangeAction={handleRootChange}
        onTypeChangeAction={handleTypeChange}
      />
    );
  }

  if (segment === "type") {
    return (
      <div>
        <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Тип объявления</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ListingTypeCards activeType={activeType} onTypeChangeAction={handleTypeChange} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-t border-[var(--border-soft)] pt-6">
        <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Категория</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ListingFormField label="Выберите категорию">
            <ListingFormSelect
              disabled={isLoadingRoots || filteredRoots.length === 0}
              onChangeAction={handleRootChange}
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

          <ListingFormField label="Выберите подкатегорию">
            <ListingFormSelect
              disabled={effectiveSelectedRootId === null || isLoadingBranch || branchOptions.length === 0}
              onChangeAction={handleCategoryChange}
              value={effectiveSelectedCategoryId ?? ""}
            >
              <option value="">
                {effectiveSelectedRootId === null
                  ? "Сначала выберите категорию"
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
      </div>

      {activeType === LISTING_TYPE_PRODUCT ? (
        <div>
          <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Состояние товара</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {conditionOptions.map((option) => {
              const isActive = condition === option.value;

              return (
                <button
                  className={[
                    "flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors duration-200",
                    isActive
                      ? `${activeSelectionClass} text-white`
                      : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]",
                  ].join(" ")}
                  key={option.value}
                  onClick={() => setCondition(option.value)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-3 text-base font-black">
                    <Sparkles size={18} />
                    {option.label}
                  </span>
                  <span
                    className={[
                      "grid size-6 place-items-center rounded-full border",
                      isActive ? "border-white/35 bg-white/12" : "border-[var(--border-soft)]",
                    ].join(" ")}
                  >
                    {isActive ? <Check size={14} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ListingTypeCards({
  activeType,
  onTypeChangeAction,
}: {
  activeType: number;
  onTypeChangeAction: (type: number) => void;
}) {
  return [
    {
      description: "Продажа вещей, техники, одежды и других товаров",
      icon: Sparkles,
      label: "Товар",
      value: LISTING_TYPE_PRODUCT,
    },
    {
      description: "Работы, помощь, ремонт, доставка и другие услуги",
      icon: Wrench,
      label: "Услуга",
      value: LISTING_TYPE_SERVICE,
    },
  ].map((option) => {
    const isActive = activeType === option.value;
    const Icon = option.icon;

    return (
      <button
        className={[
          "flex items-start justify-between rounded-[24px] border px-5 py-5 text-left transition-colors duration-200",
          isActive
            ? activeSelectionClass
            : "border-[var(--border-soft)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]",
        ].join(" ")}
        key={option.value}
        onClick={() => onTypeChangeAction(option.value)}
        type="button"
      >
        <div className="flex items-start gap-4">
          <span className={isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
            <Icon size={34} />
          </span>
          <div>
            <p className="text-[1.1rem] font-black text-[var(--brand-deep)]">{option.label}</p>
            <p className="mt-2 max-w-[240px] text-sm leading-7 text-[var(--text-muted)]">
              {option.description}
            </p>
          </div>
        </div>
        <span
          className={[
            "grid size-6 place-items-center rounded-full border",
            isActive
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--border-soft)] text-transparent",
          ].join(" ")}
        >
          <Check size={14} />
        </span>
      </button>
    );
  });
}
