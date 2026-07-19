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
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Skeleton } from "@/src/shared/ui/skeleton";

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
    <div className="grid gap-4">
      {isLoading ? (
        <div className="grid min-h-40 gap-3 rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] p-5">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : attributesCount === 0 ? (
        <EmptyState
          description="Объявление можно сохранить без них. Когда администратор добавит характеристики, форма начнет показывать дополнительные поля."
          title="У этой категории пока нет характеристик"
        />
      ) : (
        <div className="grid gap-4">
          {groupedAttributes.flatMap((group) => group.items).map((attribute) => (
            <AttributeField
              attribute={attribute}
              key={attribute.id}
              onAttributeChange={onAttributeChange}
              onMultiselectChange={onMultiselectChange}
              value={getAttributeValue(attribute, attributeValues)}
            />
          ))}
        </div>
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
    <div className="grid gap-2">
      <p className="text-sm font-black text-[var(--brand-deep)]">
        {attribute.name}
        {attribute.unit ? `, ${attribute.unit}` : ""}
        {attribute.isRequired ? <span className="text-[var(--accent)]"> *</span> : null}
      </p>
      {renderAttributeInput(attribute, value, onAttributeChange, onMultiselectChange)}
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
        aria-label={attribute.name}
        onChange={(event) => onChange(attribute.id, event.target.value)}
        placeholder={attribute.placeholder ?? `Введите ${attribute.name.toLowerCase()}`}
        value={typeof value === "string" ? value : ""}
      />
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_NUMBER) {
    return (
      <Input
        aria-label={attribute.name}
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
        <Checkbox
          aria-label={attribute.name}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(attribute.id, Boolean(checked))}
        />
        <span className="text-sm font-semibold text-[var(--brand-deep)]">Да, параметр актуален</span>
      </label>
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_SELECT) {
    return (
      <ListingFormSelect
        aria-label={attribute.name}
        onChange={(nextValue) => onChange(attribute.id, nextValue)}
        value={typeof value === "string" ? value : ""}
      >
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
              aria-label={`${attribute.name}: ${option}`}
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
        aria-label={attribute.name}
        onChange={(event) => onChange(attribute.id, event.target.value)}
        placeholder={attribute.placeholder ?? undefined}
        type="date"
        value={typeof value === "string" ? value : ""}
      />
    );
  }

  return null;
}
