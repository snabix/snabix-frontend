import { z } from "zod";
import { nullableStringSchema, stringOrNumberSchema } from "./common";
import {
  attributeValueTypeSchema,
  catalogKindSchema,
  itemConditionSchema,
  legacyAttributeValueTypes,
  legacyCatalogKinds,
  legacyItemConditions,
  legacyListingKinds,
  legacyListingStatuses,
  listingKindSchema,
  listingStatusSchema,
  resolveLegacyEnum,
} from "./marketplace-enums";

const listingAttributeValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

const listingCategorySchema = z.object({
  id: stringOrNumberSchema,
  catalogKind: catalogKindSchema.optional(),
  catalogKindLabel: z.string().optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  catalogType: z.number().optional(),
  catalogTypeLabel: z.string().optional(),
  parentId: stringOrNumberSchema.nullable(),
  name: z.string(),
  slug: z.string(),
  fullName: nullableStringSchema.optional(),
  path: nullableStringSchema.optional(),
  breadcrumbs: z.array(z.object({
    id: stringOrNumberSchema,
    name: z.string(),
    slug: z.string(),
  }).strict()).optional(),
}).strict().superRefine((value, context) => {
  requireCanonicalOrLegacy(value.catalogKind, value.catalogType, "catalogKind", context);
  requireCanonicalOrLegacy(value.catalogKindLabel, value.catalogTypeLabel, "catalogKindLabel", context);
}).transform(({
  catalogType,
  catalogTypeLabel,
  ...value
}) => ({
  ...value,
  catalogKind: value.catalogKind ?? resolveLegacyEnum(legacyCatalogKinds, catalogType),
  catalogKindLabel: value.catalogKindLabel ?? catalogTypeLabel ?? "",
}));

const listingAttributeValueItemSchema = z.object({
  attributeDefinitionId: z.number(),
  name: nullableStringSchema,
  slug: nullableStringSchema,
  valueType: attributeValueTypeSchema.nullable().optional(),
  valueTypeLabel: nullableStringSchema.optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  type: z.number().nullable().optional(),
  typeLabel: nullableStringSchema.optional(),
  schemaVersion: z.number().optional(),
  value: listingAttributeValueSchema,
  displayValue: nullableStringSchema,
}).strict().superRefine((value, context) => {
  requireCanonicalOrLegacy(value.valueType, value.type, "valueType", context);
  requireCanonicalOrLegacy(value.valueTypeLabel, value.typeLabel, "valueTypeLabel", context);
}).transform(({
  type,
  typeLabel,
  ...value
}) => ({
  ...value,
  valueType: value.valueType ?? resolveLegacyEnum(legacyAttributeValueTypes, type),
  valueTypeLabel: value.valueTypeLabel ?? typeLabel ?? null,
}));

const listingLocationSchema = z.object({
  source: z.string(),
  profileAddressId: nullableStringSchema.optional(),
  label: nullableStringSchema.optional(),
  region: z.object({
    id: z.number(),
    name: z.string(),
    fullName: nullableStringSchema.optional(),
    label: z.string(),
  }).strict(),
  city: z.object({
    id: z.number(),
    name: z.string(),
    label: z.string(),
    lat: nullableStringSchema.optional(),
    lon: nullableStringSchema.optional(),
  }).strict().nullable(),
  addressLine: nullableStringSchema,
  display: nullableStringSchema,
  coordinates: z.object({
    lat: z.union([z.number(), z.string()]).nullable(),
    lng: z.union([z.number(), z.string()]).nullable(),
  }).strict().optional(),
  mapProvider: nullableStringSchema.optional(),
  mapPlaceId: nullableStringSchema.optional(),
}).strict();

const listingMediaSchema = z.array(z.object({
  id: z.number(),
  url: z.string(),
  fileName: z.string(),
  order: z.number(),
  isMain: z.boolean(),
}).strict());

