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

  if (attribute.type === ATTRIBUTE_TYPE_MULTISELECT) {
    return Array.isArray(defaultValue) ? defaultValue.map(String) : [];
  }

  if (attribute.type === ATTRIBUTE_TYPE_BOOLEAN) {
    if (typeof defaultValue === "boolean") {
      return defaultValue;
    }

    if (typeof defaultValue === "string") {
      return defaultValue === "true" || defaultValue === "1";
    }

    return false;
  }

  if (attribute.type === ATTRIBUTE_TYPE_NUMBER) {
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
