import { z } from "zod";
import { nullableStringSchema, stringOrNumberSchema } from "./common";

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
