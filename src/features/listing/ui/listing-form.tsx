"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, PackagePlus, Settings2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { getCategoryAttributes, listRootCategories, showCategoryBranch } from "@/src/entities/category/api/list-categories";
import type { CategoryAttributeDefinition, CategoryNode } from "@/src/entities/category/model/types";
import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";
import type { CreateListingPayload } from "@/src/features/listing/api/create-listing";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";

const LISTING_TYPE_PRODUCT = 1;
const LISTING_TYPE_SERVICE = 2;
const LISTING_CONDITION_NEW = 1;
const LISTING_CONDITION_USED = 2;
const LISTING_CONDITION_NOT_APPLICABLE = 3;
const ATTRIBUTE_TYPE_TEXT = 1;
const ATTRIBUTE_TYPE_NUMBER = 2;
const ATTRIBUTE_TYPE_BOOLEAN = 3;
const ATTRIBUTE_TYPE_SELECT = 4;
const ATTRIBUTE_TYPE_MULTISELECT = 5;
const ATTRIBUTE_TYPE_DATE = 6;

type ListingFormProps = {
  initialListing?: ListingItem;
  mode: "create" | "edit";
  onSubmit: (payload: CreateListingPayload) => Promise<ListingItem>;
};

type BranchOption = {
  id: number;
  label: string;
};

const listingTypeCards = [
  {
    icon: PackagePlus,
    title: "Товар",
    description: "Техника, мебель, одежда, запчасти и любые физические позиции.",
    value: LISTING_TYPE_PRODUCT,
  },
  {
    icon: Wrench,
    title: "Услуга",
    description: "Ремонт, монтаж, обучение, перевозки и сервисные предложения.",
    value: LISTING_TYPE_SERVICE,
  },
] as const;

const conditionOptions = [
  { label: "Новый", value: LISTING_CONDITION_NEW },
  { label: "Б/у", value: LISTING_CONDITION_USED },
] as const;

