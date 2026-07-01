import { z } from "zod";
import { nullableStringSchema } from "./common";

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
