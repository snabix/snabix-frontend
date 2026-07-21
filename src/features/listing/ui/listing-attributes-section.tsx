import { Sparkles } from "lucide-react";
import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { AttributeFields } from "@/src/features/listing/ui/attribute-fields";
import { ListingFormInlineHint } from "@/src/features/listing/ui/listing-form-inline-hint";

export function ListingAttributesSection({
  state,
}: {
  state: ListingFormState;
  variant: "create" | "edit";
}) {
  const {
    attributeValues,
    effectiveSelectedCategoryId,
    groupedAttributes,
    handleAttributeChange,
    handleMultiselectChange,
    isLoadingAttributes,
    isLoadingBranch,
  } = state;
  const fields = effectiveSelectedCategoryId !== null ? (
    <AttributeFields
      attributeValues={attributeValues}
      groupedAttributes={groupedAttributes}
      isLoading={isLoadingBranch || isLoadingAttributes}
      onAttributeChange={handleAttributeChange}
      onMultiselectChange={handleMultiselectChange}
    />
  ) : (
    <ListingFormInlineHint text="Сначала выберите категорию и подкатегорию, чтобы загрузить характеристики." />
  );

  return (
    <section className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex items-center gap-3">
        <Sparkles className="text-[var(--accent)]" size={20} />
        <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Характеристики</p>
      </div>
      <div className="mt-5">{fields}</div>
    </section>
  );
}
