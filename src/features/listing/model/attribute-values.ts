import type { CategoryAttributeDefinition } from "@/src/entities/category";
import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";
import {
  ATTRIBUTE_TYPE_BOOLEAN,
  ATTRIBUTE_TYPE_MULTISELECT,
  ATTRIBUTE_TYPE_NUMBER,
} from "@/src/features/listing/model/listing-form-constants";

export type AttributeGroup = {
  name: string;
  items: CategoryAttributeDefinition[];
};

export function groupAttributesByName(
  attributes: CategoryAttributeDefinition[],
): AttributeGroup[] {
  const groups = new Map<string, CategoryAttributeDefinition[]>();

  for (const attribute of attributes) {
    const groupName = attribute.groupName?.trim() || "Основные характеристики";
    const groupItems = groups.get(groupName) ?? [];

    groupItems.push(attribute);
    groups.set(groupName, groupItems);
  }

  return Array.from(groups, ([name, items]) => ({ items, name }));
}

export function getAttributeValue(
  attribute: CategoryAttributeDefinition,
  values: Record<string, ListingAttributeValue>,
): ListingAttributeValue {
  const attributeKey = String(attribute.id);

  if (Object.hasOwn(values, attributeKey)) {
    return values[attributeKey];
  }

  return defaultAttributeValue(attribute);
}

export function buildAttributePayload(
  attributes: CategoryAttributeDefinition[],
  values: Record<string, ListingAttributeValue>,
): Record<string, ListingAttributeValue> {
  const payload: Record<string, ListingAttributeValue> = {};

  for (const attribute of attributes) {
    payload[String(attribute.id)] = getAttributeValue(attribute, values);
  }

  return payload;
}

export function filterVisibleAttributes(
  attributes: CategoryAttributeDefinition[],
  values: Record<string, ListingAttributeValue>,
): CategoryAttributeDefinition[] {
  return attributes.filter((attribute) => isAttributeVisible(attribute, attributes, values));
}

export function pruneHiddenAttributeValues(
  attributes: CategoryAttributeDefinition[],
  values: Record<string, ListingAttributeValue>,
): Record<string, ListingAttributeValue> {
  const visibleAttributeIds = new Set(
    filterVisibleAttributes(attributes, values).map((attribute) => String(attribute.id)),
  );

  return Object.fromEntries(
    Object.entries(values).filter(([attributeId]) => visibleAttributeIds.has(attributeId)),
  );
}

