import { z } from "zod";

const nullableStringSchema = z.string().nullable();
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

export const categoryNodeSchema: z.ZodType = z.lazy(() => z.object({
  id: z.number(),
  catalogType: z.number(),
  catalogTypeLabel: z.string(),
  parentId: z.number().nullable(),
  name: z.string(),
  slug: z.string(),
  description: nullableStringSchema,
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
  categoryId: z.number(),
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
  id: z.number(),
  catalogType: z.number(),
  catalogTypeLabel: z.string(),
  parentId: z.number().nullable(),
  name: z.string(),
  slug: z.string(),
  fullName: nullableStringSchema.optional(),
  path: nullableStringSchema.optional(),
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
