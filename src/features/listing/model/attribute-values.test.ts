import { describe, expect, it } from "vitest";
import type { CategoryAttributeDefinition } from "@/src/entities/category";
import {
  filterVisibleAttributes,
  parseAttributeNumber,
  pruneHiddenAttributeValues,
} from "@/src/features/listing/model/attribute-values";

function makeAttribute(
  overrides: Partial<CategoryAttributeDefinition>,
): CategoryAttributeDefinition {
  return {
    id: 1,
    appliesToChildren: true,
    categoryId: 1,
    defaultValue: null,
    dependencyRules: null,
    description: null,
    groupName: "Основные",
    helpText: null,
    isActive: true,
    isFilterable: true,
    isInherited: false,
    isRequired: false,
    name: "Характеристика",
    options: null,
    placeholder: null,
    showInCard: false,
    slug: "attribute",
    sortOrder: 10,
    type: 1,
    typeLabel: "Текст",
    unit: null,
    ...overrides,
  };
}

describe("attribute values helpers", () => {
  it("parses numeric category attributes safely", () => {
    expect(parseAttributeNumber("12")).toBe(12);
    expect(parseAttributeNumber("12.5")).toBe(12.5);
    expect(parseAttributeNumber("12,5")).toBe(12.5);
  });

  it("returns null for empty or invalid category number", () => {
    expect(parseAttributeNumber("")).toBeNull();
    expect(parseAttributeNumber("abc")).toBeNull();
  });

  it("filters attributes by equals dependency rule", () => {
    const brand = makeAttribute({ id: 10, name: "Бренд", slug: "brand" });
    const model = makeAttribute({
      dependencyRules: [
        {
          attributeSlug: "brand",
          operator: "equals",
          value: "Apple",
        },
      ],
      id: 11,
      name: "Модель",
      slug: "model",
    });

    expect(filterVisibleAttributes([brand, model], { 10: "Samsung" })).toEqual([brand]);
    expect(filterVisibleAttributes([brand, model], { 10: "Apple" })).toEqual([brand, model]);
  });

  it("supports filled and in dependency rules", () => {
    const condition = makeAttribute({ id: 20, name: "Состояние", slug: "condition" });
    const tags = makeAttribute({ id: 21, name: "Комплектация", slug: "kit" });
    const warranty = makeAttribute({
      dependencyRules: [
        {
          attributeDefinitionId: 20,
          operator: "filled",
        },
        {
          attributeSlug: "kit",
          operator: "in",
          value: ["Коробка", "Чек"],
        },
      ],
      id: 22,
      name: "Гарантия",
      slug: "warranty",
    });

    expect(filterVisibleAttributes([condition, tags, warranty], {
      20: "Новое",
      21: ["Зарядка"],
    })).toEqual([condition, tags]);
    expect(filterVisibleAttributes([condition, tags, warranty], {
      20: "Новое",
      21: ["Чек"],
    })).toEqual([condition, tags, warranty]);
  });

  it("prunes values for hidden dependent attributes", () => {
    const brand = makeAttribute({ id: 30, name: "Бренд", slug: "brand" });
    const model = makeAttribute({
      dependencyRules: [
        {
          attributeSlug: "brand",
          operator: "equals",
          value: "Apple",
        },
      ],
      id: 31,
      name: "Модель",
      slug: "model",
    });

    expect(pruneHiddenAttributeValues([brand, model], {
      30: "Samsung",
      31: "iPhone",
    })).toEqual({
      30: "Samsung",
    });
  });

  it("hides chained attributes when their dependency is hidden", () => {
    const brand = makeAttribute({ id: 40, name: "Бренд", slug: "brand" });
    const model = makeAttribute({
      dependencyRules: [
        {
          attributeSlug: "brand",
          operator: "equals",
          value: "Apple",
        },
      ],
      id: 41,
      name: "Модель",
      slug: "model",
    });
    const memory = makeAttribute({
      defaultValue: { value: "256 GB" },
      dependencyRules: [
        {
          attributeSlug: "model",
          operator: "filled",
        },
      ],
      id: 42,
      name: "Память",
      slug: "memory",
    });

    expect(filterVisibleAttributes([brand, model, memory], {
      40: "Samsung",
    })).toEqual([brand]);
  });
});