export function parseAttributeNumber(value: string): number | null {
  const normalizedValue = value.trim().replace(",", ".");

  if (normalizedValue === "") {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function valuesFromListing(
  listing?: ListingItem,
): Record<string, ListingAttributeValue> {
  if (listing === undefined) {
    return {};
  }

  return Object.fromEntries(
    listing.attributeValues.map((attributeValue) => [
      String(attributeValue.attributeDefinitionId),
      attributeValue.value,
    ]),
  );
}

function defaultAttributeValue(
  attribute: CategoryAttributeDefinition,
): ListingAttributeValue {
  const defaultValue = normalizeDefaultValue(attribute.defaultValue);

  if (attribute.valueType === ATTRIBUTE_TYPE_MULTISELECT) {
    return Array.isArray(defaultValue) ? defaultValue.map(String) : [];
  }

  if (attribute.valueType === ATTRIBUTE_TYPE_BOOLEAN) {
    if (typeof defaultValue === "boolean") {
      return defaultValue;
    }

    if (typeof defaultValue === "string") {
      return defaultValue === "true" || defaultValue === "1";
    }

    return false;
  }

  if (attribute.valueType === ATTRIBUTE_TYPE_NUMBER) {
    if (typeof defaultValue === "number") {
      return defaultValue;
    }

    if (typeof defaultValue === "string" && defaultValue.trim() !== "") {
      return parseAttributeNumber(defaultValue);
    }

    return null;
  }

  if (typeof defaultValue === "string") {
    return defaultValue;
  }

  return null;
}

function normalizeDefaultValue(
  defaultValue: CategoryAttributeDefinition["defaultValue"],
): unknown {
  if (defaultValue === null) {
    return null;
  }

  if (Array.isArray(defaultValue)) {
    return defaultValue;
  }

  if (typeof defaultValue === "object" && "value" in defaultValue) {
    return defaultValue.value;
  }

  return defaultValue;
}

function isAttributeVisible(
  attribute: CategoryAttributeDefinition,
  attributes: CategoryAttributeDefinition[],
  values: Record<string, ListingAttributeValue>,
  visitedAttributeIds: Set<number> = new Set(),
): boolean {
  const rules = attribute.dependencyRules ?? [];

  if (rules.length === 0) {
    return true;
  }

  if (visitedAttributeIds.has(attribute.id)) {
    return false;
  }

  const nextVisitedAttributeIds = new Set(visitedAttributeIds);

  nextVisitedAttributeIds.add(attribute.id);

  return rules.every((rule) => {
    const dependencyAttribute = findDependencyAttribute(rule, attributes);

    if (dependencyAttribute === null) {
      return false;
    }

    if (!isAttributeVisible(dependencyAttribute, attributes, values, nextVisitedAttributeIds)) {
      return false;
    }

    const currentValue = getAttributeValue(dependencyAttribute, values);

    return matchesDependencyRule(currentValue, rule.operator, rule.value);
  });
}

function findDependencyAttribute(
  rule: NonNullable<CategoryAttributeDefinition["dependencyRules"]>[number],
  attributes: CategoryAttributeDefinition[],
): CategoryAttributeDefinition | null {
  if (rule.attributeDefinitionId !== undefined) {
    return attributes.find((attribute) => attribute.id === rule.attributeDefinitionId) ?? null;
  }

  if (rule.attributeSlug !== undefined && rule.attributeSlug.trim() !== "") {
    return attributes.find((attribute) => attribute.slug === rule.attributeSlug) ?? null;
  }

  return null;
}

function matchesDependencyRule(
  currentValue: ListingAttributeValue,
  operator: NonNullable<CategoryAttributeDefinition["dependencyRules"]>[number]["operator"],
  expectedValue: unknown,
): boolean {
  if (operator === "filled") {
    return isFilledAttributeValue(currentValue);
  }

  if (operator === "empty") {
    return !isFilledAttributeValue(currentValue);
  }

  if (operator === "equals") {
    return compareAttributeValue(currentValue, expectedValue);
  }

  if (operator === "not_equals") {
    return !compareAttributeValue(currentValue, expectedValue);
  }

  if (operator === "in") {
    return isValueInExpectedList(currentValue, expectedValue);
  }

  if (operator === "not_in") {
    return !isValueInExpectedList(currentValue, expectedValue);
  }

  return true;
}

function isFilledAttributeValue(value: ListingAttributeValue): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  return value !== null;
}

function compareAttributeValue(currentValue: ListingAttributeValue, expectedValue: unknown): boolean {
  if (Array.isArray(currentValue)) {
    return currentValue.some((item) => compareScalarValue(item, expectedValue));
  }

  return compareScalarValue(currentValue, expectedValue);
}

function isValueInExpectedList(currentValue: ListingAttributeValue, expectedValue: unknown): boolean {
  const expectedValues = Array.isArray(expectedValue)
    ? expectedValue
    : [expectedValue];

  if (Array.isArray(currentValue)) {
    return currentValue.some((item) => expectedValues.some((expectedItem) => compareScalarValue(item, expectedItem)));
  }

  return expectedValues.some((expectedItem) => compareScalarValue(currentValue, expectedItem));
}

function compareScalarValue(currentValue: ListingAttributeValue, expectedValue: unknown): boolean {
  if (currentValue === null || expectedValue === null || expectedValue === undefined) {
    return currentValue === expectedValue;
  }

  return String(currentValue) === String(expectedValue);
}
