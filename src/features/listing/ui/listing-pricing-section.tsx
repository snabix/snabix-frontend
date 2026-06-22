import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { LISTING_TYPE_PRODUCT } from "@/src/features/listing/model/listing-form-constants";
import { conditionOptions } from "@/src/features/listing/model/listing-form-options";
import {
  ListingFormField,
  ListingFormSelect,
} from "@/src/features/listing/ui/listing-form-field";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";

export function ListingPricingSection({
  state,
  variant,
}: {
  state: ListingFormState;
  variant: "create" | "edit";
}) {
  const {
    activeType,
    condition,
    form: {
      formState: { errors },
      register,
    },
    isNegotiable,
    setCondition,
    setIsNegotiable,
  } = state;

  if (variant === "create") {
    return (
      <div className="grid gap-5">
        <ListingFormField error={errors.price?.message} label="Цена">
          <Input inputMode="numeric" placeholder="0" {...register("price")} />
        </ListingFormField>

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4">
          <Checkbox
            checked={isNegotiable}
            onCheckedChange={(checked) => setIsNegotiable(Boolean(checked))}
          />
          <div>
            <p className="text-sm font-semibold text-[var(--brand-deep)]">Имеется ли торг</p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              Покупатели смогут предложить свою цену
            </p>
          </div>
        </label>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <ListingFormField error={errors.price?.message} label="Цена">
          <Input inputMode="numeric" placeholder="12500" {...register("price")} />
        </ListingFormField>

        <ListingFormField error={errors.currency?.message} label="Валюта">
          <Input maxLength={3} placeholder="RUB" {...register("currency")} />
        </ListingFormField>
      </div>

      {activeType === LISTING_TYPE_PRODUCT ? (
        <ListingFormField label="Состояние товара">
          <ListingFormSelect
            onChangeAction={(value) => setCondition(Number(value))}
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
        <Checkbox
          checked={isNegotiable}
          onCheckedChange={(checked) => setIsNegotiable(Boolean(checked))}
        />
        <span className="text-sm font-semibold text-[var(--brand-deep)]">
          Разрешить торг и обсуждение финальной цены
        </span>
      </label>
    </>
  );
}
