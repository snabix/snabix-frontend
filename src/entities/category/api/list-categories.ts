import { api } from "@/src/shared/api";
import type { CategoryAttributeDefinition, CategoryNode } from "@/src/entities/category/model/types";

type ListCategoriesResponse = {
  data: CategoryNode[];
};

type ShowCategoryBranchResponse = {
  data: CategoryNode;
};

type GetCategoryAttributesResponse = {
  data: {
    category: Pick<CategoryNode, "id" | "catalogType" | "catalogTypeLabel" | "parentId" | "name" | "slug">;
    items: CategoryAttributeDefinition[];
  };
};

export async function listRootCategories(): Promise<CategoryNode[]> {
  const response = await api.get<ListCategoriesResponse>("/categories/list");

  return response.data.data;
}

export async function showCategoryBranch(categoryId: number): Promise<CategoryNode> {
  const response = await api.get<ShowCategoryBranchResponse>(
    `/categories/${categoryId}/branch`,
  );

  return response.data.data;
}

export async function getCategoryAttributes(categoryId: number): Promise<CategoryAttributeDefinition[]> {
  const response = await api.get<GetCategoryAttributesResponse>(
    `/categories/${categoryId}/attributes`,
  );

  return response.data.data.items;
}
