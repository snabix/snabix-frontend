import { z } from "zod";
import { nullableStringSchema, stringOrNumberSchema } from "./common";
import {
  attributeValueTypeSchema,
  catalogKindSchema,
  legacyAttributeValueTypes,
  legacyCatalogKinds,
  resolveLegacyEnum,
} from "./marketplace-enums";

type CategoryNodeContract = {
  id: string | number;
  catalogKind: "product" | "service";
  catalogKindLabel: string;
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

type CategoryNodeWire = Omit<CategoryNodeContract, "catalogKind" | "catalogKindLabel" | "children"> & {
  catalogKind?: CategoryNodeContract["catalogKind"];
  catalogKindLabel?: string;
  catalogType?: number;
  catalogTypeLabel?: string;
  children: CategoryNodeWire[];
};

const categoryNodeWireSchema: z.ZodType<CategoryNodeWire> = z.lazy(() => z.object({
  id: stringOrNumberSchema,
  catalogKind: catalogKindSchema.optional(),
  catalogKindLabel: z.string().optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  catalogType: z.number().optional(),
  catalogTypeLabel: z.string().optional(),
  parentId: stringOrNumberSchema.nullable(),
  name: z.string(),
  slug: z.string(),
  description: nullableStringSchema,
  icon: nullableStringSchema,
  sortOrder: z.number(),
  isActive: z.boolean(),
  path: nullableStringSchema,
  depth: z.number(),
  children: z.array(categoryNodeWireSchema),
}).strict().superRefine((value, context) => {
  requireCanonicalOrLegacy(value.catalogKind, value.catalogType, "catalogKind", context);
  requireCanonicalOrLegacy(value.catalogKindLabel, value.catalogTypeLabel, "catalogKindLabel", context);
}));

export const categoryNodeSchema: z.ZodType<CategoryNodeContract> = categoryNodeWireSchema.transform(
  normalizeCategoryNode,
);

export const categorySummarySchema = z.object({
  id: stringOrNumberSchema,
  catalogKind: catalogKindSchema.optional(),
  catalogKindLabel: z.string().optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  catalogType: z.number().optional(),
  catalogTypeLabel: z.string().optional(),
  parentId: stringOrNumberSchema.nullable(),
  name: z.string(),
  slug: z.string(),
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

const categoryAttributeDependencyRuleSchema = z.object({
  attributeDefinitionId: z.number().optional(),
  attributeSlug: z.string().optional(),
  operator: z.enum(["equals", "not_equals", "in", "not_in", "filled", "empty"]),
  value: z.unknown().optional(),
}).strict();

const categoryAttributeDefinitionWireSchema = z.object({
  id: z.number(),
  categoryId: stringOrNumberSchema,
  isInherited: z.boolean(),
  name: z.string(),
  slug: z.string(),
  valueType: attributeValueTypeSchema.optional(),
  valueTypeLabel: z.string().optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  type: z.number().optional(),
  typeLabel: z.string().optional(),
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
}).strict().superRefine((value, context) => {
  requireCanonicalOrLegacy(value.valueType, value.type, "valueType", context);
  requireCanonicalOrLegacy(value.valueTypeLabel, value.typeLabel, "valueTypeLabel", context);
});

export const categoryAttributeDefinitionSchema = categoryAttributeDefinitionWireSchema.transform(({
    type,
    typeLabel,
    ...value
  }) => ({
    ...value,
    valueType: value.valueType ?? resolveLegacyEnum(legacyAttributeValueTypes, type),
    valueTypeLabel: value.valueTypeLabel ?? typeLabel ?? "",
  }));

function normalizeCategoryNode({
  catalogType,
  catalogTypeLabel,
  children,
  ...value
}: CategoryNodeWire): CategoryNodeContract {
  return {
    ...value,
    catalogKind: value.catalogKind ?? resolveLegacyEnum(legacyCatalogKinds, catalogType),
    catalogKindLabel: value.catalogKindLabel ?? catalogTypeLabel ?? "",
    children: children.map(normalizeCategoryNode),
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
