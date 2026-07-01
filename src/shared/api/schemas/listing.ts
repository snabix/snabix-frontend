import { z } from "zod";
import { nullableStringSchema, stringOrNumberSchema } from "./common";

const listingAttributeValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

const listingCategorySchema = z.object({
  id: stringOrNumberSchema,
  catalogType: z.number(),
  catalogTypeLabel: z.string(),
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
}).strict();

const listingAttributeValueItemSchema = z.object({
  attributeDefinitionId: z.number(),
  name: nullableStringSchema,
  slug: nullableStringSchema,
  type: z.number().nullable(),
  typeLabel: nullableStringSchema,
  schemaVersion: z.number().optional(),
  value: listingAttributeValueSchema,
  displayValue: nullableStringSchema,
}).strict();

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

const listingBaseSchema = z.object({
  id: z.string(),
  category: listingCategorySchema.nullable(),
  type: z.number(),
  typeLabel: z.string(),
  status: z.number(),
  statusLabel: z.string(),
  condition: z.number(),
  conditionLabel: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number().nullable(),
  currency: nullableStringSchema,
  isNegotiable: z.boolean(),
  imageUrl: nullableStringSchema.optional(),
  imageUrls: z.array(z.string()).optional(),
  media: z.array(z.object({
    id: z.number(),
    url: z.string(),
    fileName: z.string(),
    order: z.number(),
    isMain: z.boolean(),
  }).strict()).optional(),
  location: listingLocationSchema.nullable().optional(),
  isFavorite: z.boolean().optional(),
  sellerRating: z.number().nullable().optional(),
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
}).strict();

export const publicListingItemSchema = listingBaseSchema;

export const listingItemSchema = listingBaseSchema.extend({
  userId: z.string(),
  contactName: nullableStringSchema,
  contactPhone: nullableStringSchema,
  contactEmail: nullableStringSchema,
  rejectionReason: nullableStringSchema,
}).strict();
