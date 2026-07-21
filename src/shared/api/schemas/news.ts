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
  // Deprecated numeric alias; `type` is the canonical string discriminator.
  typeValue: z.number().optional(),
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
]).transform(({ typeValue, ...block }) => {
  void typeValue;

  return block;
});

const newsPostItemWireSchema = z.object({
  id: z.string(),
  publicationStatus: z.enum(["draft", "published", "archived"]).optional(),
  publicationStatusLabel: z.string().optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  status: z.number().optional(),
  statusLabel: z.string().optional(),
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
type NewsPostWire = z.infer<typeof newsPostItemWireSchema>;

export const newsPostItemSchema = newsPostItemWireSchema
  .superRefine(validateNewsPostWire)
  .transform(normalizeNewsPostWire);

export const newsPostDetailSchema = newsPostItemWireSchema.extend({
  contentBlocks: z.array(newsContentBlockSchema),
}).strict()
  .superRefine(validateNewsPostWire)
  .transform(normalizeNewsPostWire);

function validateNewsPostWire(value: NewsPostWire, context: z.RefinementCtx): void {
  if (value.publicationStatus === undefined && value.status === undefined) {
    context.addIssue({
      code: "custom",
      message: "Missing canonical API field publicationStatus.",
      path: ["publicationStatus"],
    });
  }

  if (value.publicationStatusLabel === undefined && value.statusLabel === undefined) {
    context.addIssue({
      code: "custom",
      message: "Missing canonical API field publicationStatusLabel.",
      path: ["publicationStatusLabel"],
    });
  }
}

function normalizeNewsPostWire<T extends NewsPostWire>({
    status,
    statusLabel,
    ...post
  }: T) {
  return {
    ...post,
    publicationStatus: post.publicationStatus ?? resolveLegacyPublicationStatus(status),
    publicationStatusLabel: post.publicationStatusLabel ?? statusLabel ?? "",
  };
}

function resolveLegacyPublicationStatus(status: number | undefined) {
  const values = {
    1: "draft",
    2: "published",
    3: "archived",
  } as const;
  const resolved = status === undefined ? undefined : values[status as keyof typeof values];

  if (resolved === undefined) {
    throw new Error(`Unknown legacy news status: ${String(status)}`);
  }

  return resolved;
}
