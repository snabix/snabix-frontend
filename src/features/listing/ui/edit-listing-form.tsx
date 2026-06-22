import { Settings2 } from "lucide-react";
import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { ListingAddressSection } from "@/src/features/listing/ui/listing-address-section";
import { ListingAttributesSection } from "@/src/features/listing/ui/listing-attributes-section";
import { ListingCategorySection } from "@/src/features/listing/ui/listing-category-section";
import { ListingFormField } from "@/src/features/listing/ui/listing-form-field";
import { ListingMediaSection } from "@/src/features/listing/ui/listing-media-section";
import { ListingPricingSection } from "@/src/features/listing/ui/listing-pricing-section";
import { ListingSubmitBar } from "@/src/features/listing/ui/listing-submit-bar";
import { Input } from "@/src/shared/ui/shadcn/input";

export function EditListingForm({ state }: { state: ListingFormState }) {
  const {
    form: {
      formState: { errors },
      register,
    },
  } = state;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <section className="surface-card rounded-[30px] p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
            <Settings2 size={21} />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
              Редактирование объявления
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Рабочий режим редактирования с характеристиками по выбранной категории.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <ListingCategorySection state={state} variant="edit" />

          <ListingFormField error={errors.title?.message} label="Заголовок">
            <Input placeholder="Например, Шкаф из массива дуба" {...register("title")} />
          </ListingFormField>

          <ListingFormField error={errors.description?.message} label="Описание">
            <textarea
              className="min-h-36 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              placeholder="Опишите состояние, особенности, комплектацию и условия сделки."
              {...register("description")}
            />
          </ListingFormField>

          <ListingMediaSection state={state} variant="edit" />
          <ListingPricingSection state={state} variant="edit" />
          <ListingAddressSection state={state} />
        </div>
      </section>

      <aside className="surface-card rounded-[30px] p-6 sm:p-7">
        <ListingAttributesSection state={state} variant="edit" />
        <ListingSubmitBar state={state} variant="edit" />
      </aside>
    </div>
  );
}