const listingBaseShape = {
  id: z.string(),
  category: listingCategorySchema.nullable(),
  listingKind: listingKindSchema.optional(),
  listingKindLabel: z.string().optional(),
  listingStatus: listingStatusSchema.optional(),
  listingStatusLabel: z.string().optional(),
  itemCondition: itemConditionSchema.optional(),
  itemConditionLabel: z.string().optional(),
  priceAmountMinor: z.number().nullable().optional(),
  priceCurrency: nullableStringSchema.optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  type: z.number().optional(),
  typeLabel: z.string().optional(),
  status: z.number().optional(),
  statusLabel: z.string().optional(),
  condition: z.number().optional(),
  conditionLabel: z.string().optional(),
  price: z.number().nullable().optional(),
  currency: nullableStringSchema.optional(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  isNegotiable: z.boolean(),
  imageUrl: nullableStringSchema.optional(),
  imageUrls: z.array(z.string()).optional(),
  location: listingLocationSchema.nullable().optional(),
  isFavorite: z.boolean().optional(),
  sellerRating: z.number().nullable().optional(),
  sellerReviewCount: z.number().optional(),
  city: nullableStringSchema.optional(),
  region: nullableStringSchema.optional(),
  street: nullableStringSchema.optional(),
  house: nullableStringSchema.optional(),
  addressLine: nullableStringSchema.optional(),
  fullLocation: nullableStringSchema.optional(),
  viewsCount: z.number(),
  isFeatured: z.boolean(),
  publishedAt: nullableStringSchema,
  expiresAt: nullableStringSchema,
  attributeValues: z.array(listingAttributeValueItemSchema),
};

const listingPrivateShape = {
  userId: z.string(),
  contactName: nullableStringSchema,
  contactPhone: nullableStringSchema,
  contactEmail: nullableStringSchema,
  media: listingMediaSchema,
  rejectionReason: nullableStringSchema,
};

const publicListingWireSchema = z.object(listingBaseShape).strict();
const privateListingWireSchema = z.object({
  ...listingBaseShape,
  ...listingPrivateShape,
}).strict();
type PublicListingWire = z.infer<typeof publicListingWireSchema>;

export const publicListingItemSchema = publicListingWireSchema
  .superRefine(validateListingWire)
  .transform(normalizeListingWire);
export const listingItemSchema = privateListingWireSchema
  .superRefine(validateListingWire)
  .transform(normalizeListingWire);

function validateListingWire(value: PublicListingWire, context: z.RefinementCtx): void {
  requireCanonicalOrLegacy(value.listingKind, value.type, "listingKind", context);
  requireCanonicalOrLegacy(value.listingKindLabel, value.typeLabel, "listingKindLabel", context);
  requireCanonicalOrLegacy(value.listingStatus, value.status, "listingStatus", context);
  requireCanonicalOrLegacy(value.listingStatusLabel, value.statusLabel, "listingStatusLabel", context);
  requireCanonicalOrLegacy(value.itemCondition, value.condition, "itemCondition", context);
  requireCanonicalOrLegacy(value.itemConditionLabel, value.conditionLabel, "itemConditionLabel", context);
  requireCanonicalOrLegacyPresence(value, "priceAmountMinor", "price", context);
  requireCanonicalOrLegacyPresence(value, "priceCurrency", "currency", context);
}

function normalizeListingWire<T extends PublicListingWire>({
    type,
    typeLabel,
    status,
    statusLabel,
    condition,
    conditionLabel,
    price,
    currency,
    ...value
  }: T) {
  return {
    ...value,
    listingKind: value.listingKind ?? resolveLegacyEnum(legacyListingKinds, type),
    listingKindLabel: value.listingKindLabel ?? typeLabel ?? "",
    listingStatus: value.listingStatus ?? resolveLegacyEnum(legacyListingStatuses, status),
    listingStatusLabel: value.listingStatusLabel ?? statusLabel ?? "",
    itemCondition: value.itemCondition ?? resolveLegacyEnum(legacyItemConditions, condition),
    itemConditionLabel: value.itemConditionLabel ?? conditionLabel ?? "",
    priceAmountMinor: value.priceAmountMinor !== undefined
      ? value.priceAmountMinor
      : price ?? null,
    priceCurrency: value.priceCurrency !== undefined
      ? value.priceCurrency
      : currency ?? null,
  };
}

function requireCanonicalOrLegacy(
  canonical: unknown,
  legacy: unknown,
  path: string,
  context: z.RefinementCtx,
): void {
  if (canonical === undefined && legacy === undefined) {
    context.addIssue({
      code: "custom",
      message: `Missing canonical API field ${path}.`,
      path: [path],
    });
  }
}

function requireCanonicalOrLegacyPresence(
  value: object,
  canonical: string,
  legacy: string,
  context: z.RefinementCtx,
): void {
  if (!hasOwn(value, canonical) && !hasOwn(value, legacy)) {
    context.addIssue({
      code: "custom",
      message: `Missing canonical API field ${canonical}.`,
      path: [canonical],
    });
  }
}

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}
