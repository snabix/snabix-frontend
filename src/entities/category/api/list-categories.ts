import type {
  CategoryAttributeDefinition,
  CategoryNode,
} from "@/src/entities/category";
import { z } from "zod";
import {
  api,
  categoryAttributeDefinitionSchema,
  categoryNodeSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function listRootCategories(): Promise<CategoryNode[]> {
  const response = await api.get<ApiDataResponse<unknown>>("/categories/list");

  return parseApiContract(
    categoryNodeSchema.array(),
    unwrapApiData(response.data),
    "Ответ списка категорий не соответствует ожидаемому формату.",
  ) as CategoryNode[];
}

export async function showCategoryBranch(categoryId: number): Promise<CategoryNode> {
  const response = await api.get<ApiDataResponse<unknown>>(
    `/categories/${categoryId}/branch`,
  );

  return parseApiContract(
    categoryNodeSchema,
    unwrapApiData(response.data),
    "Ответ ветки категории не соответствует ожидаемому формату.",
  ) as CategoryNode;
}

export async function getCategoryAttributes(categoryId: number): Promise<CategoryAttributeDefinition[]> {
  const response = await api.get<ApiDataResponse<unknown>>(
    `/categories/${categoryId}/attributes`,
  );

  const payload = parseApiContract(
    categoryAttributesPayloadSchema,
    unwrapApiData(response.data),
    "Ответ характеристик категории не соответствует ожидаемому формату.",
  );

  return payload.items as CategoryAttributeDefinition[];
}

const categoryAttributesPayloadSchema = z.object({
  category: z.object({
    id: z.number(),
    catalogType: z.number(),
    catalogTypeLabel: z.string(),
    parentId: z.number().nullable(),
    name: z.string(),
    slug: z.string(),
  }).passthrough(),
  items: z.array(categoryAttributeDefinitionSchema),
}).passthrough();
