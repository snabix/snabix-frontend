import { api } from "@/src/shared/api";
import type { CategoryNode } from "@/src/entities/category/model/types";

type ListCategoriesResponse = {
  data: CategoryNode[];
};

type ShowCategoryBranchResponse = {
  data: CategoryNode;
};

export async function listRootCategories(): Promise<CategoryNode[]> {
  const response = await api.get<ListCategoriesResponse>("/categories");

  return response.data.data;
}

export async function showCategoryBranch(categoryId: number): Promise<CategoryNode> {
  const response = await api.get<ShowCategoryBranchResponse>(
    `/categories/${categoryId}/branch`,
  );

  return response.data.data;
}
