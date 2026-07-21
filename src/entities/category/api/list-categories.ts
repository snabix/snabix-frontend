import type {
  CategoryAttributeDefinition,
  CategoryNode,
} from "@/src/entities/category";
import { z } from "zod";
import {
  categoryAttributeDefinitionSchema,
  categoryNodeSchema,
  categorySummarySchema,
  getData,
} from "@/src/shared/api";

export async function listRootCategories(): Promise<CategoryNode[]> {
  return getData(
    categoryNodeSchema.array(),
    "/categories/list",
    { errorMessage: "Ответ списка категорий не соответствует ожидаемому формату." },
  );
}

export async function showCategoryBranch(categoryId: string | number): Promise<CategoryNode> {
  return getData(
    categoryNodeSchema,
    `/categories/${categoryId}/branch`,
    { errorMessage: "Ответ ветки категории не соответствует ожидаемому формату." },
  );
}

export async function getCategoryAttributes(categoryId: string | number): Promise<CategoryAttributeDefinition[]> {
  const payload = await getData(
    categoryAttributesPayloadSchema,
    `/categories/${categoryId}/attributes`,
    { errorMessage: "Ответ характеристик категории не соответствует ожидаемому формату." },
  );

  return payload.items;
}

const categoryAttributesPayloadSchema = z.object({
  category: categorySummarySchema,
  items: z.array(categoryAttributeDefinitionSchema),
}).strict();
