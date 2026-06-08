import { z } from "zod";

const nullableStringSchema = z.string().nullable();
const stringOrNumberSchema = z.union([z.string(), z.number()]);
const listingAttributeValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

const userAddressSchema = z.object({
  id: z.string(),
  label: nullableStringSchema,
  addressLine: nullableStringSchema,
  isPrimary: z.boolean(),
  region: z.object({
    id: z.number(),
    name: z.string(),
    fullName: z.string().optional(),
    label: z.string(),
  }).passthrough(),
  city: z.object({
    id: z.number(),
    name: z.string(),
    label: z.string(),
  }).passthrough().nullable(),
}).passthrough();

const userAvatarSchema = z.object({
  id: z.number(),
  url: nullableStringSchema,
  fileName: z.string(),
  mimeType: nullableStringSchema,
  size: z.number(),
  humanReadableSize: z.string(),
}).passthrough();

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: nullableStringSchema,
  addresses: z.array(userAddressSchema),
  isActive: z.boolean(),
  emailVerifiedAt: nullableStringSchema,
  avatar: userAvatarSchema.nullable(),
}).passthrough();

export const activeUserSessionSchema = z.object({
  id: z.string(),
  deviceName: z.string(),
  browser: z.string(),
  ipAddress: nullableStringSchema,
  type: z.enum(["desktop", "mobile", "tablet"]),
  isCurrent: z.boolean(),
  lastActivityAt: nullableStringSchema,
}).passthrough();

export const activeUserSessionsResponseSchema = z.object({
  items: z.array(activeUserSessionSchema),
}).passthrough();

export const categoryNodeSchema: z.ZodType = z.lazy(() => z.object({
  id: stringOrNumberSchema,
  catalogType: z.number(),
  catalogTypeLabel: z.string(),
  parentId: stringOrNumberSchema.nullable(),
  name: z.string(),
  slug: z.string(),
  description: nullableStringSchema,
  icon: nullableStringSchema,
  sortOrder: z.number(),
  isActive: z.boolean(),
  path: nullableStringSchema,
  depth: z.number(),
  children: z.array(categoryNodeSchema),
}).passthrough());

const categoryAttributeDependencyRuleSchema = z.object({
  attributeDefinitionId: z.number().optional(),
  attributeSlug: z.string().optional(),
  operator: z.enum(["equals", "not_equals", "in", "not_in", "filled", "empty"]),
  value: z.unknown().optional(),
}).passthrough();

export const categoryAttributeDefinitionSchema = z.object({
  id: z.number(),
  categoryId: stringOrNumberSchema,
  isInherited: z.boolean(),
  name: z.string(),
  slug: z.string(),
  type: z.number(),
  typeLabel: z.string(),
  unit: nullableStringSchema,
  description: nullableStringSchema,
  placeholder: nullableStringSchema,
  helpText: nullableStringSchema,
  defaultValue: z.union([
    z.record(z.string(), z.unknown()),
    z.array(z.string()),
    z.null(),
  ]),
  dependencyRules: z.array(categoryAttributeDependencyRuleSchema).nullable().default(null),
  groupName: nullableStringSchema,
  options: z.array(z.string()).nullable(),
  isRequired: z.boolean(),
  isFilterable: z.boolean(),
  showInCard: z.boolean(),
  schemaVersion: z.number().optional(),
  isActive: z.boolean(),
  appliesToChildren: z.boolean(),
  sortOrder: z.number(),
}).passthrough();

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
  }).passthrough()).optional(),
}).passthrough();

const listingAttributeValueItemSchema = z.object({
  attributeDefinitionId: z.number(),
  name: nullableStringSchema,
  slug: nullableStringSchema,
  type: z.number().nullable(),
  typeLabel: nullableStringSchema,
  value: listingAttributeValueSchema,
  displayValue: nullableStringSchema,
}).passthrough();

const listingLocationSchema = z.object({
  source: z.string(),
  profileAddressId: nullableStringSchema.optional(),
  label: nullableStringSchema.optional(),
  region: z.object({
    id: z.number(),
    name: z.string(),
    fullName: nullableStringSchema.optional(),
    label: z.string(),
  }).passthrough(),
  city: z.object({
    id: z.number(),
    name: z.string(),
    label: z.string(),
    lat: nullableStringSchema.optional(),
    lon: nullableStringSchema.optional(),
  }).passthrough().nullable(),
  addressLine: nullableStringSchema,
  display: nullableStringSchema,
  coordinates: z.object({
    lat: z.union([z.number(), z.string()]).nullable(),
    lng: z.union([z.number(), z.string()]).nullable(),
  }).passthrough().optional(),
  mapProvider: nullableStringSchema.optional(),
  mapPlaceId: nullableStringSchema.optional(),
}).passthrough();

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
  }).passthrough()).optional(),
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
}).passthrough();

export const publicListingItemSchema = listingBaseSchema;

export const listingItemSchema = listingBaseSchema.extend({
  userId: z.string(),
  contactName: nullableStringSchema,
  contactPhone: nullableStringSchema,
  contactEmail: nullableStringSchema,
  rejectionReason: nullableStringSchema,
}).passthrough();

const newsMediaSchema = z.object({
  id: z.number(),
  url: z.string(),
  fileName: z.string(),
  mimeType: nullableStringSchema,
}).passthrough();

const newsAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
}).passthrough();

const newsContentBlockBaseSchema = z.object({
  id: z.string(),
  type: z.enum([
    "lead",
    "paragraph",
    "quote",
    "split",
    "steps",
    "metrics",
    "image",
    "gallery",
    "table",
    "imageGrid",
    "cta",
  ]),
  typeValue: z.number(),
  typeLabel: z.string(),
  sortOrder: z.number(),
}).passthrough();

export const newsContentBlockSchema = newsContentBlockBaseSchema.extend({
  text: z.string().optional(),
  author: z.string().optional(),
  title: z.string().optional(),
  buttonLabel: z.string().optional(),
  href: z.string().optional(),
  imageUrl: z.string().optional(),
  caption: z.string().optional(),
  media: newsMediaSchema.optional(),
  items: z.array(z.record(z.string(), z.unknown())).optional(),
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))).optional(),
}).passthrough();

export const newsPostItemSchema = z.object({
  id: z.string(),
  status: z.number(),
  statusLabel: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  eyebrow: nullableStringSchema,
  description: z.string(),
  thesis: nullableStringSchema,
  isFeatured: z.boolean(),
  viewsCount: z.number(),
  imageUrl: nullableStringSchema.optional(),
  coverMedia: newsMediaSchema.nullable(),
  author: newsAuthorSchema.nullable(),
  publishedAt: nullableStringSchema,
  createdAt: nullableStringSchema,
  updatedAt: nullableStringSchema,
}).passthrough();

export const newsPostDetailSchema = newsPostItemSchema.extend({
  contentBlocks: z.array(newsContentBlockSchema),
}).passthrough();
