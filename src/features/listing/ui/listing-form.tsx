import { Settings2 } from "lucide-react";
import type { ListingItem } from "@/src/entities/listing";
import type { CreateListingPayload } from "@/src/features/listing/api/create-listing";
import { LISTING_TYPE_PRODUCT } from "@/src/features/listing/model/listing-form-constants";
import { conditionOptions } from "@/src/features/listing/model/listing-form-options";
import { useListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { AttributeFields } from "@/src/features/listing/ui/attribute-fields";
import { CategoryPicker } from "@/src/features/listing/ui/category-picker";
import { ListingFormField, ListingFormSelect } from "@/src/features/listing/ui/listing-form-field";
import { ListingSubmitActions } from "@/src/features/listing/ui/listing-submit-actions";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";

type ListingFormProps = {
  initialListing?: ListingItem;
  mode: "create" | "edit";
  onSubmit: (payload: CreateListingPayload) => Promise<ListingItem>;
};

export function ListingForm({
  initialListing,
  mode,
  onSubmit,
}: ListingFormProps) {
  const {
    activeType,
    attributeValues,
    branchOptions,
    condition,
    effectiveSelectedCategoryId,
    effectiveSelectedRootId,
    filteredRoots,
    form,
    groupedAttributes,
    handleAttributeChange,
    handleCategoryChange,
    handleMultiselectChange,
    handleRootChange,
    handleTypeChange,
    isFormBusy,
    isLoadingAttributes,
    isLoadingBranch,
    isLoadingRoots,
    isNegotiable,
    isSubmitting,
    setCondition,
    setIsNegotiable,
    submitForm,
  } = useListingFormState({ initialListing, mode, onSubmit });
  const {
    formState: { errors },
    register,
  } = form;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="surface-card rounded-[30px] p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
            <Settings2 size={21} />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
              {mode === "create" ? "Новое объявление" : "Редактирование объявления"}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Категория подгружает характеристики автоматически, а форма остаётся отдельной от профиля.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <CategoryPicker
            activeType={activeType}
            branchOptions={branchOptions}
            effectiveSelectedCategoryId={effectiveSelectedCategoryId}
            effectiveSelectedRootId={effectiveSelectedRootId}
            filteredRoots={filteredRoots}
            isLoadingBranch={isLoadingBranch}
            isLoadingRoots={isLoadingRoots}
            onCategoryChange={handleCategoryChange}
            onRootChange={handleRootChange}
            onTypeChange={handleTypeChange}
          />

          <ListingFormField error={errors.title?.message} label="Заголовок">
            <Input
              placeholder="Например, Шкаф из массива дуба"
              {...register("title")}
            />
          </ListingFormField>

          <ListingFormField error={errors.description?.message} label="Описание">
            <textarea
              className="min-h-36 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              placeholder="Опишите состояние, особенности, комплектацию и условия сделки."
              {...register("description")}
            />
          </ListingFormField>

          <div className="grid gap-4 md:grid-cols-2">
            <ListingFormField error={errors.price?.message} label="Цена">
              <Input
                inputMode="numeric"
                placeholder="12500"
                {...register("price")}
              />
            </ListingFormField>

            <ListingFormField error={errors.currency?.message} label="Валюта">
              <Input
                maxLength={3}
                placeholder="RUB"
                {...register("currency")}
              />
            </ListingFormField>
          </div>

          {activeType === LISTING_TYPE_PRODUCT ? (
            <ListingFormField label="Состояние товара">
              <ListingFormSelect
                onChange={(value) => setCondition(Number(value))}
                value={condition}
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </ListingFormSelect>
            </ListingFormField>
          ) : null}

          <label className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
            <Checkbox checked={isNegotiable} onCheckedChange={(checked) => setIsNegotiable(Boolean(checked))} />
            <span className="text-sm font-semibold text-[var(--brand-deep)]">
              Разрешить торг и обсуждение финальной цены
            </span>
          </label>
        </div>
      </section>

      <aside className="surface-card rounded-[30px] p-6 sm:p-7">
        <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
          Характеристики
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
          Дополнительные поля подтягиваются из выбранной категории.
        </p>

        <AttributeFields
          attributeValues={attributeValues}
          groupedAttributes={groupedAttributes}
          isLoading={isLoadingBranch || isLoadingAttributes}
          onAttributeChange={handleAttributeChange}
          onMultiselectChange={handleMultiselectChange}
        />

        <ListingSubmitActions
          isDisabled={isFormBusy}
          isSubmitting={isSubmitting}
          mode={mode}
          onSubmit={submitForm}
        />
      </aside>
    </div>
  );
}

