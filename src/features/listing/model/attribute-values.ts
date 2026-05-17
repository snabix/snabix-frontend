import type { CategoryAttributeDefinition } from "@/src/entities/category/model/types";
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
  values: Record<number, ListingAttributeValue>,
): ListingAttributeValue {
  if (Object.hasOwn(values, attribute.id)) {
    return values[attribute.id];
  }

  return defaultAttributeValue(attribute);
}

export function buildAttributePayload(
  attributes: CategoryAttributeDefinition[],
  values: Record<number, ListingAttributeValue>,
): Record<number, ListingAttributeValue> {
  const payload: Record<number, ListingAttributeValue> = {};

  for (const attribute of attributes) {
    payload[attribute.id] = getAttributeValue(attribute, values);
  }

  return payload;
}

export function valuesFromListing(
  listing?: ListingItem,
): Record<number, ListingAttributeValue> {
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
      const parsedValue = Number(defaultValue);

      return Number.isNaN(parsedValue) ? null : parsedValue;
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

