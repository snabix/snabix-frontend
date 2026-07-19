import { z } from "zod";

export const listingKindSchema = z.enum(["product", "service"]);
export const listingStatusSchema = z.enum([
  "draft",
  "pendingReview",
  "published",
  "rejected",
  "archived",
]);
export const itemConditionSchema = z.enum(["new", "used", "notApplicable"]);
export const catalogKindSchema = z.enum(["product", "service"]);
export const attributeValueTypeSchema = z.enum([
  "text",
  "number",
  "boolean",
  "select",
  "multiSelect",
  "date",
]);

export const legacyListingKinds = {
  1: "product",
  2: "service",
} as const;
export const legacyListingStatuses = {
  1: "draft",
  2: "pendingReview",
  3: "published",
  4: "rejected",
  5: "archived",
} as const;
export const legacyItemConditions = {
  1: "new",
  2: "used",
  3: "notApplicable",
} as const;
export const legacyCatalogKinds = {
  1: "product",
  2: "service",
} as const;
export const legacyAttributeValueTypes = {
  1: "text",
  2: "number",
  3: "boolean",
  4: "select",
  5: "multiSelect",
  6: "date",
} as const;

export function resolveLegacyEnum<T extends Record<number, string>>(
  values: T,
  legacyValue: number | null | undefined,
): T[keyof T] {
  const resolved = legacyValue === null || legacyValue === undefined
    ? undefined
    : values[legacyValue];

  if (resolved === undefined) {
    throw new Error(`Unknown legacy enum value: ${String(legacyValue)}`);
  }

  return resolved as T[keyof T];
}
