import { LoaderCircle } from "lucide-react";
import type { CategoryAttributeDefinition } from "@/src/entities/category";
import type { ListingAttributeValue } from "@/src/entities/listing";
import {
  ATTRIBUTE_TYPE_BOOLEAN,
  ATTRIBUTE_TYPE_DATE,
  ATTRIBUTE_TYPE_MULTISELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_TEXT,
} from "@/src/features/listing/model/listing-form-constants";
import type { AttributeGroup } from "@/src/features/listing/model/attribute-values";
import {
  getAttributeValue,
  parseAttributeNumber,
} from "@/src/features/listing/model/attribute-values";
import { ListingFormSelect } from "@/src/features/listing/ui/listing-form-field";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";

type AttributeFieldsProps = {
  attributeValues: Record<string, ListingAttributeValue>;
  groupedAttributes: AttributeGroup[];
  isLoading: boolean;
  onAttributeChange: (attributeId: number, value: ListingAttributeValue) => void;
  onMultiselectChange: (attributeId: number, optionValue: string, checked: boolean) => void;
};

export function AttributeFields({
  attributeValues,
  groupedAttributes,
  isLoading,
  onAttributeChange,
  onMultiselectChange,
}: AttributeFieldsProps) {
  const attributesCount = groupedAttributes.reduce(
    (count, group) => count + group.items.length,
    0,
  );

  return (
    <div className="mt-6 grid gap-4">
      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center gap-3 rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-muted)]">
          <LoaderCircle className="animate-spin" size={18} />
          Подготавливаем поля
        </div>
      ) : attributesCount === 0 ? (
        <div className="rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--text-muted)]">
          У этой категории пока нет характеристик. Объявление можно сохранить без них.
        </div>
      ) : (
        groupedAttributes.map((group) => (
          <section className="grid gap-3" key={group.name}>
            <div>
              <h3 className="font-heading text-base font-black text-[var(--brand-deep)]">
                {group.name}
              </h3>
              <div className="mt-2 h-px bg-[linear-gradient(90deg,var(--border-soft),transparent)]" />
            </div>

            {group.items.map((attribute) => (
              <AttributeField
                attribute={attribute}
                key={attribute.id}
                onAttributeChange={onAttributeChange}
                onMultiselectChange={onMultiselectChange}
                value={getAttributeValue(attribute, attributeValues)}
              />
            ))}
          </section>
        ))
      )}
    </div>
  );
}

function AttributeField({
  attribute,
  onAttributeChange,
  onMultiselectChange,
  value,
}: {
  attribute: CategoryAttributeDefinition;
  onAttributeChange: (attributeId: number, value: ListingAttributeValue) => void;
  onMultiselectChange: (attributeId: number, optionValue: string, checked: boolean) => void;
  value: ListingAttributeValue;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[var(--brand-deep)]">
            {attribute.name}
            {attribute.unit ? `, ${attribute.unit}` : ""}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {attribute.typeLabel}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {attribute.showInCard ? (
            <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">
              в карточке
            </span>
          ) : null}
          {attribute.isRequired ? (
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--brand-deep)]">
              обязательно
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {renderAttributeInput(attribute, value, onAttributeChange, onMultiselectChange)}
      </div>

      {attribute.helpText ?? attribute.description ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-muted)]">
          {attribute.helpText ?? attribute.description}
        </p>
      ) : null}
    </div>
  );
}

function renderAttributeInput(
  attribute: CategoryAttributeDefinition,
  value: ListingAttributeValue,
  onChange: (attributeId: number, value: ListingAttributeValue) => void,
  onMultiselectChange: (attributeId: number, optionValue: string, checked: boolean) => void,
) {
  if (attribute.type === ATTRIBUTE_TYPE_TEXT) {
    return (
      <Input
        onChange={(event) => onChange(attribute.id, event.target.value)}
        placeholder={attribute.placeholder ?? `Введите ${attribute.name.toLowerCase()}`}
        value={typeof value === "string" ? value : ""}
      />
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_NUMBER) {
    return (
      <Input
        inputMode="decimal"
        onChange={(event) => onChange(attribute.id, parseAttributeNumber(event.target.value))}
        placeholder={attribute.placeholder ?? "Введите число"}
        value={typeof value === "number" ? String(value) : ""}
      />
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_BOOLEAN) {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
        <Checkbox checked={Boolean(value)} onCheckedChange={(checked) => onChange(attribute.id, Boolean(checked))} />
        <span className="text-sm font-semibold text-[var(--brand-deep)]">Да, параметр актуален</span>
      </label>
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_SELECT) {
    return (
      <ListingFormSelect onChange={(nextValue) => onChange(attribute.id, nextValue)} value={typeof value === "string" ? value : ""}>
        <option value="">{attribute.placeholder ?? "Выберите значение"}</option>
        {(attribute.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </ListingFormSelect>
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_MULTISELECT) {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <div className="grid gap-2">
        {(attribute.options ?? []).map((option) => (
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3" key={option}>
            <Checkbox
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => onMultiselectChange(attribute.id, option, Boolean(checked))}
            />
            <span className="text-sm font-semibold text-[var(--brand-deep)]">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_DATE) {
    return (
      <Input
        onChange={(event) => onChange(attribute.id, event.target.value)}
        placeholder={attribute.placeholder ?? undefined}
        type="date"
        value={typeof value === "string" ? value : ""}
      />
    );
  }

  return null;
}
