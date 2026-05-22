import type {
  CategoryAttributeDefinition,
  CategoryNode,
} from "@/src/entities/category";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

type CategoryAttributesPayload = {
  category: Pick<CategoryNode, "id" | "catalogType" | "catalogTypeLabel" | "parentId" | "name" | "slug">;
  items: CategoryAttributeDefinition[];
};

export async function listRootCategories(): Promise<CategoryNode[]> {
  const response = await api.get<ApiDataResponse<CategoryNode[]>>("/categories/list");

  return unwrapApiData(response.data);
}

export async function showCategoryBranch(categoryId: number): Promise<CategoryNode> {
  const response = await api.get<ApiDataResponse<CategoryNode>>(
    `/categories/${categoryId}/branch`,
  );

  return unwrapApiData(response.data);
}

export async function getCategoryAttributes(categoryId: number): Promise<CategoryAttributeDefinition[]> {
  const response = await api.get<ApiDataResponse<CategoryAttributesPayload>>(
    `/categories/${categoryId}/attributes`,
  );

  return unwrapApiData(response.data).items;
}
