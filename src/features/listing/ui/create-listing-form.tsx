import { CircleHelp } from "lucide-react";
import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { ListingAddressSection } from "@/src/features/listing/ui/listing-address-section";
import { ListingAttributesSection } from "@/src/features/listing/ui/listing-attributes-section";
import { ListingCategorySection } from "@/src/features/listing/ui/listing-category-section";
import { ListingFormField } from "@/src/features/listing/ui/listing-form-field";
import { ListingMediaSection } from "@/src/features/listing/ui/listing-media-section";
import { ListingPricingSection } from "@/src/features/listing/ui/listing-pricing-section";
import { ListingSubmitBar } from "@/src/features/listing/ui/listing-submit-bar";
import { Input } from "@/src/shared/ui/shadcn/input";

export function CreateListingForm({ state }: { state: ListingFormState }) {
  const {
    form: {
      formState: { errors },
      register,
    },
  } = state;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_28%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand)_7%,transparent),transparent_24%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_62%,transparent),var(--background))]">
      <div className="mx-auto w-full max-w-[1680px] px-5 py-10 sm:px-8">
        <div className="grid gap-8">
          <section className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="font-heading text-[clamp(2.5rem,5vw,4.2rem)] font-black leading-none tracking-[-0.08em] text-[var(--brand-deep)]">
                Создание объявления
              </h1>
              <p className="mt-4 text-lg font-medium text-[var(--text-muted)]">
                Заполните информацию о товаре или услуге
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 text-sm font-bold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)]"
                type="button"
              >
                <CircleHelp size={16} />
                Нужна помощь?
              </button>
              <button
                className="inline-flex h-12 items-center rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-5 text-sm font-bold text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                type="button"
              >
                Инструкция
              </button>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
            <section className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
              <div className="grid gap-8">
                <ListingCategorySection segment="type" state={state} variant="create" />

                <ListingFormField error={errors.title?.message} label="Название объявления">
                  <Input aria-label="Заголовок" {...register("title")} />
                </ListingFormField>

                <ListingFormField error={errors.description?.message} label="Описание">
                  <textarea
                    className="min-h-36 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                    maxLength={3000}
                    {...register("description")}
                  />
                </ListingFormField>

                <ListingPricingSection state={state} variant="create" />
                <ListingCategorySection state={state} variant="create" />
                <ListingAddressSection state={state} />
              </div>
            </section>

            <div className="grid gap-5">
              <ListingAttributesSection state={state} variant="create" />
            </div>
          </div>

          <ListingMediaSection state={state} variant="create" />
          <ListingSubmitBar state={state} variant="create" />
        </div>
      </div>
    </div>
  );
}
