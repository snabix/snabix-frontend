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

type CategoryNodeContract = {
  id: string | number;
  catalogType: number;
  catalogTypeLabel: string;
  parentId: string | number | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  path: string | null;
  depth: number;
  children: CategoryNodeContract[];
};

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
  }).strict(),
  city: z.object({
    id: z.number(),
    name: z.string(),
    label: z.string(),
  }).strict().nullable(),
}).strict();

const userAvatarSchema = z.object({
  id: z.number(),
  url: nullableStringSchema,
  fileName: z.string(),
  mimeType: nullableStringSchema,
  size: z.number(),
  humanReadableSize: z.string(),
}).strict();

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
}).strict();

export const activeUserSessionSchema = z.object({
  id: z.string(),
  deviceName: z.string(),
  browser: z.string(),
  ipAddress: nullableStringSchema,
  type: z.enum(["desktop", "mobile", "tablet"]),
  isCurrent: z.boolean(),
  lastActivityAt: nullableStringSchema,
}).strict();

export const activeUserSessionsResponseSchema = z.object({
  items: z.array(activeUserSessionSchema),
}).strict();

export const categoryNodeSchema: z.ZodType<CategoryNodeContract> = z.lazy(() => z.object({
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
}).strict());

const categoryAttributeDependencyRuleSchema = z.object({
  attributeDefinitionId: z.number().optional(),
  attributeSlug: z.string().optional(),
  operator: z.enum(["equals", "not_equals", "in", "not_in", "filled", "empty"]),
  value: z.unknown().optional(),
}).strict();

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
}).strict();

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

const newsMediaSchema = z.object({
  id: z.number(),
  url: z.string(),
  fileName: z.string(),
  mimeType: nullableStringSchema,
}).strict();

const newsAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
}).strict();

const newsContentBlockBaseSchema = z.object({
  id: z.string(),
  typeValue: z.number(),
  typeLabel: z.string(),
  sortOrder: z.number(),
}).strict();

const newsLeadBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("lead"),
  text: z.string(),
}).strict();

const newsParagraphBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("paragraph"),
  text: z.string(),
}).strict();

const newsQuoteBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("quote"),
  author: z.string().optional(),
  text: z.string(),
}).strict();

const newsSplitBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("split"),
  items: z.array(z.object({
    title: z.string(),
    text: z.string(),
  }).strict()),
}).strict();

const newsStepsBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("steps"),
  items: z.array(z.object({
    title: z.string(),
    text: z.string(),
  }).strict()),
}).strict();

const newsMetricsBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("metrics"),
  items: z.array(z.object({
    label: z.string(),
    value: z.string(),
  }).strict()),
}).strict();

const newsImageItemSchema = z.object({
  caption: z.string().optional(),
  imageUrl: z.string().optional(),
  media: newsMediaSchema.optional(),
}).strict();

const newsImageBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("image"),
  caption: z.string().optional(),
  imageUrl: z.string().optional(),
  media: newsMediaSchema.optional(),
}).strict();

const newsGalleryBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("gallery"),
  items: z.array(newsImageItemSchema),
}).strict();

const newsTableBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("table"),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
}).strict();

const newsImageGridBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("imageGrid"),
  items: z.array(newsImageItemSchema.extend({
    title: z.string().optional(),
    text: z.string().optional(),
  }).strict()),
}).strict();

const newsCtaBlockSchema = newsContentBlockBaseSchema.extend({
  type: z.literal("cta"),
  buttonLabel: z.string().optional(),
  href: z.string().optional(),
  text: z.string().optional(),
  title: z.string().optional(),
}).strict();

export const newsContentBlockSchema = z.discriminatedUnion("type", [
  newsLeadBlockSchema,
  newsParagraphBlockSchema,
  newsQuoteBlockSchema,
  newsSplitBlockSchema,
  newsStepsBlockSchema,
  newsMetricsBlockSchema,
  newsImageBlockSchema,
  newsGalleryBlockSchema,
  newsTableBlockSchema,
  newsImageGridBlockSchema,
  newsCtaBlockSchema,
]);

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
  readingTime: nullableStringSchema,
  isFeatured: z.boolean(),
  viewsCount: z.number(),
  imageUrl: nullableStringSchema.optional(),
  coverMedia: newsMediaSchema.nullable(),
  author: newsAuthorSchema.nullable(),
  publishedAt: nullableStringSchema,
  createdAt: nullableStringSchema,
  updatedAt: nullableStringSchema,
}).strict();

export const newsPostDetailSchema = newsPostItemSchema.extend({
  contentBlocks: z.array(newsContentBlockSchema),
}).strict();