export function ListingForm({
  initialListing,
  mode,
  onSubmit,
}: ListingFormProps) {
  const router = useRouter();
  const [roots, setRoots] = useState<CategoryNode[]>([]);
  const [activeType, setActiveType] = useState(initialListing?.type ?? LISTING_TYPE_PRODUCT);
  const [selectedRootId, setSelectedRootId] = useState<number | null>(null);
  const [branch, setBranch] = useState<CategoryNode | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialListing?.category?.id ?? null);
  const [attributes, setAttributes] = useState<CategoryAttributeDefinition[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, ListingAttributeValue>>(
    () => valuesFromListing(initialListing),
  );
  const [title, setTitle] = useState(initialListing?.title ?? "");
  const [description, setDescription] = useState(initialListing?.description ?? "");
  const [price, setPrice] = useState(initialListing?.price === null || initialListing?.price === undefined ? "" : String(initialListing.price));
  const [currency, setCurrency] = useState(initialListing?.currency ?? "RUB");
  const [condition, setCondition] = useState(initialListing?.condition ?? LISTING_CONDITION_USED);
  const [isNegotiable, setIsNegotiable] = useState(initialListing?.isNegotiable ?? false);
  const [isLoadingRoots, setIsLoadingRoots] = useState(true);
  const [isLoadingBranch, setIsLoadingBranch] = useState(false);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRoots = async () => {
      try {
        setIsLoadingRoots(true);
        const loadedRoots = await listRootCategories();

        if (!isMounted) {
          return;
        }

        setRoots(loadedRoots);
        const preferredRoot = loadedRoots.find((root) => root.catalogType === activeType) ?? loadedRoots[0] ?? null;

        setSelectedRootId((currentRootId) => currentRootId ?? preferredRoot?.id ?? null);
      } catch (error) {
        toast.error(extractApiError(error, "Не удалось загрузить категории."));
      } finally {
        if (isMounted) {
          setIsLoadingRoots(false);
        }
      }
    };

    void loadRoots();

    return () => {
      isMounted = false;
    };
  }, [activeType]);

  const filteredRoots = useMemo(
    () => roots.filter((root) => root.catalogType === activeType),
    [activeType, roots],
  );

  const effectiveSelectedRootId = useMemo(() => {
    if (filteredRoots.length === 0) {
      return null;
    }

    if (selectedRootId !== null && filteredRoots.some((root) => root.id === selectedRootId)) {
      return selectedRootId;
    }

    return filteredRoots[0]?.id ?? null;
  }, [filteredRoots, selectedRootId]);

  useEffect(() => {
    let isMounted = true;

    if (effectiveSelectedRootId === null) {
      return;
    }

    const loadBranch = async () => {
      try {
        setIsLoadingBranch(true);
        const loadedBranch = await showCategoryBranch(effectiveSelectedRootId);

        if (isMounted) {
          setBranch(loadedBranch);
        }
      } catch (error) {
        if (isMounted) {
          setBranch(null);
          toast.error(extractApiError(error, "Не удалось загрузить ветку категорий."));
        }
      } finally {
        if (isMounted) {
          setIsLoadingBranch(false);
        }
      }
    };

    void loadBranch();

    return () => {
      isMounted = false;
    };
  }, [effectiveSelectedRootId]);

  const branchOptions = useMemo(
    () => (branch !== null ? flattenBranchOptions(branch) : []),
    [branch],
  );

  const effectiveSelectedCategoryId = useMemo(() => {
    if (branchOptions.length === 0) {
      return branch?.id ?? null;
    }

    if (selectedCategoryId !== null && branchOptions.some((option) => option.id === selectedCategoryId)) {
      return selectedCategoryId;
    }

    return branchOptions[0]?.id ?? branch?.id ?? null;
  }, [branch, branchOptions, selectedCategoryId]);

  useEffect(() => {
    let isMounted = true;

    if (effectiveSelectedCategoryId === null) {
      return;
    }

    const loadAttributes = async () => {
      try {
        setIsLoadingAttributes(true);
        const loadedAttributes = await getCategoryAttributes(effectiveSelectedCategoryId);

        if (!isMounted) {
          return;
        }

        setAttributes(loadedAttributes);
        setAttributeValues((currentValues) => {
          const nextValues: Record<number, ListingAttributeValue> = {};

          for (const attribute of loadedAttributes) {
            nextValues[attribute.id] = currentValues[attribute.id] ?? defaultAttributeValue(attribute.type);
          }

          return nextValues;
        });
      } catch (error) {
        if (isMounted) {
          setAttributes([]);
          setAttributeValues({});
          toast.error(extractApiError(error, "Не удалось загрузить характеристики категории."));
        }
      } finally {
        if (isMounted) {
          setIsLoadingAttributes(false);
        }
      }
    };

    void loadAttributes();

    return () => {
      isMounted = false;
    };
  }, [effectiveSelectedCategoryId]);

  const effectiveCondition = activeType === LISTING_TYPE_SERVICE
    ? LISTING_CONDITION_NOT_APPLICABLE
    : (condition === LISTING_CONDITION_NOT_APPLICABLE ? LISTING_CONDITION_USED : condition);

  const handleAttributeChange = (attributeId: number, value: ListingAttributeValue) => {
    setAttributeValues((currentValues) => ({
      ...currentValues,
      [attributeId]: value,
    }));
  };

  const handleMultiselectChange = (attributeId: number, optionValue: string, checked: boolean) => {
    setAttributeValues((currentValues) => {
      const current = Array.isArray(currentValues[attributeId]) ? currentValues[attributeId] as string[] : [];

      return {
        ...currentValues,
        [attributeId]: checked
          ? Array.from(new Set([...current, optionValue]))
          : current.filter((item) => item !== optionValue),
      };
    });
  };

  const handleSubmit = async (saveAsDraft = false) => {
    if (effectiveSelectedCategoryId === null) {
      toast.error("Сначала выберите категорию объявления.");
      return;
    }

    if (title.trim() === "" || description.trim() === "") {
      toast.error("Заполните заголовок и описание объявления.");
      return;
    }

    const payload: CreateListingPayload = {
      categoryId: effectiveSelectedCategoryId,
      type: activeType,
      condition: effectiveCondition,
      title: title.trim(),
      description: description.trim(),
      price: price.trim() === "" ? null : Number(price),
      currency: currency.trim() === "" ? null : currency.trim().toUpperCase(),
      isNegotiable,
      ...(mode === "create" ? { saveAsDraft } : {}),
      attributeValues,
    };

    try {
      setIsSubmitting(true);
      const savedListing = await onSubmit(payload);

      toast.success(mode === "create"
        ? (saveAsDraft ? "Черновик объявления сохранён." : "Объявление отправлено на проверку.")
        : "Объявление обновлено.");
      router.push(`/account/listings/${savedListing.id}`);
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сохранить объявление."));
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="grid gap-3 md:grid-cols-2">
            {listingTypeCards.map((card) => {
              const Icon = card.icon;
              const isActive = activeType === card.value;

              return (
                <button
                  className={[
                    "rounded-[24px] border p-5 text-left transition duration-200",
                    isActive
                      ? "border-transparent bg-[var(--active-button-bg)] text-white shadow-[0_16px_32px_rgba(0,70,67,0.18)]"
                      : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] hover:border-[var(--accent)]",
                  ].join(" ")}
                  key={card.value}
                  onClick={() => {
                    setActiveType(card.value);
                    setSelectedRootId(null);
                    setSelectedCategoryId(null);
                    setBranch(null);
                    setAttributes([]);
                    setAttributeValues({});
                  }}
                  type="button"
                >
                  <div className={`grid size-12 place-items-center rounded-2xl ${isActive ? "bg-white/12 text-white" : "bg-[var(--accent-soft)]"}`}>
                    <Icon size={22} />
                  </div>
                  <p className="mt-4 text-lg font-black">{card.title}</p>
                  <p className={`mt-2 text-sm leading-7 ${isActive ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Корневая категория">
              <Select
                disabled={isLoadingRoots || filteredRoots.length === 0}
                onChange={(value) => {
                  setSelectedRootId(Number(value));
                  setSelectedCategoryId(null);
                  setBranch(null);
                  setAttributes([]);
                  setAttributeValues({});
                }}
                value={effectiveSelectedRootId ?? ""}
              >
                {filteredRoots.map((root) => (
                  <option key={root.id} value={root.id}>
                    {root.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Конечная категория">
              <Select
                disabled={isLoadingBranch || branchOptions.length === 0}
                onChange={(value) => {
                  setSelectedCategoryId(Number(value));
                  setAttributes([]);
                  setAttributeValues({});
                }}
                value={effectiveSelectedCategoryId ?? ""}
              >
                {branchOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Заголовок">
            <Input
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, Шкаф из массива дуба"
              value={title}
            />
          </Field>

          <Field label="Описание">
            <textarea
              className="min-h-36 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Опишите состояние, особенности, комплектацию и условия сделки."
              value={description}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Цена">
              <Input
                inputMode="numeric"
                onChange={(event) => setPrice(event.target.value)}
                placeholder="12500"
                value={price}
              />
            </Field>

            <Field label="Валюта">
              <Input
                maxLength={3}
                onChange={(event) => setCurrency(event.target.value)}
                placeholder="RUB"
                value={currency}
              />
            </Field>
          </div>

          {activeType === LISTING_TYPE_PRODUCT ? (
            <Field label="Состояние товара">
              <Select
                onChange={(value) => setCondition(Number(value))}
                value={effectiveCondition}
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
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

        <div className="mt-6 grid gap-4">
          {isLoadingBranch || isLoadingAttributes ? (
            <div className="flex min-h-40 items-center justify-center gap-3 rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-muted)]">
              <LoaderCircle className="animate-spin" size={18} />
              Подготавливаем поля
            </div>
          ) : attributes.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--text-muted)]">
              У этой категории пока нет характеристик. Объявление можно сохранить без них.
            </div>
          ) : (
            attributes.map((attribute) => (
              <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] p-4" key={attribute.id}>
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
                  {attribute.isRequired ? (
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--brand-deep)]">
                      обязательно
                    </span>
                  ) : null}
                </div>

                <div className="mt-4">
                  {renderAttributeInput(attribute, attributeValues[attribute.id], handleAttributeChange, handleMultiselectChange)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            className="w-full"
            disabled={isSubmitting || isLoadingRoots || isLoadingBranch || isLoadingAttributes}
            onClick={() => handleSubmit(false)}
            size="lg"
            type="button"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" size={18} />
                Сохраняем
              </>
            ) : mode === "create" ? (
              "Отправить на проверку"
            ) : (
              "Сохранить изменения"
            )}
          </Button>

          {mode === "create" ? (
            <Button
              className="w-full"
              disabled={isSubmitting || isLoadingRoots || isLoadingBranch || isLoadingAttributes}
              onClick={() => handleSubmit(true)}
              size="lg"
              type="button"
              variant="outline"
            >
              Сохранить как черновик
            </Button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[var(--brand-deep)]">{label}</span>
      {children}
    </label>
  );
}

function Select({
  children,
  disabled,
  onChange,
  value,
}: {
  children: ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: number | string;
}) {
  return (
    <select
      className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] disabled:opacity-60"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
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
        placeholder={`Введите ${attribute.name.toLowerCase()}`}
        value={typeof value === "string" ? value : ""}
      />
    );
  }

  if (attribute.type === ATTRIBUTE_TYPE_NUMBER) {
    return (
      <Input
        inputMode="decimal"
        onChange={(event) => onChange(attribute.id, event.target.value === "" ? null : Number(event.target.value))}
        placeholder="Введите число"
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
      <Select onChange={(nextValue) => onChange(attribute.id, nextValue)} value={typeof value === "string" ? value : ""}>
        <option value="">Выберите значение</option>
        {(attribute.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
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
        type="date"
        value={typeof value === "string" ? value : ""}
      />
    );
  }

  return null;
}

function flattenBranchOptions(root: CategoryNode): BranchOption[] {
  const options: BranchOption[] = [];

  const walk = (node: CategoryNode, prefix: string[] = []) => {
    options.push({
      id: node.id,
      label: [...prefix, node.name].join(" / "),
    });

    node.children.forEach((child) => walk(child, [...prefix, node.name]));
  };

  walk(root);

  return options;
}

function defaultAttributeValue(type: number): ListingAttributeValue {
  if (type === ATTRIBUTE_TYPE_MULTISELECT) {
    return [];
  }

  if (type === ATTRIBUTE_TYPE_BOOLEAN) {
    return false;
  }

  return null;
}

function valuesFromListing(listing?: ListingItem): Record<number, ListingAttributeValue> {
  if (listing === undefined) {
    return {};
  }

  return Object.fromEntries(
    listing.attributeValues.map((attributeValue) => [
      attributeValue.attributeDefinitionId,
      attributeValue.value,
    ]),
  );
}
